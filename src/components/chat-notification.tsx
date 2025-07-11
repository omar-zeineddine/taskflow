import { MessageCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat";

export function ChatNotification() {
  const { unreadCount, toggleChat, isOpen } = useChatStore();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleChat}
      className="relative flex items-center gap-2"
    >
      <MessageCircle className="h-4 w-4" />
      {unreadCount > 0 && !isOpen && (
        <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
      <span className="sr-only">
        {unreadCount > 0 ? `${unreadCount} unread message${unreadCount === 1 ? "" : "s"}` : "Open chat"}
      </span>
    </Button>
  );
}
