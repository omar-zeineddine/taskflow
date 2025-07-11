import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Edit, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { TaskEditModal } from "@/components/tasks/task-edit-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatDateShort, getStatusColor } from "@/lib/utils";
import { useTaskStore } from "@/stores/tasks";

export const Route = createFileRoute("/tasks/$taskId/")({
  component: TaskDetailPage,
});

function TaskDetailPage() {
  const { taskId } = Route.useParams();
  const navigate = useNavigate();
  const { getTaskById, deleteTask, fetchTasks } = useTaskStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const task = getTaskById(taskId);

  useEffect(() => {
    if (!task) {
      fetchTasks();
    }
  }, [task, fetchTasks]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(taskId);
      setIsDeleteDialogOpen(false);
      navigate({ to: "/tasks" });
    }
    catch (error) {
      console.error("Failed to delete task:", error);
    }
    finally {
      setIsDeleting(false);
    }
  };

  if (!task) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="text-muted-foreground">
                    <Trash2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Task not found</p>
                    <p className="text-sm">The task you're looking for doesn't exist or has been deleted.</p>
                  </div>
                  <Button onClick={() => navigate({ to: "/tasks" })} className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Tasks
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with back button */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate({ to: "/tasks" })} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tasks
            </Button>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2 break-words">
                  {task.title}
                </h1>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Created
                    {" "}
                    {formatDateShort(task.created_at)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex-1 sm:flex-none"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Task
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isDeleting}
                  className="flex-1 sm:flex-none"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Task details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  {task.description
                    ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                            {task.description}
                          </p>
                        </div>
                      )
                    : (
                        <p className="text-muted-foreground italic">No description provided</p>
                      )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Assignee */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Assignee
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {task.assignee
                    ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{task.assignee.name}</p>
                              <p className="text-sm text-muted-foreground">{task.assignee.email}</p>
                            </div>
                          </div>
                        </div>
                      )
                    : (
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                            <User className="h-5 w-5" />
                          </div>
                          <p className="italic">No assignee</p>
                        </div>
                      )}
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Created</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(task.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Last updated</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(task.updated_at)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <TaskEditModal
        task={task}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">Delete Task</CardTitle>
              <CardDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </ProtectedRoute>
  );
}
