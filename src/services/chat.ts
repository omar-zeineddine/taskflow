import type { ChatMessage, ChatMessageWithUser, SendMessageRequest } from "@/types/chat";

import { supabase } from "@/lib/supabase";

export class ChatService {
  // Send a new message
  static async sendMessage(messageData: SendMessageRequest): Promise<ChatMessage> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        user_id: user.id,
        message: messageData.message.trim(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }

    return data;
  }

  // Get all messages with user information
  static async getMessages(limit: number = 50): Promise<ChatMessageWithUser[]> {
    const { data, error } = await supabase
      .from("chat_messages")
      .select(`
        *,
        user:users(id, name, email)
      `)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }

    // Reverse to show oldest first
    return (data || []).reverse();
  }

  // Get recent messages (for initial load)
  static async getRecentMessages(limit: number = 20): Promise<ChatMessageWithUser[]> {
    return this.getMessages(limit);
  }

  // Update a message (for editing)
  static async updateMessage(messageId: string, newMessage: string): Promise<ChatMessage> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    const { data, error } = await supabase
      .from("chat_messages")
      .update({ message: newMessage.trim() })
      .eq("id", messageId)
      .eq("user_id", user.id) // Ensure user can only update their own messages
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update message: ${error.message}`);
    }

    return data;
  }

  // Delete a message
  static async deleteMessage(messageId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    const { error } = await supabase
      .from("chat_messages")
      .delete()
      .eq("id", messageId)
      .eq("user_id", user.id); // Ensure user can only delete their own messages

    if (error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  }

  // Get message count for pagination
  static async getMessageCount(): Promise<number> {
    const { count, error } = await supabase
      .from("chat_messages")
      .select("*", { count: "exact", head: true });

    if (error) {
      throw new Error(`Failed to get message count: ${error.message}`);
    }

    return count || 0;
  }
}
