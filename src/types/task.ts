export type TaskStatus = "To Do" | "In Progress" | "Done";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee_id?: string;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  created_at: string;
};

export type CreateTaskRequest = {
  title: string;
  description?: string;
  status: TaskStatus;
  assignee_id?: string;
};

export type UpdateTaskRequest = {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignee_id?: string;
};

export type TaskWithAssignee = Task & {
  assignee?: User;
};
