import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  onNewTask: () => void;
  viewMode: 'list' | 'kanban';
  onViewChange: (mode: 'list' | 'kanban') => void;
}

export function Header({ onNewTask, viewMode, onViewChange }: HeaderProps) {
  return (
    <header className="page-header">
      <div className="header-title-area">
        <h1>Tarefas</h1>
        <p>Workspace de Júlia e Vinícius</p>
      </div>

      <div className="header-actions">
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewChange('list')}
          >
            Lista
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
            onClick={() => onViewChange('kanban')}
          >
            Kanban
          </button>
        </div>

        <Button onClick={onNewTask} icon={<Plus size={18} />}>
          Nova Tarefa
        </Button>
      </div>
    </header>
  );
}
