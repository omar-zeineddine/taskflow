import { createFileRoute, Link } from "@tanstack/react-router";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const Route = createFileRoute("/auth/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <ForgotPasswordForm />
          <div className="text-center">
            <Link
              to="/auth/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
