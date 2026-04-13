import { LayoutDashboard } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">K</div>
        <span className="logo-text">Kozmu</span>
      </div>
      
      <nav className="sidebar-nav">
        <a href="#" className="nav-item active">
          <LayoutDashboard size={20} />
          <span>Tarefas</span>
        </a>
      </nav>
    </aside>
  );
}
