import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Edit, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth";
import { TaskEditModal } from "@/components/tasks";
import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/stores/tasks";

export const Route = createFileRoute("/tasks/$taskId/")({
  component: TaskDetailPage,
});

function TaskDetailPage() {
  const { taskId } = Route.useParams();
  const navigate = useNavigate();
  const { getTaskById, deleteTask, fetchTasks } = useTaskStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const task = getTaskById(taskId);

  useEffect(() => {
    if (!task) {
      fetchTasks();
    }
  }, [task, fetchTasks]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setIsDeleting(true);
      try {
        await deleteTask(taskId);
        navigate({ to: "/tasks" });
      }
      catch (error) {
        console.error("Failed to delete task:", error);
      }
      finally {
        setIsDeleting(false);
      }
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

  if (!task) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Task not found</p>
            <Button className="mt-4" onClick={() => navigate({ to: "/tasks" })}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tasks
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate({ to: "/tasks" })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">ASSIGNEE</h3>
                {task.assignee
                  ? (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{task.assignee.name}</span>
                        <span className="text-sm text-muted-foreground">
                          (
                          {task.assignee.email}
                          )
                        </span>
                      </div>
                    )
                  : (
                      <span className="text-muted-foreground">No assignee</span>
                    )}
              </div>

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">CREATED</h3>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(task.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {task.description && (
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">DESCRIPTION</h3>
                <div className="prose max-w-none">
                  <p className="text-sm whitespace-pre-wrap">{task.description}</p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t">
              <div className="text-xs text-muted-foreground">
                Last updated:
                {" "}
                {new Date(task.updated_at).toLocaleDateString()}
                {" "}
                at
                {" "}
                {new Date(task.updated_at).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <TaskEditModal
        task={task}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </ProtectedRoute>
  );
}
