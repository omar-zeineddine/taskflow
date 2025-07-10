import { Edit, Trash2, User } from "lucide-react";
import { useState } from "react";

import type { TaskWithAssignee } from "@/types/task";

import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/stores/tasks";

import { TaskEditModal } from "./task-edit-modal";

type TaskCardProps = {
  task: TaskWithAssignee;
  isDragging?: boolean;
};

export function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const { deleteTask, recentlyUpdatedTasks } = useTaskStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isRecentlyUpdated = recentlyUpdatedTasks.has(task.id);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
    }
    catch (error) {
      console.error("Failed to delete task:", error);
    }
    finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-gray-100 text-gray-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (showDeleteConfirm) {
    return (
      <div className="border rounded-lg p-4 space-y-3 bg-red-50 border-red-200">
        <div className="text-center">
          <h3 className="font-medium text-lg text-red-800">Delete Task</h3>
          <p className="text-sm text-red-600 mt-2">
            Are you sure you want to delete "
            {task.title}
            "? This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`border rounded-lg p-4 space-y-3 bg-white transition-all duration-300 ${isDragging ? "shadow-lg" : ""} ${isRecentlyUpdated ? "ring-2 ring-blue-400 shadow-md" : ""}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-lg">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
            {task.assignee && (
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{task.assignee.name}</span>
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Created:
            {" "}
            {new Date(task.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      <TaskEditModal
        task={task}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}
