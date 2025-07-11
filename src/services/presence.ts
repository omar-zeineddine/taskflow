import type { UserPresence, UserWithPresence } from "@/types/presence";

import { supabase } from "@/lib/supabase";

export class PresenceService {
  // Start tracking user presence
  static async startPresenceTracking(userId: string): Promise<void> {
    // Create or update presence record
    const { error } = await supabase
      .from("user_presence")
      .upsert({
        user_id: userId,
        is_online: true,
        last_seen: new Date().toISOString(),
        heartbeat: new Date().toISOString(),
      }, {
        onConflict: "user_id",
      });

    if (error) {
      throw new Error(`Failed to start presence tracking: ${error.message}`);
    }
  }

  // Stop tracking user presence
  static async stopPresenceTracking(userId: string): Promise<void> {
    const { error } = await supabase
      .from("user_presence")
      .update({
        is_online: false,
        last_seen: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to stop presence tracking: ${error.message}`);
    }
  }

  // Update heartbeat to show user is still active
  static async updateHeartbeat(userId: string): Promise<void> {
    const { error } = await supabase
      .from("user_presence")
      .update({
        heartbeat: new Date().toISOString(),
        is_online: true,
      })
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to update heartbeat: ${error.message}`);
    }
  }

  // Get all user presence records
  static async getAllPresence(): Promise<UserPresence[]> {
    const { data, error } = await supabase
      .from("user_presence")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch presence data: ${error.message}`);
    }

    return data || [];
  }

  // Get users with their presence status
  static async getUsersWithPresence(): Promise<UserWithPresence[]> {
    const { data, error } = await supabase
      .from("users")
      .select(`
        *,
        presence:user_presence(*)
      `)
      .order("name");

    if (error) {
      throw new Error(`Failed to fetch users with presence: ${error.message}`);
    }

    return (data || []).map(user => ({
      ...user,
      presence: user.presence?.[0] || undefined,
      isOnline: user.presence?.[0]?.is_online || false,
    }));
  }

  // Get only online users
  static async getOnlineUsers(): Promise<UserWithPresence[]> {
    const { data, error } = await supabase
      .from("users")
      .select(`
        *,
        presence:user_presence!inner(*)
      `)
      .eq("presence.is_online", true)
      .order("name");

    if (error) {
      throw new Error(`Failed to fetch online users: ${error.message}`);
    }

    return (data || []).map(user => ({
      ...user,
      presence: user.presence?.[0] || undefined,
      isOnline: true,
    }));
  }

  // Check if a specific user is online
  static async isUserOnline(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("user_presence")
      .select("is_online")
      .eq("user_id", userId)
      .single();

    if (error) {
      // If no presence record exists, user is offline
      return false;
    }

    return data?.is_online || false;
  }

  // Clean up stale presence records (called periodically)
  static async cleanupStalePresence(): Promise<void> {
    const { error } = await supabase.rpc("cleanup_stale_presence");

    if (error) {
      console.warn("Failed to cleanup stale presence:", error.message);
    }
  }
}
