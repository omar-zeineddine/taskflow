import { create } from "zustand";

import type { ChatMessageWithUser, ChatState } from "@/types/chat";

import { supabase } from "@/lib/supabase";
import { ChatService } from "@/services/chat";
import { useAuthStore } from "@/stores/auth";
import { useErrorStore } from "@/stores/error";

let chatSubscription: any = null;

export const useChatStore = create<ChatState>((set, _get) => ({
  messages: [],
  loading: false,
  error: null,
  isOpen: false,
  unreadCount: 0,

  fetchMessages: async () => {
    set({ loading: true, error: null });
    try {
      const messages = await ChatService.getRecentMessages();
      set({ messages, loading: false });
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch messages";
      set({ error: errorMessage, loading: false });
      useErrorStore.getState().handleAsyncError(error, "Failed to fetch messages");
    }
  },

  sendMessage: async (message: string) => {
    if (!message.trim())
      return;

    try {
      // Optimistically add message to UI
      const { user } = useAuthStore.getState();
      if (!user)
        throw new Error("No authenticated user");

      const optimisticMessage: ChatMessageWithUser = {
        id: `temp-${Date.now()}`,
        user_id: user.id,
        message: message.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split("@")[0] || "You",
          email: user.email || "",
        },
      };

      set(state => ({
        messages: [...state.messages, optimisticMessage],
        error: null,
      }));

      // Send message to server
      await ChatService.sendMessage({ message });

      // The real message will be added via the subscription
      // Remove the optimistic message
      set(state => ({
        messages: state.messages.filter(m => m.id !== optimisticMessage.id),
      }));
    }
    catch (error) {
      // Remove optimistic message on error
      set(state => ({
        messages: state.messages.filter(m => !m.id.startsWith("temp-")),
        error: error instanceof Error ? error.message : "Failed to send message",
      }));
      useErrorStore.getState().handleAsyncError(error, "Failed to send message");
      throw error;
    }
  },

  subscribeToMessages: () => {
    if (chatSubscription) {
      chatSubscription.unsubscribe();
    }

    console.log("Starting chat subscription...");

    chatSubscription = supabase
      .channel("chat_messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_messages",
        },
        async (payload) => {
          console.log("Chat subscription payload:", payload);
          const { eventType, new: newRecord, old: oldRecord } = payload;

          if (eventType === "INSERT" && newRecord) {
            // Fetch the complete message with user info
            try {
              const { data, error } = await supabase
                .from("chat_messages")
                .select(`
                  *,
                  user:users(id, name, email)
                `)
                .eq("id", newRecord.id)
                .single();

              if (!error && data) {
                const { user } = useAuthStore.getState();
                const isOwnMessage = user?.id === data.user_id;

                set((state) => {
                  // Check if message already exists (avoid duplicates)
                  const exists = state.messages.some(m => m.id === data.id);
                  if (exists)
                    return state;

                  console.log("New message received:", data, "isOwnMessage:", isOwnMessage, "chatOpen:", state.isOpen);

                  return {
                    messages: [...state.messages, data],
                    unreadCount: !isOwnMessage && !state.isOpen
                      ? state.unreadCount + 1
                      : state.unreadCount,
                  };
                });
              }
            }
            catch (error) {
              console.error("Failed to fetch new message:", error);
            }
          }
          else if (eventType === "UPDATE" && newRecord) {
            // Update existing message
            set(state => ({
              messages: state.messages.map(msg =>
                msg.id === newRecord.id
                  ? { ...msg, message: newRecord.message, updated_at: newRecord.updated_at }
                  : msg,
              ),
            }));
          }
          else if (eventType === "DELETE" && oldRecord) {
            // Remove deleted message
            set(state => ({
              messages: state.messages.filter(msg => msg.id !== oldRecord.id),
            }));
          }
        },
      )
      .subscribe();

    return () => {
      if (chatSubscription) {
        chatSubscription.unsubscribe();
        chatSubscription = null;
      }
    };
  },

  toggleChat: () => {
    set((state) => {
      const newIsOpen = !state.isOpen;
      return {
        isOpen: newIsOpen,
        unreadCount: newIsOpen ? 0 : state.unreadCount, // Clear unread when opening
      };
    });
  },

  openChat: () => {
    set({ isOpen: true, unreadCount: 0 });
  },

  closeChat: () => {
    set({ isOpen: false });
  },

  markAsRead: () => {
    set({ unreadCount: 0 });
  },

  clearError: () => set({ error: null }),
}));

// Cleanup function
export function cleanupChat() {
  if (chatSubscription) {
    chatSubscription.unsubscribe();
    chatSubscription = null;
  }
}
