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
