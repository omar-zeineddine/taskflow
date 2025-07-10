import { useEffect } from "react";

import { Spinner } from "@/components/ui/spinner";
import { useAuthCleanup } from "@/hooks/use-auth-cleanup";
import { useAuthStore } from "@/stores/auth";

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const { initialize, isInitialized } = useAuthStore();

  // Ensure proper cleanup of auth listeners
  useAuthCleanup();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
