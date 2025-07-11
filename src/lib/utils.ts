import type { ClassValue } from "clsx";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStatusColor(status: string) {
  switch (status) {
    case "To Do":
      return "bg-secondary text-secondary-foreground border-secondary";
    case "In Progress":
      return "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-foreground";
    case "Done":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
    default:
      return "bg-secondary text-secondary-foreground border-secondary";
  }
}

// Date formatting utilities
export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

export function formatDateLong(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Optimistic update utilities
export function generateOptimisticId() {
  return `temp-${Date.now()}`;
}

export function isOptimisticId(id: string) {
  return id.startsWith("temp-");
}

export function createOptimisticItem<T>(data: Partial<T>): T & { id: string; created_at: string; updated_at: string } {
  const now = new Date().toISOString();
  return {
    ...data,
    id: generateOptimisticId(),
    created_at: now,
    updated_at: now,
  } as T & { id: string; created_at: string; updated_at: string };
}
