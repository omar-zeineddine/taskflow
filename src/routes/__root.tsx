import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { AuthProvider } from "@/components/auth/auth-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { Layout } from "@/components/layouts/layout";
import { ToastContainer } from "@/components/ui/toast";

export const Route = createRootRoute({
  component: () => {
    return (
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
    );
  },
});
