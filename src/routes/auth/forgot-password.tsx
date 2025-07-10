import { createFileRoute, Link } from "@tanstack/react-router";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const Route = createFileRoute("/auth/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <ForgotPasswordForm />
          <div className="text-center">
            <Link
              to="/auth/login"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
