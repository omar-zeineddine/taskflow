import { z } from "zod";

export const TaskStatusSchema = z.enum(["To Do", "In Progress", "Done"]);

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  description: z.string().optional(),
  status: TaskStatusSchema.default("To Do"),
  assignee_id: z.string().uuid().optional(),
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters").optional(),
  description: z.string().optional(),
  status: TaskStatusSchema.optional(),
  assignee_id: z.string().transform(val => val === "" ? undefined : val).pipe(z.string().uuid()).optional(),
});

export const TaskIdSchema = z.object({
  id: z.string().uuid("Invalid task ID"),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type TaskIdInput = z.infer<typeof TaskIdSchema>;
