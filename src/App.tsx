import { useState } from 'react';
import { TaskProvider } from './contexts/TaskContext';
import { Layout } from './components/layout/Layout';
import { Header } from './components/layout/Header';
import { MiniDashboard } from './components/layout/MiniDashboard';
import { TaskBoard } from './components/views/TaskBoard';
import { TaskList } from './components/views/TaskList';
import { TaskDrawer } from './components/TaskDrawer';
import type { Task } from './types';

function AppContent() {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleNewTask = () => {
    setEditingTask(null);
    setIsDrawerOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDrawerOpen(true);
  };

  return (
    <Layout>
      <Header 
        viewMode={viewMode} 
        onViewChange={setViewMode} 
        onNewTask={handleNewTask} 
      />
      <MiniDashboard />

      {viewMode === 'kanban' ? (
        <TaskBoard onTaskClick={handleEditTask} />
      ) : (
        <TaskList onTaskClick={handleEditTask} />
      )}

      <TaskDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        editingTask={editingTask} 
      />
    </Layout>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}
