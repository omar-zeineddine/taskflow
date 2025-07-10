import { Navigate } from "@tanstack/react-router";

import { useAuthStore } from "@/stores/auth";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return <>{children}</>;
}
