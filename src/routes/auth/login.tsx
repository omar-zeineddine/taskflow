import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import { LoginForm } from "@/components/auth/login-form";
import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/auth/login")({
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or
            {" "}
            <Link
              to="/auth/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <LoginForm />
        </div>
      </div>
    </div>
  ),
});
