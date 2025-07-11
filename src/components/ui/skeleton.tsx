import React from "react";

import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

// Specific skeleton components for common use cases
export function TaskCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function KanbanColumnSkeleton() {
  return (
    <div className="rounded-lg bg-muted/50 p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <div className="space-y-3">
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
        </div>
      </div>
    </div>
  );
}

export function KanbanBoardSkeleton() {
  return (
    <div className="w-full bg-secondary min-h-screen/2 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 lg:p-6">
        <KanbanColumnSkeleton />
        <KanbanColumnSkeleton />
        <KanbanColumnSkeleton />
      </div>
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TeamMembersSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TaskFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-20 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
}
