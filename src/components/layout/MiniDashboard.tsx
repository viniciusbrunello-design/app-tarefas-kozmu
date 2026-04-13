import { useTasks } from '../../contexts/TaskContext';

export function MiniDashboard() {
  const { tasks } = useTasks();
  
  const total = tasks.length;
  const backlog = tasks.filter(t => t.status === 'Não iniciado').length;
  const inProgress = tasks.filter(t => t.status === 'Em andamento').length;
  const done = tasks.filter(t => t.status === 'Finalizada').length;

  return (
    <div className="mini-dashboard">
      <div className="stat-card">
        <span className="stat-label">Total Geral</span>
        <span className="stat-value text-primary">{total}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Não iniciado</span>
        <span className="stat-value" style={{ color: 'var(--status-red)' }}>{backlog}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Em andamento</span>
        <span className="stat-value" style={{ color: 'var(--status-orange)' }}>{inProgress}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Finalizada</span>
        <span className="stat-value" style={{ color: 'var(--status-green)' }}>{done}</span>
      </div>
    </div>
  );
}
