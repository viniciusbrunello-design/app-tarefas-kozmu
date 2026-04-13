import { useState } from 'react';
import { useTasks } from '../../contexts/TaskContext';
import type { Task, TaskStatus } from '../../types';
import { TaskCard } from '../TaskCard';
import { DndContext, closestCorners, useDroppable, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const COLUMNS: TaskStatus[] = ['Não iniciado', 'Em andamento', 'Finalizada'];

interface ItemProps {
  task: Task;
  onClick: (task: Task) => void;
}

function SortableTaskItem({ task, onClick }: ItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: task.id 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    cursor: isDragging ? 'grabbing' : 'pointer'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={() => onClick(task)} />
    </div>
  );
}

interface KanbanColProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

function KanbanColumn({ status, tasks, onTaskClick }: KanbanColProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const statusClass = status === 'Não iniciado' ? 'col-red' 
                    : status === 'Em andamento' ? 'col-orange' 
                    : 'col-green';

  return (
    <div 
      className={`kanban-column ${statusClass} ${isOver ? 'drop-target' : ''}`} 
      ref={setNodeRef}
    >
      <div className="column-header">
        <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
           <h2>{status}</h2>
           <span className="column-count">{tasks.length}</span>
        </div>
      </div>
      <div className="column-content">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <SortableTaskItem key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export function TaskBoard({ onTaskClick }: { onTaskClick: (task: Task) => void }) {
  const { tasks, moveTask } = useTasks();
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find(t => t.id === taskId);
    const overTask = tasks.find(t => t.id === overId);

    if (activeTask) {
      if (overTask) {
        if (activeTask.status !== overTask.status) {
           moveTask(taskId, overTask.status);
        }
      } else if (COLUMNS.includes(overId as TaskStatus)) {
        if (activeTask.status !== overId) {
            moveTask(taskId, overId as TaskStatus);
        }
      }
    }
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  return (
    <DndContext 
      collisionDetection={closestCorners} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="task-board">
        {COLUMNS.map(status => (
          <KanbanColumn 
            key={status} 
            status={status} 
            tasks={tasks.filter(t => t.status === status)} 
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div style={{ 
            cursor: 'grabbing', 
            opacity: 1, 
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)', 
            borderRadius: '12px', 
            transform: 'scale(1.02) rotate(2deg)' 
          }}>
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
