import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { AuthProvider } from "@/components/auth/auth-provider";
import { Layout } from "@/components/layouts/layout";

export const Route = createRootRoute({
  component: () => {
    return (
      <AuthProvider>
        <Layout>
          <Outlet />
          <TanStackRouterDevtools />
        </Layout>
      </AuthProvider>
    );
  },
});
