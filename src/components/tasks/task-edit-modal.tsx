import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

import type { UpdateTaskInput } from "@/lib/validations/task";
import type { TaskStatus, TaskWithAssignee } from "@/types/task";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UpdateTaskSchema } from "@/lib/validations/task";
import { useTaskStore } from "@/stores/tasks";

import { TaskModal } from "./task-modal";

type TaskEditModalProps = {
  task: TaskWithAssignee;
  isOpen: boolean;
  onClose: () => void;
};

export function TaskEditModal({ task, isOpen, onClose }: TaskEditModalProps) {
  const { users, fetchUsers, updateTask } = useTaskStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<UpdateTaskInput>({
    resolver: zodResolver(UpdateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || "",
      status: task.status,
      assignee_id: task.assignee_id || "",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      fetchUsers();
      form.reset({
        title: task.title,
        description: task.description || "",
        status: task.status,
        assignee_id: task.assignee_id || "",
      });
    }
  }, [isOpen, task, fetchUsers, form]);

  const onSubmit = async (data: UpdateTaskInput) => {
    setIsSubmitting(true);
    try {
      await updateTask(task.id, data);
      onClose();
    }
    catch (error) {
      console.error("Failed to update task:", error);
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: "To Do", label: "To Do" },
    { value: "In Progress", label: "In Progress" },
    { value: "Done", label: "Done" },
  ];

  const selectedUser = users.find(user => user.id === form.watch("assignee_id"));

  return (
    <TaskModal isOpen={isOpen} onClose={onClose} title="Edit Task">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter task title" {...field} disabled={isSubmitting} />
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
                    disabled={isSubmitting}
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
                  onValueChange={field.onChange}
                  defaultValue={field.value || undefined}
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="No assignee">
                        {selectedUser
                          ? (
                              <div className="flex items-center gap-2">
                                <Avatar name={selectedUser.name} email={selectedUser.email} size="sm" />
                                <span>{selectedUser.name}</span>
                              </div>
                            )
                          : (
                              <span className="text-muted-foreground">No assignee</span>
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
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Task"}
            </Button>
          </div>
        </form>
      </Form>
    </TaskModal>
  );
}
