import { useEffect } from "react";

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
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
