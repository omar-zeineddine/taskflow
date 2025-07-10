import { Edit, Trash2 } from "lucide-react";

import type { TaskWithAssignee } from "@/types/task";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type TaskCardProps = {
  task: TaskWithAssignee;
  isDragging?: boolean;
  isRecentlyUpdated?: boolean;
  setIsEditModalOpen: (isOpen: boolean) => void;
  setShowDeleteConfirm: (show: boolean) => void;
  isDeleting: boolean;
};

export function TaskCard({
  task,
  isDragging = false,
  isRecentlyUpdated = false,
  setIsEditModalOpen,
  setShowDeleteConfirm,
  isDeleting,
}: TaskCardProps) {
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

  return (
    <div
      className={`border rounded-lg p-3 lg:p-4 space-y-2 lg:space-y-3 bg-white transition-all duration-300 ${isDragging ? "shadow-lg" : ""} ${isRecentlyUpdated ? "ring-2 ring-blue-400 shadow-md" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base lg:text-lg truncate">{task.title}</h3>
          {task.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsEditModalOpen(true)}>
            <Edit className="h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
          >
            <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center space-x-2 lg:space-x-3">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
          >
            {task.status}
          </span>
          {task.assignee && (
            <div className="flex items-center space-x-2 text-xs lg:text-sm">
              <Avatar name={task.assignee.name} email={task.assignee.email} size="sm" />
              <span className="truncate max-w-24 lg:max-w-none text-muted-foreground">
                {task.assignee.name}
              </span>
            </div>
          )}
          {!task.assignee && (
            <span className="text-xs text-muted-foreground">Unassigned</span>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          Created:
          {" "}
          {new Date(task.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
