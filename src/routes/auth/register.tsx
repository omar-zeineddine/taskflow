import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import { RegisterForm } from "@/components/auth/register-form";
import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/auth/register")({
  beforeLoad: ({ context: _context }) => {
    const { user } = useAuthStore.getState();
    if (user) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: () => (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or
            {" "}
            <Link
              to="/auth/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  ),
});
