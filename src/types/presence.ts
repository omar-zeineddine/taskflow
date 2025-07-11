export type UserPresence = {
  id: string;
  user_id: string;
  is_online: boolean;
  last_seen: string;
  heartbeat: string;
  created_at: string;
  updated_at: string;
};

export type UserWithPresence = {
  id: string;
  name: string;
  email: string;
  created_at: string;
  presence?: UserPresence;
  isOnline: boolean;
};

export type PresenceState = {
  userPresences: Map<string, UserPresence>;
  onlineUsers: UserWithPresence[];
  isTracking: boolean;
  error: string | null;

  // Actions
  startPresenceTracking: () => Promise<void>;
  stopPresenceTracking: () => void;
  updateHeartbeat: () => Promise<void>;
  getOnlineUsers: () => UserWithPresence[];
  fetchOnlineUsers: () => Promise<void>;
  isUserOnline: (userId: string) => boolean;
  subscribeToPresence: () => () => void;
  clearError: () => void;
};
