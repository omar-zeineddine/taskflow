import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

import { ProtectedRoute } from "@/components/auth";
import { KanbanBoard, TaskFilters, TaskForm, TaskModal } from "@/components/tasks";
import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/stores/tasks";

export const Route = createFileRoute("/tasks/")({
  component: TasksPage,
});

function TasksPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { error, clearError, filters, setFilters } = useTaskStore();

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Team Tasks</h1>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-red-700">{error}</p>
              <Button variant="ghost" size="sm" onClick={clearError}>
                Dismiss
              </Button>
            </div>
          </div>
        )}

        <div className="mb-6">
          <TaskFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        <KanbanBoard />

        <TaskModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Task"
        >
          <TaskForm
            onSuccess={() => setShowCreateModal(false)}
            onCancel={() => setShowCreateModal(false)}
          />
        </TaskModal>
      </div>
    </ProtectedRoute>
  );
}
