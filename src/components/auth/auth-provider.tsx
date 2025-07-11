import { useEffect } from "react";

import { Spinner } from "@/components/ui/spinner";
import { useAuthCleanup } from "@/hooks/use-auth-cleanup";
import { useAuthStore } from "@/stores/auth";
import { cleanupChat, useChatStore } from "@/stores/chat";
import { cleanupPresence, usePresenceStore } from "@/stores/presence";

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const { initialize, isInitialized, user } = useAuthStore();
  const { startPresenceTracking, stopPresenceTracking } = usePresenceStore();
  const { subscribeToMessages } = useChatStore();

  // Ensure proper cleanup of auth listeners
  useAuthCleanup();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  // Start/stop presence tracking and chat subscription based on auth state
  useEffect(() => {
    let chatUnsubscribe: (() => void) | null = null;

    if (user) {
      // User is logged in, start presence tracking
      startPresenceTracking().catch((error) => {
        console.error("Failed to start presence tracking:", error);
      });

      // Start chat subscription
      chatUnsubscribe = subscribeToMessages();
    }
    else {
      // User is logged out, stop presence tracking
      stopPresenceTracking();
    }

    // Cleanup on unmount or user change
    return () => {
      cleanupPresence();
      cleanupChat();
      if (chatUnsubscribe) {
        chatUnsubscribe();
      }
    };
  }, [user, startPresenceTracking, stopPresenceTracking, subscribeToMessages]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
