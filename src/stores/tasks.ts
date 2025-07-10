import { create } from "zustand";

import type { TaskFilters } from "@/components/tasks/task-filters";
import type { CreateTaskRequest, Task, TaskWithAssignee, UpdateTaskRequest, User } from "@/types/task";

import { supabase } from "@/lib/supabase";
import { TaskService } from "@/services/tasks";

type TaskState = {
  tasks: TaskWithAssignee[];
  users: User[];
  loading: boolean;
  usersLoading: boolean;
  error: string | null;
  recentlyUpdatedTasks: Set<string>;
  filters: TaskFilters;

  // Actions
  fetchTasks: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  createTask: (taskData: CreateTaskRequest) => Promise<Task>;
  updateTask: (id: string, taskData: UpdateTaskRequest) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  getTaskById: (id: string) => TaskWithAssignee | undefined;
  clearError: () => void;
  subscribeToTasks: () => () => void;
  markTaskAsRecentlyUpdated: (id: string) => void;
  setFilters: (filters: TaskFilters) => void;
  getFilteredTasks: () => TaskWithAssignee[];
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

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await TaskService.getAllTasks();
      set({ tasks, loading: false });
    }
    catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch tasks",
        loading: false,
      });
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
      set({
        error: error instanceof Error ? error.message : "Failed to fetch users",
        usersLoading: false,
      });
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

  updateTask: async (id: string, taskData: UpdateTaskRequest) => {
    set({ loading: true, error: null });

    // Optimistic update - update UI immediately
    const previousTasks = get().tasks;
    set(state => ({
      tasks: state.tasks.map(task =>
        task.id === id ? { ...task, ...taskData } : task,
      ),
    }));

    try {
      const updatedTask = await TaskService.updateTask(id, taskData);
      set({ loading: false });
      return updatedTask;
    }
    catch (error) {
      // Revert optimistic update on error
      set({
        tasks: previousTasks,
        error: error instanceof Error ? error.message : "Failed to update task",
        loading: false,
      });
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    set({ loading: true, error: null });

    // Optimistic delete - remove from UI immediately
    const previousTasks = get().tasks;
    set(state => ({
      tasks: state.tasks.filter(task => task.id !== id),
    }));

    try {
      await TaskService.deleteTask(id);
      set({ loading: false });
    }
    catch (error) {
      // Revert optimistic delete on error
      set({
        tasks: previousTasks,
        error: error instanceof Error ? error.message : "Failed to delete task",
        loading: false,
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
}));
