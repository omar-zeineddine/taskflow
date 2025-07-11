import { AlertTriangle, RefreshCw } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
};

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error("Error caught by boundary:", error, errorInfo);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // In production, you would send this to your error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} reset={this.handleReset} />;
      }

      // Default fallback UI
      return <DefaultErrorFallback error={this.state.error!} reset={this.handleReset} />;
    }

    return this.props.children;
  }
}

type DefaultErrorFallbackProps = {
  error: Error;
  reset: () => void;
};

function DefaultErrorFallback({ error, reset }: DefaultErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-lg">Something went wrong</CardTitle>
          <CardDescription>
            An unexpected error occurred. Please try refreshing the page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {import.meta.env.DEV && (
            <details className="rounded-md bg-gray-50 p-3 text-sm">
              <summary className="cursor-pointer font-medium text-gray-700">
                Error details (dev only)
              </summary>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-gray-600">
                {error.message}
                {error.stack}
              </pre>
            </details>
          )}
          <div className="flex gap-2">
            <Button onClick={reset} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex-1"
            >
              Reload page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for programmatic error handling
export function useErrorHandler() {
  return (error: Error, errorInfo?: string) => {
    console.error("Error handled:", error, errorInfo);

    // In production, send to error tracking service
    // Example: Sentry.captureException(error, { extra: { errorInfo } });

    // You could also show a toast notification here
    throw error; // Re-throw to trigger error boundary
  };
}

// Higher-order component for easy wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">,
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}
