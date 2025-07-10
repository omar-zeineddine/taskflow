import { createFileRoute } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  component: () => <Home />,
});

export default function Home() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-foreground mb-6">
          Task Management
          <span className="text-primary"> Made Simple</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Streamline your development workflow with purpose-built task management platform. From backlog to
          deployment, keep your team aligned and productive.
        </p>
      </div>

      {/* Mock Dashboard Preview */}
      <div className="relative">
        <div className="bg-card rounded-xl shadow-2xl border border-border overflow-hidden">
          <div className="bg-secondary px-6 py-4 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="text-sm text-muted-foreground">Sprint 23 Dashboard</div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {["To Do", "In Progress", "Done"].map((status, index) => (
                <div key={status} className="bg-secondary rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-card-foreground">{status}</h3>
                    <Badge variant="secondary">{[8, 3, 12][index]}</Badge>
                  </div>
                  <div className="space-y-2">
                    {Array.from({ length: Math.min(3, [8, 3, 12][index]) }).map((_, i) => (
                      <div key={i} className="bg-background p-3 rounded border border-border">
                        <div className="h-2 bg-muted rounded mb-2"></div>
                        <div className="h-2 bg-muted rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
