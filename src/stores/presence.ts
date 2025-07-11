import { create } from "zustand";

import type { PresenceState, UserPresence, UserWithPresence } from "@/types/presence";

import { supabase } from "@/lib/supabase";
import { PresenceService } from "@/services/presence";
import { useAuthStore } from "@/stores/auth";
import { useErrorStore } from "@/stores/error";

// Heartbeat interval (30 seconds)
const HEARTBEAT_INTERVAL = 30000;

let heartbeatInterval: NodeJS.Timeout | null = null;
let presenceSubscription: any = null;

export const usePresenceStore = create<PresenceState>((set, get) => ({
  userPresences: new Map(),
  onlineUsers: [],
  isTracking: false,
  error: null,

  startPresenceTracking: async () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      throw new Error("No authenticated user");
    }

    try {
      // Start presence tracking
      await PresenceService.startPresenceTracking(user.id);

      set({ isTracking: true, error: null });

      // Set up heartbeat interval
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }

      heartbeatInterval = setInterval(async () => {
        try {
          await get().updateHeartbeat();
        }
        catch (error) {
          console.error("Heartbeat failed:", error);
        }
      }, HEARTBEAT_INTERVAL);

      // Subscribe to presence changes
      get().subscribeToPresence();

      // Initial fetch of online users
      await get().fetchOnlineUsers();
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to start presence tracking";
      set({ error: errorMessage, isTracking: false });
      useErrorStore.getState().handleAsyncError(error, "Failed to start presence tracking");
      throw error;
    }
  },

  stopPresenceTracking: () => {
    const { user } = useAuthStore.getState();
    if (!user)
      return;

    // Clear heartbeat interval
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }

    // Unsubscribe from presence changes
    if (presenceSubscription) {
      presenceSubscription.unsubscribe();
      presenceSubscription = null;
    }

    // Update presence to offline
    PresenceService.stopPresenceTracking(user.id).catch((error) => {
      console.error("Failed to stop presence tracking:", error);
    });

    set({ isTracking: false, userPresences: new Map(), onlineUsers: [] });
  },

  updateHeartbeat: async () => {
    const { user } = useAuthStore.getState();
    if (!user || !get().isTracking)
      return;

    try {
      await PresenceService.updateHeartbeat(user.id);
    }
    catch (error) {
      console.error("Failed to update heartbeat:", error);
      // Don't throw here to avoid breaking the heartbeat loop
    }
  },

  getOnlineUsers: () => {
    return get().onlineUsers;
  },

  isUserOnline: (userId: string) => {
    const presence = get().userPresences.get(userId);
    return presence?.is_online || false;
  },

  subscribeToPresence: () => {
    if (presenceSubscription) {
      presenceSubscription.unsubscribe();
    }

    presenceSubscription = supabase
      .channel("user_presence")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_presence",
        },
        async (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;

          if (eventType === "INSERT" || eventType === "UPDATE") {
            if (newRecord) {
              // Update presence in store
              set((state) => {
                const newPresences = new Map(state.userPresences);
                newPresences.set(newRecord.user_id, newRecord as UserPresence);
                return { userPresences: newPresences };
              });

              // Refresh online users list
              await get().fetchOnlineUsers();
            }
          }
          else if (eventType === "DELETE" && oldRecord) {
            // Remove presence from store
            set((state) => {
              const newPresences = new Map(state.userPresences);
              newPresences.delete(oldRecord.user_id);
              return { userPresences: newPresences };
            });

            // Refresh online users list
            await get().fetchOnlineUsers();
          }
        },
      )
      .subscribe();

    return () => {
      if (presenceSubscription) {
        presenceSubscription.unsubscribe();
        presenceSubscription = null;
      }
    };
  },

  fetchOnlineUsers: async () => {
    try {
      const onlineUsers = await PresenceService.getOnlineUsers();
      set({ onlineUsers, error: null });
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch online users";
      set({ error: errorMessage });
      useErrorStore.getState().handleAsyncError(error, "Failed to fetch online users");
    }
  },

  clearError: () => set({ error: null }),
}));

// Cleanup function to be called on app unmount
export function cleanupPresence() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }

  if (presenceSubscription) {
    presenceSubscription.unsubscribe();
    presenceSubscription = null;
  }
}
