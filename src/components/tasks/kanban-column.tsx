import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import type { TaskWithAssignee } from "@/types/task";

import { SortableTaskCard } from "./sortable-task-card";

type KanbanColumnProps = {
  column: { id: string; title: string };
  tasks: TaskWithAssignee[];
};

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full min-w-0 bg-card border border-border rounded-lg p-4 shadow-sm transition-colors duration-200 ${
        isOver ? "bg-primary/5 border-primary/30" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="font-semibold text-foreground">{column.title}</h3>
        <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">{tasks.length}</span>
      </div>

      <div className="flex-1 min-h-32 space-y-3 overflow-y-auto">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <SortableTaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {/* Empty drop zone for better UX */}
        {tasks.length === 0 && (
          <div className={`flex items-center justify-center h-32 border-2 border-dashed border-border rounded-lg transition-colors duration-200 ${
            isOver ? "border-primary/50 bg-primary/5" : ""
          }`}
          >
            <p className="text-sm text-muted-foreground">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}
