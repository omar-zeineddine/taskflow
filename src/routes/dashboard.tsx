import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/dashboard")({
  component: () => {
    const { user } = useAuthStore();

    return (
      <ProtectedRoute>
        <div className="p-2">
          <h1>Dashboard</h1>
          <p>
            Welcome,
            {user?.email}
            !
          </p>
        </div>
      </ProtectedRoute>
    );
  },
});
