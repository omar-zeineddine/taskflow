import { create } from "zustand";

export type AppError = {
  id: string;
  message: string;
  type: "error" | "warning" | "info";
  timestamp: number;
  details?: string;
  action?: {
    label: string;
    handler: () => void;
  };
};

type ErrorState = {
  errors: AppError[];
  addError: (error: Omit<AppError, "id" | "timestamp">) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
  handleAsyncError: (error: unknown, context?: string) => void;
};

export const useErrorStore = create<ErrorState>((set, get) => ({
  errors: [],

  addError: (error) => {
    const newError: AppError = {
      ...error,
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    set(state => ({
      errors: [...state.errors, newError],
    }));

    // Auto-remove error after 5 seconds unless it has an action
    if (!newError.action) {
      setTimeout(() => {
        get().removeError(newError.id);
      }, 5000);
    }
  },

  removeError: (id) => {
    set(state => ({
      errors: state.errors.filter(error => error.id !== id),
    }));
  },

  clearErrors: () => {
    set({ errors: [] });
  },

  handleAsyncError: (error, context) => {
    console.error("Async error:", error, context);

    let message = "An unexpected error occurred";
    let details: string | undefined;

    if (error instanceof Error) {
      message = error.message;
      details = error.stack;
    }
    else if (typeof error === "string") {
      message = error;
    }
    else if (error && typeof error === "object" && "message" in error) {
      message = String(error.message);
    }

    if (context) {
      message = `${context}: ${message}`;
    }

    get().addError({
      message,
      type: "error",
      details,
      action: {
        label: "Retry",
        handler: () => {
          // This could be enhanced to store retry logic
          window.location.reload();
        },
      },
    });
  },
}));

// Helper functions for common error scenarios
export const errorHelpers = {
  networkError: (context?: string) => {
    useErrorStore.getState().addError({
      message: "Network connection failed",
      type: "error",
      details: context,
      action: {
        label: "Retry",
        handler: () => window.location.reload(),
      },
    });
  },

  validationError: (message: string) => {
    useErrorStore.getState().addError({
      message,
      type: "warning",
    });
  },

  authError: () => {
    useErrorStore.getState().addError({
      message: "Authentication failed. Please log in again.",
      type: "error",
      action: {
        label: "Login",
        handler: () => {
          // This would redirect to login page
          window.location.href = "/auth/login";
        },
      },
    });
  },

  permissionError: () => {
    useErrorStore.getState().addError({
      message: "You don't have permission to perform this action",
      type: "warning",
    });
  },
};
