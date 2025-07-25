import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "@tanstack/react-router";
import { Calendar, Edit, ExternalLink, Trash2, User } from "lucide-react";
import { useState } from "react";

import type { TaskWithAssignee } from "@/types/task";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDate, getStatusColor } from "@/lib/utils";
import { useTaskStore } from "@/stores/tasks";

import { TaskEditModal } from "./task-edit-modal";

type SortableTaskCardProps = {
  task: TaskWithAssignee;
};

function TaskCard({ task, isDragging }: { task: TaskWithAssignee; isDragging: boolean }) {
  const { deleteTask, isTaskUpdating, isTaskDeleting } = useTaskStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isTaskCurrentlyUpdating = isTaskUpdating(task.id);
  const isTaskCurrentlyDeleting = isTaskDeleting(task.id);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isDragging)
      return;
    setIsEditModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isDragging)
      return;

    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

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

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDeleteConfirm(false);
  };

  if (showDeleteConfirm) {
    return (
      <Card className="border-destructive/50 bg-destructive/5 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-destructive">Delete Task</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to delete
                {" "}
                <span className="font-medium text-foreground">
                  "
                  {task.title}
                  "
                </span>
                ? This action cannot
                be undone.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="min-w-20"
              >
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting} className="min-w-20">
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card
        className={`group transition-all duration-200 ${
          isDragging ? "opacity-60 shadow-xl scale-105 rotate-2" : "hover:shadow-md hover:-translate-y-0.5"
        } ${isTaskCurrentlyUpdating ? "opacity-75 ring-2 ring-primary/50 ring-offset-1 ring-offset-background" : ""} ${
          isTaskCurrentlyDeleting ? "opacity-50 ring-2 ring-destructive/50 ring-offset-1 ring-offset-background" : ""
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-semibold text-base leading-snug line-clamp-2 text-foreground">{task.title}</h4>
            <div
              className={`flex gap-1 ${
                isDragging
                  ? "opacity-0 pointer-events-none"
                  : "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              }`}
            >
              <Link to="/tasks/$taskId" params={{ taskId: task.id }}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-accent" disabled={isDragging}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-accent"
                onClick={handleEdit}
                disabled={isDragging}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                onClick={handleDelete}
                disabled={isDragging}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {task.description && <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{task.description}</p>}

          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary" className={`text-sm font-medium px-3 py-1 border ${getStatusColor(task.status)}`}>
              {task.status}
            </Badge>

            {task.assignee && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-full px-3 py-1">
                <User className="h-4 w-4 flex-shrink-0" />
                <span className="truncate max-w-24 font-medium" title={task.assignee.name || task.assignee.email}>
                  {task.assignee.name || task.assignee.email}
                </span>
              </div>
            )}
          </div>

          {task.created_at && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span title={formatDate(task.created_at)}>{formatDate(task.created_at)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <TaskEditModal task={task} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </>
  );
}

export function SortableTaskCard({ task }: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    transition: {
      duration: 200,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${isDragging ? "z-50" : ""} cursor-grab active:cursor-grabbing select-none touch-none`}
    >
      <TaskCard task={task} isDragging={isDragging} />
    </div>
  );
}
