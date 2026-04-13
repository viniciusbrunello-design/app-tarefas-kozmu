import type { Task } from '../types';
import { TagBadge } from './ui/TagBadge';
import { OwnerBadge } from './ui/OwnerBadge';
import { CircleDot } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  showStatus?: boolean;
}

function getStatusClass(status: string) {
  if (status === 'Não iniciado') return 'status-nao-iniciado';
  if (status === 'Em andamento') return 'status-em-andamento';
  return 'status-finalizada';
}

export function TaskCard({ task, onClick, showStatus }: TaskCardProps) {
  return (
    <div className="task-card" onClick={onClick}>
      {showStatus && (
        <div className={`task-status-label ${getStatusClass(task.status)}`}>
          <CircleDot size={14} strokeWidth={2.5} />
          {task.status}
        </div>
      )}
      <h3 className="task-title">{task.title}</h3>
      {task.description && <p className="task-description">{task.description}</p>}
      
      <div className="task-meta">
        <OwnerBadge owner={task.owner} />
        <div className="task-tags">
          {task.tags.map(tag => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  );
}
