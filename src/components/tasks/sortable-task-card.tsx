import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "@tanstack/react-router";
import { Calendar, Edit, ExternalLink, Trash2, User } from "lucide-react";
import { useState } from "react";

import type { TaskWithAssignee } from "@/types/task";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTaskStore } from "@/stores/tasks";

import { TaskEditModal } from "./task-edit-modal";

type SortableTaskCardProps = {
  task: TaskWithAssignee;
};

function TaskCard({ task, isDragging }: { task: TaskWithAssignee; isDragging: boolean }) {
  const { deleteTask } = useTaskStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (showDeleteConfirm) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="text-center">
            <h3 className="font-medium text-lg text-red-800 mb-2">Delete Task</h3>
            <p className="text-sm text-red-600 mb-4">
              Are you sure you want to delete "
              {task.title}
              "? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelDelete}
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
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card
        className={`group ${isDragging ? "opacity-50 shadow-lg scale-105" : "hover:shadow-md transition-shadow duration-200"}`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm leading-tight line-clamp-2">{task.title}</h4>
            <div className={`flex gap-1 ${isDragging ? "opacity-0 pointer-events-none" : "opacity-0 group-hover:opacity-100 transition-opacity"}`}>
              <Link to="/tasks/$taskId" params={{ taskId: task.id }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  disabled={isDragging}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleEdit}
                disabled={isDragging}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleDelete}
                disabled={isDragging}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-3">
          {task.description && <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>}

          <div className="flex items-center justify-between">
            <Badge variant="secondary" className={`text-xs ${getStatusColor(task.status)}`}>
              {task.status}
            </Badge>

            {task.assignee && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <User className="h-3 w-3" />
                <span className="truncate max-w-32" title={task.assignee.name || task.assignee.email}>
                  {task.assignee.name || task.assignee.email}
                </span>
              </div>
            )}
          </div>

          {task.created_at && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="h-3 w-3" />
              <span title={formatDate(task.created_at)}>
                {formatDate(task.created_at)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <TaskEditModal
        task={task}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}

export function SortableTaskCard({ task }: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    transition: {
      duration: 150,
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
      className={`${isDragging ? "z-50" : ""} cursor-grab active:cursor-grabbing select-none`}
    >
      <TaskCard task={task} isDragging={isDragging} />
    </div>
  );
}
