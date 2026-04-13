import { useState } from 'react';
import { useTasks } from '../../contexts/TaskContext';
import { TaskCard } from '../TaskCard';
import type { Task, TaskStatus, TaskOwner } from '../../types';

export function TaskList({ onTaskClick }: { onTaskClick: (task: Task) => void }) {
  const { tasks } = useTasks();
  const [search, setSearch] = useState('');
  const [filterOwner, setFilterOwner] = useState<TaskOwner | ''>('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | ''>('');

  const filteredTasks = tasks.filter(task => {
    if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterOwner && task.owner !== filterOwner) return false;
    if (filterStatus && task.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="task-list-view">
      <div className="list-filters">
        <input 
          type="text" 
          placeholder="Buscar tarefas..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="filter-input input-search" 
        />
        <select value={filterOwner} onChange={(e) => setFilterOwner(e.target.value as TaskOwner | '')} className="filter-input">
          <option value="">Qualquer Responsável</option>
          <option value="Julia">Julia</option>
          <option value="Vinicius">Vinicius</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as TaskStatus | '')} className="filter-input">
          <option value="">Qualquer Status</option>
          <option value="Não iniciado">Não iniciado</option>
          <option value="Em andamento">Em andamento</option>
          <option value="Finalizada">Finalizada</option>
        </select>
      </div>

      <div className="list-content">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">Nenhuma tarefa encontrada com os filtros atuais.</div>
        ) : (
          <div className="list-grid">
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} showStatus={true} onClick={() => onTaskClick(task)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
