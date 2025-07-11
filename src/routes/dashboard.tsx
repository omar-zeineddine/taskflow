import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, CheckCircle, Clock, Users } from "lucide-react";
import { useEffect } from "react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { TeamMembers } from "@/components/team/team-members";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStatsSkeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/auth";
import { useTaskStore } from "@/stores/tasks";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuthStore();
  const { tasks, loading, fetchTasks, fetchUsers } = useTaskStore();

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [fetchTasks, fetchUsers]);

  const getTaskStats = () => {
    const totalTasks = tasks.length;
    const todoTasks = tasks.filter(task => task.status === "To Do").length;
    const inProgressTasks = tasks.filter(task => task.status === "In Progress").length;
    const doneTasks = tasks.filter(task => task.status === "Done").length;
    const myTasks = tasks.filter(task => task.assignee_id === user?.id).length;

    return {
      total: totalTasks,
      todo: todoTasks,
      inProgress: inProgressTasks,
      done: doneTasks,
      mine: myTasks,
    };
  };

  const stats = getTaskStats();

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back,
            {" "}
            {user?.email?.split("@")[0] || "User"}
            !
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your team and tasks today.
          </p>
        </div>

        {/* Statistics Cards */}
        {loading
          ? (
              <DashboardStatsSkeleton />
            )
          : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">
                      Across all team members
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.mine}</div>
                    <p className="text-xs text-muted-foreground">
                      Assigned to you
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.inProgress}</div>
                    <p className="text-xs text-muted-foreground">
                      Currently active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.done}</div>
                    <p className="text-xs text-muted-foreground">
                      Tasks finished
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

        {/* Task Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Task Overview
            </CardTitle>
            <CardDescription>
              Current status of all tasks in your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {stats.todo}
                  {" "}
                  To Do
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  {stats.inProgress}
                  {" "}
                  In Progress
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-sm">
                  {stats.done}
                  {" "}
                  Done
                </Badge>
              </div>
            </div>

            {stats.total === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  No tasks found. Create your first task to get started!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Members Section */}
        <TeamMembers />
      </div>
    </ProtectedRoute>
  );
}
