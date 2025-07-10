import type { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";

import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";

import type { TaskStatus, TaskWithAssignee } from "@/types/task";

import { Spinner } from "@/components/ui/spinner";
import { useTaskStore } from "@/stores/tasks";

import { KanbanColumn } from "./kanban-column";
import { SortableTaskCard } from "./sortable-task-card";

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "To Do", title: "To Do" },
  { id: "In Progress", title: "In Progress" },
  { id: "Done", title: "Done" },
];

export function KanbanBoard() {
  const { tasks, loading, error, fetchTasks, updateTask, subscribeToTasks, getFilteredTasks } = useTaskStore();
  const [activeTask, setActiveTask] = useState<TaskWithAssignee | null>(null);

  // Use filtered tasks instead of all tasks
  const filteredTasks = getFilteredTasks();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 8,
      },
    }),
  );

  // Custom collision detection that works better for stacked layouts
  const collisionDetectionStrategy = (args: any) => {
    // First, let's see if there are any collisions with the pointer
    const pointerCollisions = pointerWithin(args);

    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }

    // If no pointer collision, fall back to closest center
    return closestCenter(args);
  };

  useEffect(() => {
    fetchTasks();
    const unsubscribe = subscribeToTasks();
    return unsubscribe;
  }, [fetchTasks, subscribeToTasks]);

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over)
      return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId)
      return;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask)
      return;

    // Handle dropping on a column
    if (COLUMNS.some(col => col.id === overId)) {
      const newStatus = overId as TaskStatus;
      if (activeTask.status !== newStatus) {
        // Update task status optimistically for better UX
        updateTask(activeTask.id, { status: newStatus });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over)
      return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId)
      return;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask)
      return;

    // Handle dropping on a column
    if (COLUMNS.some(col => col.id === overId)) {
      const newStatus = overId as TaskStatus;
      if (activeTask.status !== newStatus) {
        // Final update to ensure consistency
        updateTask(activeTask.id, { status: newStatus });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-red-600">
          Error:
          {" "}
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-secondary min-h-screen/2 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 lg:p-6 h-full">
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetectionStrategy}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {COLUMNS.map(column => (
            <KanbanColumn key={column.id} column={column} tasks={getTasksByStatus(column.id)} />
          ))}
          <DragOverlay>
            {activeTask ? <SortableTaskCard task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
