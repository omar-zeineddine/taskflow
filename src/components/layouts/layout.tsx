import { ChatWindow } from "@/components/chat";
import { useAuthStore } from "@/stores/auth";

import { Footer } from "../footer";
import { Header } from "../header";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
      </main>
      <Footer />
      {/* Chat is only available for authenticated users */}
      {user && <ChatWindow />}
    </div>
  );
}
