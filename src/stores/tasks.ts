import { create } from "zustand";

import type { TaskFilters } from "@/components/tasks/task-filters";
import type { CreateTaskRequest, Task, TaskWithAssignee, UpdateTaskRequest, User } from "@/types/task";

import { supabase } from "@/lib/supabase";
import { TaskService } from "@/services/tasks";
import { useErrorStore } from "@/stores/error";

type TaskState = {
  tasks: TaskWithAssignee[];
  users: User[];
  loading: boolean; // For initial fetch and create operations
  usersLoading: boolean;
  error: string | null;
  recentlyUpdatedTasks: Set<string>;
  filters: TaskFilters;
  operationLoading: {
    updating: Set<string>; // Track which tasks are being updated
    deleting: Set<string>; // Track which tasks are being deleted
  };

  // Actions
  fetchTasks: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  createTask: (taskData: CreateTaskRequest) => Promise<Task>;
  updateTask: (id: string, taskData: UpdateTaskRequest, silent?: boolean) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  getTaskById: (id: string) => TaskWithAssignee | undefined;
  clearError: () => void;
  subscribeToTasks: () => () => void;
  markTaskAsRecentlyUpdated: (id: string) => void;
  setFilters: (filters: TaskFilters) => void;
  getFilteredTasks: () => TaskWithAssignee[];
  isTaskUpdating: (id: string) => boolean;
  isTaskDeleting: (id: string) => boolean;
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  users: [],
  loading: false,
  usersLoading: false,
  error: null,
  recentlyUpdatedTasks: new Set(),
  filters: {
    search: "",
    assigneeId: "all",
    dateFrom: "",
    dateTo: "",
  },
  operationLoading: {
    updating: new Set(),
    deleting: new Set(),
  },

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await TaskService.getAllTasks();
      set({ tasks, loading: false });
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch tasks";
      set({
        error: errorMessage,
        loading: false,
      });
      useErrorStore.getState().handleAsyncError(error, "Failed to fetch tasks");
    }
  },

  fetchUsers: async () => {
    set({ usersLoading: true, error: null });
    try {
      // Ensure current user exists in the database
      await TaskService.ensureCurrentUserExists();

      const users = await TaskService.getUsers();
      const usersWithCreatedAt = users.map(user => ({
        ...user,
        created_at: new Date().toISOString(),
      }));
      set({ users: usersWithCreatedAt, usersLoading: false });
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch users";
      set({
        error: errorMessage,
        usersLoading: false,
      });
      useErrorStore.getState().handleAsyncError(error, "Failed to fetch users");
    }
  },

  createTask: async (taskData: CreateTaskRequest) => {
    set({ loading: true, error: null });

    // Create optimistic task
    const optimisticTask = {
      id: `temp-${Date.now()}`,
      title: taskData.title,
      description: taskData.description || "",
      status: taskData.status,
      assignee_id: taskData.assignee_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      assignee: taskData.assignee_id ? get().users.find(u => u.id === taskData.assignee_id) : undefined,
    };

    // Optimistic update - add to UI immediately
    set(state => ({
      tasks: [optimisticTask, ...state.tasks],
    }));

    try {
      const newTask = await TaskService.createTask(taskData);

      // Replace optimistic task with real one
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === optimisticTask.id ? { ...newTask, assignee: optimisticTask.assignee } : task,
        ),
        loading: false,
      }));

      return newTask;
    }
    catch (error) {
      // Remove optimistic task on error
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== optimisticTask.id),
        error: error instanceof Error ? error.message : "Failed to create task",
        loading: false,
      }));
      throw error;
    }
  },

  updateTask: async (id: string, taskData: UpdateTaskRequest, silent = false) => {
    if (!silent) {
      set(state => ({
        operationLoading: {
          ...state.operationLoading,
          updating: new Set([...state.operationLoading.updating, id]),
        },
        error: null,
      }));
    }

    // Optimistic update - update UI immediately
    const previousTasks = get().tasks;
    set(state => ({
      tasks: state.tasks.map(task =>
        task.id === id ? { ...task, ...taskData } : task,
      ),
    }));

    try {
      const updatedTask = await TaskService.updateTask(id, taskData);

      if (!silent) {
        set((state) => {
          const newUpdating = new Set(state.operationLoading.updating);
          newUpdating.delete(id);
          return {
            operationLoading: {
              ...state.operationLoading,
              updating: newUpdating,
            },
          };
        });
      }

      return updatedTask;
    }
    catch (error) {
      // Revert optimistic update on error
      set((state) => {
        const newUpdating = new Set(state.operationLoading.updating);
        newUpdating.delete(id);
        return {
          tasks: previousTasks,
          error: error instanceof Error ? error.message : "Failed to update task",
          operationLoading: {
            ...state.operationLoading,
            updating: newUpdating,
          },
        };
      });
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    set(state => ({
      operationLoading: {
        ...state.operationLoading,
        deleting: new Set([...state.operationLoading.deleting, id]),
      },
      error: null,
    }));

    // Optimistic delete - remove from UI immediately
    const previousTasks = get().tasks;
    set(state => ({
      tasks: state.tasks.filter(task => task.id !== id),
    }));

    try {
      await TaskService.deleteTask(id);

      set((state) => {
        const newDeleting = new Set(state.operationLoading.deleting);
        newDeleting.delete(id);
        return {
          operationLoading: {
            ...state.operationLoading,
            deleting: newDeleting,
          },
        };
      });
    }
    catch (error) {
      // Revert optimistic delete on error
      set((state) => {
        const newDeleting = new Set(state.operationLoading.deleting);
        newDeleting.delete(id);
        return {
          tasks: previousTasks,
          error: error instanceof Error ? error.message : "Failed to delete task",
          operationLoading: {
            ...state.operationLoading,
            deleting: newDeleting,
          },
        };
      });
      throw error;
    }
  },

  getTaskById: (id: string) => {
    const { tasks } = get();
    return tasks.find(task => task.id === id);
  },

  clearError: () => set({ error: null }),

  subscribeToTasks: () => {
    const subscription = supabase
      .channel("tasks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
        },
        async (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;

          if (eventType === "INSERT" && newRecord) {
            // Check if task already exists (to avoid duplicates from optimistic updates)
            const existingTask = get().tasks.find(task => task.id === newRecord.id);
            if (!existingTask) {
              const taskWithAssignee = await TaskService.getTaskById(newRecord.id);
              if (taskWithAssignee) {
                set(state => ({
                  tasks: [taskWithAssignee, ...state.tasks],
                }));
              }
            }
          }
          else if (eventType === "UPDATE" && newRecord) {
            // Update the existing task in the store immediately
            const taskWithAssignee = await TaskService.getTaskById(newRecord.id);
            if (taskWithAssignee) {
              set(state => ({
                tasks: state.tasks.map(task =>
                  task.id === newRecord.id ? taskWithAssignee : task,
                ),
                recentlyUpdatedTasks: new Set([...state.recentlyUpdatedTasks, newRecord.id]),
              }));

              // Remove from recently updated after 2 seconds
              setTimeout(() => {
                set((state) => {
                  const newSet = new Set(state.recentlyUpdatedTasks);
                  newSet.delete(newRecord.id);
                  return { recentlyUpdatedTasks: newSet };
                });
              }, 2000);
            }
          }
          else if (eventType === "DELETE" && oldRecord) {
            // Remove the task from the store immediately
            set(state => ({
              tasks: state.tasks.filter(task => task.id !== oldRecord.id),
            }));
          }
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },

  markTaskAsRecentlyUpdated: (id: string) => {
    set(state => ({
      recentlyUpdatedTasks: new Set([...state.recentlyUpdatedTasks, id]),
    }));

    // Remove from recently updated after 2 seconds
    setTimeout(() => {
      set((state) => {
        const newSet = new Set(state.recentlyUpdatedTasks);
        newSet.delete(id);
        return { recentlyUpdatedTasks: newSet };
      });
    }, 2000);
  },

  setFilters: (filters: TaskFilters) => {
    set({ filters });
  },

  getFilteredTasks: () => {
    const { tasks, filters } = get();

    return tasks.filter((task) => {
      // Search filter - search in title and description
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const titleMatch = task.title.toLowerCase().includes(searchTerm);
        const descriptionMatch = task.description?.toLowerCase().includes(searchTerm) || false;
        if (!titleMatch && !descriptionMatch) {
          return false;
        }
      }

      // Assignee filter
      if (filters.assigneeId && filters.assigneeId !== "all") {
        if (task.assignee_id !== filters.assigneeId) {
          return false;
        }
      }

      // Date range filter
      if (filters.dateFrom) {
        const taskDate = new Date(task.created_at);
        const fromDate = new Date(filters.dateFrom);
        if (taskDate < fromDate) {
          return false;
        }
      }

      if (filters.dateTo) {
        const taskDate = new Date(task.created_at);
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999); // End of day
        if (taskDate > toDate) {
          return false;
        }
      }

      return true;
    });
  },

  isTaskUpdating: (id: string) => {
    return get().operationLoading.updating.has(id);
  },

  isTaskDeleting: (id: string) => {
    return get().operationLoading.deleting.has(id);
  },
}));
