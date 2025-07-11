import { Edit, Trash2 } from "lucide-react";

import type { TaskWithAssignee } from "@/types/task";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDateShort, getStatusColor } from "@/lib/utils";

type TaskCardProps = {
  task: TaskWithAssignee;
  isDragging?: boolean;
  isRecentlyUpdated?: boolean;
  setIsEditModalOpen: (open: boolean) => void;
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
  return (
    <div
      className={`border border-border rounded-lg p-3 lg:p-4 space-y-2 lg:space-y-3 bg-card transition-all duration-300 ${isDragging ? "shadow-lg" : ""} ${isRecentlyUpdated ? "ring-2 ring-primary/50 shadow-md ring-offset-background" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base lg:text-lg truncate text-foreground">{task.title}</h3>
          {task.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-accent" onClick={() => setIsEditModalOpen(true)}>
            <Edit className="h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
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
          {formatDateShort(task.created_at)}
        </div>
      </div>
    </div>
  );
}
