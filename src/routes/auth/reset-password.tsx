import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/auth/reset-password")({
  component: ResetPassword,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || "",
      type: (search.type as string) || "",
      error: (search.error as string) || "",
      error_description: (search.error_description as string) || "",
    };
  },
});

function ResetPassword() {
  const search = useSearch({ from: "/auth/reset-password" });

  useEffect(() => {
    const handleRecoverySession = async () => {
      // Check for error in URL first
      if (search.error) {
        console.error("Recovery error:", search.error, search.error_description);
        return;
      }

      // Method 1: token from URL query parameters (Supabase email link format)
      if (search.token && search.type === "recovery") {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: search.token,
            type: "recovery",
          });

          if (error) {
            console.error("Error verifying recovery token:", error);
          }
          else {
            // Clear the URL parameters for security
            window.history.replaceState(null, "", window.location.pathname);
          }
        }
        catch (err) {
          console.error("Recovery token verification error:", err);
        }
        return;
      }

      // Method 2: Handle tokens from URL hash (alternative format)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const type = hashParams.get("type");

      if (accessToken && refreshToken && type === "recovery") {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("Error setting recovery session:", error);
          }
          else {
            // Clear the hash from URL for security
            window.history.replaceState(null, "", window.location.pathname);
          }
        }
        catch (err) {
          console.error("Recovery session error:", err);
        }
      }
    };

    handleRecoverySession();
  }, [search]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter your new password below.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <ResetPasswordForm />
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
