import { Mail, Users } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OnlineIndicator } from "@/components/ui/online-indicator";
import { TeamMembersSkeleton } from "@/components/ui/skeleton";
import { useTasks, useUsers } from "@/hooks/use-tasks";
import { usePresenceStore } from "@/stores/presence";

export function TeamMembers() {
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: tasks = [] } = useTasks();
  const { isUserOnline, onlineUsers } = usePresenceStore();

  const getUserTaskStats = (userId: string) => {
    const userTasks = tasks.filter((task: any) => task.assignee_id === userId);
    const todoCount = userTasks.filter((task: any) => task.status === "To Do").length;
    const inProgressCount = userTasks.filter((task: any) => task.status === "In Progress").length;
    const doneCount = userTasks.filter((task: any) => task.status === "Done").length;

    return {
      total: userTasks.length,
      todo: todoCount,
      inProgress: inProgressCount,
      done: doneCount,
    };
  };

  const getTeamStats = () => {
    const totalMembers = users.length;
    const membersWithTasks = users.filter(user =>
      tasks.some(task => task.assignee_id === user.id),
    ).length;
    const unassignedTasks = tasks.filter(task => !task.assignee_id).length;
    const averageTasksPerMember = totalMembers > 0 ? Math.round(tasks.length / totalMembers) : 0;
    const onlineMembersCount = onlineUsers.length;

    return {
      totalMembers,
      membersWithTasks,
      unassignedTasks,
      averageTasksPerMember,
      onlineMembersCount,
    };
  };

  if (usersLoading) {
    return <TeamMembersSkeleton />;
  }

  const teamStats = getTeamStats();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Members
        </CardTitle>
        <CardDescription>
          Manage your team and track member activity (
          {users.length}
          {" "}
          members)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Team Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{teamStats.totalMembers}</div>
            <div className="text-xs text-muted-foreground">Total Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{teamStats.onlineMembersCount}</div>
            <div className="text-xs text-muted-foreground">Online Now</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{teamStats.membersWithTasks}</div>
            <div className="text-xs text-muted-foreground">Active Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{teamStats.unassignedTasks}</div>
            <div className="text-xs text-muted-foreground">Unassigned Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{teamStats.averageTasksPerMember}</div>
            <div className="text-xs text-muted-foreground">Avg Tasks/Member</div>
          </div>
        </div>

        {/* Team Members List */}
        <div className="space-y-4">
          {users.map((user) => {
            const stats = getUserTaskStats(user.id);
            return (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar name={user.name} email={user.email} size="md" />
                    <div className="absolute -bottom-1 -right-1">
                      <OnlineIndicator isOnline={isUserOnline(user.id)} size="sm" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{user.name}</h4>
                      {isUserOnline(user.id) && (
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800 border-green-200">
                          Online
                        </Badge>
                      )}
                      {stats.total > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {stats.total}
                          {" "}
                          tasks
                        </Badge>
                      )}
                      {stats.total === 0 && (
                        <Badge variant="outline" className="text-xs">
                          No tasks
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {stats.todo > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {stats.todo}
                      {" "}
                      To Do
                    </Badge>
                  )}
                  {stats.inProgress > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {stats.inProgress}
                      {" "}
                      In Progress
                    </Badge>
                  )}
                  {stats.done > 0 && (
                    <Badge variant="default" className="text-xs">
                      {stats.done}
                      {" "}
                      Done
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}

          {users.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No team members found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
