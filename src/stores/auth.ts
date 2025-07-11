import type { Session, User } from "@supabase/supabase-js";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { supabase } from "@/lib/supabase";

export type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  cleanup: () => void;
};

// Store the auth listener reference for cleanup with correct TypeScript type
let authListener: { data: { subscription: { unsubscribe: () => void } } } | null = null;
let isInitializing = false;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _get) => ({
      user: null,
      session: null,
      isLoading: false,
      isInitialized: false,

      signIn: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            set({ isLoading: false });
            return { error: error.message };
          }

          // Manually set the user/session immediately after successful login
          // This ensures the state is updated right away
          if (data.user && data.session) {
            set({
              user: data.user,
              session: data.session,
              isLoading: false,
            });
          }
          else {
            set({ isLoading: false });
          }

          return { error: null };
        }
        catch (err) {
          set({ isLoading: false });
          console.error("Sign in error:", err);
          return { error: "An unexpected error occurred" };
        }
      },

      signUp: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) {
            set({ isLoading: false });
            return { error: error.message };
          }

          // Don't set user/session here - let onAuthStateChange handle it
          set({ isLoading: false });
          return { error: null };
        }
        catch (err) {
          set({ isLoading: false });
          console.error("Sign up error:", err);
          return { error: "An unexpected error occurred" };
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        try {
          await supabase.auth.signOut();
          // Manually clear the state to ensure immediate UI update
          set({
            user: null,
            session: null,
            isLoading: false,
          });
        }
        catch (err) {
          console.error("Sign out error:", err);
          set({ isLoading: false });
        }
      },

      initialize: async () => {
        // Prevent multiple concurrent initializations
        if (isInitializing) {
          return;
        }

        isInitializing = true;

        try {
          // Clean up any existing listener first
          if (authListener) {
            authListener.data.subscription.unsubscribe();
            authListener = null;
          }

          // Set up auth state change listener first
          authListener = supabase.auth.onAuthStateChange((_event, session) => {
            set({
              user: session?.user ?? null,
              session,
              isLoading: false,
            });
          });

          // Then get initial session
          const { data: { session }, error } = await supabase.auth.getSession();

          if (error) {
            console.error("Error getting session:", error);
          }

          set({
            user: session?.user ?? null,
            session,
            isInitialized: true,
            isLoading: false,
          });
        }
        catch (err) {
          console.error("Initialize error:", err);
          set({
            isInitialized: true,
            isLoading: false,
          });
        }
        finally {
          isInitializing = false;
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true });
        try {
          // Get the correct URL based on Vercel environment
          const getAppURL = () => {
            // For development
            if (import.meta.env.DEV) {
              return "http://localhost:5173";
            }

            // For Vercel deployments
            if (import.meta.env.VITE_VERCEL_ENV === "preview") {
              // Use the branch URL for preview deployments
              return `https://${import.meta.env.VITE_VERCEL_BRANCH_URL}`;
            }

            if (import.meta.env.VITE_VERCEL_ENV === "production") {
              // Use the production URL
              return `https://${import.meta.env.VITE_VERCEL_PROJECT_PRODUCTION_URL}`;
            }

            // Fallback to current origin
            return window.location.origin;
          };

          const redirectTo = `${getAppURL()}/auth/reset-password`;

          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo,
          });

          set({ isLoading: false });

          if (error) {
            return { error: error.message };
          }

          return { error: null };
        }
        catch (err) {
          set({ isLoading: false });
          console.error("Reset password error:", err);
          return { error: "An unexpected error occurred" };
        }
      },

      updatePassword: async (newPassword: string) => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          });

          set({ isLoading: false });

          if (error) {
            return { error: error.message };
          }

          return { error: null };
        }
        catch (err) {
          set({ isLoading: false });
          console.error("Update password error:", err);
          return { error: "An unexpected error occurred" };
        }
      },

      cleanup: () => {
        if (authListener) {
          authListener.data.subscription.unsubscribe();
          authListener = null;
        }
        isInitializing = false;
      },
    }),
    {
      name: "auth-storage",
      // Don't persist any auth state - let Supabase handle persistence
      // This prevents stale session issues on page reload
      partialize: () => ({}),
    },
  ),
);

// Auto-cleanup on page unload (for non-React environments)
if (typeof window !== "undefined") {
  // Handle page unload
  window.addEventListener("beforeunload", () => {
    useAuthStore.getState().cleanup();
  });

  // Handle SPA navigation (for React Router, etc.)
  window.addEventListener("popstate", () => {
    // Don't cleanup on navigation, just log
  });
}
