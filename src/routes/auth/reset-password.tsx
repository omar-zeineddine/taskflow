import { createFileRoute, Link } from "@tanstack/react-router";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const Route = createFileRoute("/auth/reset-password")({
  component: ResetPassword,
});

function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <ResetPasswordForm />
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
