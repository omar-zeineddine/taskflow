import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import type { TaskStatus, TaskWithAssignee } from "@/types/task";

import { SortableTaskCard } from "./sortable-task-card";

type KanbanColumnProps = {
  column: { id: TaskStatus; title: string };
  tasks: TaskWithAssignee[];
};

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full min-w-0 bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-colors duration-200 ${
        isOver ? "bg-blue-50 border-blue-300" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="font-semibold text-gray-700">{column.title}</h3>
        <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">{tasks.length}</span>
      </div>

      <div className="flex-1 min-h-32 space-y-3 overflow-y-auto">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <SortableTaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {/* Empty drop zone for better UX */}
        {tasks.length === 0 && (
          <div className={`flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg transition-colors duration-200 ${
            isOver ? "border-blue-400 bg-blue-50" : ""
          }`}
          >
            <p className="text-sm text-gray-500">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}
