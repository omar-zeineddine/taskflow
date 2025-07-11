import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type { CreateTaskInput } from "@/lib/validations/task";
import type { TaskStatus } from "@/types/task";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateTaskSchema } from "@/lib/validations/task";
import { useErrorStore } from "@/stores/error";
import { useTaskStore } from "@/stores/tasks";

type TaskFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultValues?: Partial<CreateTaskInput>;
};

export function TaskForm({ onSuccess, onCancel, defaultValues }: TaskFormProps) {
  const { users, fetchUsers, createTask, loading } = useTaskStore();
  const { handleAsyncError } = useErrorStore();

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "To Do",
      assignee_id: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const onSubmit = async (data: CreateTaskInput) => {
    try {
      await createTask(data);
      form.reset();
      onSuccess?.();
    }
    catch (error) {
      handleAsyncError(error, "Failed to create task");
    }
  };

  const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: "To Do", label: "To Do" },
    { value: "In Progress", label: "In Progress" },
    { value: "Done", label: "Done" },
  ];

  const selectedUser = users.find(user => user.id === form.watch("assignee_id"));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea
                  placeholder="Enter task description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={value => field.onChange(value || undefined)}
                defaultValue={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assignee_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignee</FormLabel>
              <Select
                onValueChange={value => field.onChange(value === "none" ? "" : value)}
                defaultValue={field.value || "none"}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select assignee">
                      {selectedUser && (
                        <div className="flex items-center gap-2">
                          <Avatar name={selectedUser.name} email={selectedUser.email} size="sm" />
                          <span>{selectedUser.name}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="text-muted-foreground">No assignee</span>
                  </SelectItem>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <Avatar name={user.name} email={user.email} size="sm" />
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
