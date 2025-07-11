import { formatDistanceToNow } from "date-fns";

import type { ChatMessageWithUser } from "@/types/chat";

import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth";

type ChatMessageProps = {
  message: ChatMessageWithUser;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const { user } = useAuthStore();
  const isOwnMessage = user?.id === message.user_id;

  return (
    <div className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : ""}`}>
      <Avatar
        name={message.user.name}
        email={message.user.email}
        size="sm"
      />
      <div className={`flex-1 max-w-xs ${isOwnMessage ? "text-right" : ""}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-medium ${isOwnMessage ? "order-2" : ""}`}>
            {isOwnMessage ? "You" : message.user.name}
          </span>
          <span className={`text-xs text-muted-foreground ${isOwnMessage ? "order-1" : ""}`}>
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </span>
        </div>
        <div
          className={`rounded-lg px-3 py-2 text-sm break-words ${
            isOwnMessage
              ? "bg-primary text-primary-foreground ml-4"
              : "bg-muted mr-4"
          }`}
        >
          {message.message}
        </div>
      </div>
    </div>
  );
}
