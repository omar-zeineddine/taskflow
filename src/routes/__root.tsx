import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { AuthProvider } from "@/components/auth/auth-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { Layout } from "@/components/layouts/layout";
import { ToastContainer } from "@/components/ui/toast";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export const Route = createRootRoute({
  component: () => {
    return (
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <AuthProvider>
            <Layout>
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
              <ToastContainer />
              {import.meta.env.DEV && <TanStackRouterDevtools />}
            </Layout>
          </AuthProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    );
  },
});
