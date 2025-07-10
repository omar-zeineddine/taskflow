import { useEffect } from "react";

import { useTaskStore } from "@/stores/tasks";

import { TaskCard } from "./task-card";

export function TaskList() {
  const { tasks, loading, error, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-muted-foreground">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-red-600">
          Error:
          {error}
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-muted-foreground">No tasks found</div>
      </div>
    );
  }

  return (
    <div className="space-y-3 lg:space-y-4 p-4">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} setIsEditModalOpen={() => {}} setShowDeleteConfirm={() => {}} isDeleting={false} />
      ))}
    </div>
  );
}
