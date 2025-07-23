import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CreateTaskRequest, UpdateTaskRequest } from "@/types/task";

import { TaskService } from "@/services/tasks";
import { useAuthStore } from "@/stores/auth";

export function useTasks() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => TaskService.getAllTasks(),
    enabled: !!user, // Only fetch when user is authenticated
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useTask(id: string) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["task", id],
    queryFn: () => TaskService.getTaskById(id),
    enabled: !!user && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUsers() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // Ensure current user exists in the database
      await TaskService.ensureCurrentUserExists();
      return TaskService.getUsers();
    },
    enabled: !!user, // Only fetch when user is authenticated
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: CreateTaskRequest) => TaskService.createTask(taskData),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, taskData }: { id: string; taskData: UpdateTaskRequest }) =>
      TaskService.updateTask(id, taskData),
    onSuccess: (updatedTask) => {
      // Update the specific task in cache
      queryClient.setQueryData(["task", updatedTask.id], updatedTask);
      // Invalidate and refetch tasks list
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TaskService.deleteTask(id),
    onSuccess: (_, deletedId) => {
      // Remove the specific task from cache
      queryClient.removeQueries({ queryKey: ["task", deletedId] });
      // Invalidate and refetch tasks list
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
