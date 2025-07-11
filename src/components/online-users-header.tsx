import { Users } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OnlineIndicator } from "@/components/ui/online-indicator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePresenceStore } from "@/stores/presence";

export function OnlineUsersHeader() {
  const { onlineUsers } = usePresenceStore();

  if (onlineUsers.length === 0) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <Badge variant="secondary" className="text-xs">
            {onlineUsers.length}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <OnlineIndicator isOnline={true} size="sm" />
            <h4 className="font-medium text-sm">
              Online Users (
              {onlineUsers.length}
              )
            </h4>
          </div>
          <div className="space-y-2">
            {onlineUsers.map(user => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="relative">
                  <Avatar name={user.name} email={user.email} size="sm" />
                  <div className="absolute -bottom-1 -right-1">
                    <OnlineIndicator isOnline={true} size="sm" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{user.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
