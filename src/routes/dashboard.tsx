import { createFileRoute, redirect } from "@tanstack/react-router";

import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context: _context }) => {
    const { user } = useAuthStore.getState();
    if (!user) {
      throw redirect({
        to: "/auth/login",
      });
    }
  },
  component: () => {
    const { user } = useAuthStore();

    return (
      <div className="p-2">
        <h1>Dashboard</h1>
        <p>
          Welcome,
          {user?.email}
          !
        </p>
      </div>
    );
  },
});
