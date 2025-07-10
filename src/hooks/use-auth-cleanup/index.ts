import { useEffect } from "react";

import { useAuthStore } from "@/stores/auth";

/**
 * React hook that ensures proper cleanup of auth listeners
 * Use this in your main App component or layout
 */
export function useAuthCleanup() {
  const cleanup = useAuthStore(state => state.cleanup);

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      cleanup();
    };
  }, [cleanup]);
}
