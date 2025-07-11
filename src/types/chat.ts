export type ChatMessage = {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  updated_at: string;
};

export type ChatMessageWithUser = {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type ChatState = {
  messages: ChatMessageWithUser[];
  loading: boolean;
  error: string | null;
  isOpen: boolean;
  unreadCount: number;

  // Actions
  fetchMessages: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  subscribeToMessages: () => () => void;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  markAsRead: () => void;
  clearError: () => void;
};

export type SendMessageRequest = {
  message: string;
};
