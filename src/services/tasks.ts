import type { CreateTaskRequest, Task, TaskWithAssignee, UpdateTaskRequest } from "@/types/task";

import { supabase } from "@/lib/supabase";
import { CreateTaskSchema, TaskIdSchema, UpdateTaskSchema } from "@/lib/validations/task";

export class TaskService {
  static async getAllTasks(): Promise<TaskWithAssignee[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        assignee:users(id, name, email)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }

    return data.map(task => ({
      ...task,
      assignee: task.assignee || undefined,
    }));
  }

  static async getTaskById(id: string): Promise<TaskWithAssignee | null> {
    const validatedId = TaskIdSchema.parse({ id });

    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        assignee:users(id, name, email)
      `)
      .eq("id", validatedId.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch task: ${error.message}`);
    }

    return {
      ...data,
      assignee: data.assignee || undefined,
    };
  }

  static async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const validatedData = CreateTaskSchema.parse(taskData);

    const { data, error } = await supabase
      .from("tasks")
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }

    return data;
  }

  static async updateTask(id: string, taskData: UpdateTaskRequest): Promise<Task> {
    const validatedId = TaskIdSchema.parse({ id });
    const validatedData = UpdateTaskSchema.parse(taskData);

    const { data, error } = await supabase
      .from("tasks")
      .update(validatedData)
      .eq("id", validatedId.id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Task not found");
      }
      throw new Error(`Failed to update task: ${error.message}`);
    }

    return data;
  }

  static async deleteTask(id: string): Promise<void> {
    const validatedId = TaskIdSchema.parse({ id });

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", validatedId.id);

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }
  }

  static async getUsers() {
    // Get current user first to ensure they're always included
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    // Get users from public.users table
    const { data: publicUsers, error: publicError } = await supabase
      .from("users")
      .select("id, name, email")
      .order("name");

    if (publicError) {
      console.warn("Failed to fetch from public.users:", publicError.message);
    }

    // Create a map to store unique users
    const allUsers = new Map();

    // Add public users
    if (publicUsers) {
      publicUsers.forEach((user) => {
        allUsers.set(user.id, {
          id: user.id,
          name: user.name,
          email: user.email,
        });
      });
    }

    // Ensure current user is always included (even if not in public.users yet)
    if (currentUser && !allUsers.has(currentUser.id)) {
      allUsers.set(currentUser.id, {
        id: currentUser.id,
        name: currentUser.user_metadata?.name || currentUser.email?.split("@")[0] || "You",
        email: currentUser.email || "No email",
      });
    }

    return Array.from(allUsers.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  static async ensureCurrentUserExists() {
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (!currentUser) {
      throw new Error("No authenticated user found");
    }

    // Check if user exists in public.users
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", currentUser.id)
      .single();

    // If user doesn't exist in public.users, create them
    if (!existingUser) {
      const { error } = await supabase
        .from("users")
        .insert([{
          id: currentUser.id,
          email: currentUser.email || "",
          name: currentUser.user_metadata?.name || currentUser.email?.split("@")[0] || "Unknown User",
        }]);

      if (error) {
        console.warn("Failed to create user record:", error.message);
      }
    }
  }
}
