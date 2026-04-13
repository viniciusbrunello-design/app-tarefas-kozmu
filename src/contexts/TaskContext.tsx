import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Task, TaskStatus } from '../types';
import { supabase } from '../lib/supabase';

interface TaskContextData {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: TaskStatus }) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
}

const TaskContext = createContext<TaskContextData>({} as TaskContextData);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();

    // Inscrição em tempo real! Toda mudança do banco altera instantaneamente a lista local
    const channel = supabase.channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => {
          fetchTasks(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      const formattedTasks: Task[] = data.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        owner: t.owner as any,
        status: t.status as any,
        tags: t.tags || [],
        createdAt: t.created_at,
        updatedAt: t.updated_at
      }));
      setTasks(formattedTasks);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: TaskStatus }) => {
    // Criação otimista em memória (para a fluidez de interface parecer instantânea)
    const tempId = crypto.randomUUID();
    const newTask: Task = {
      id: tempId,
      ...taskData,
      status: taskData.status || 'Não iniciado',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);

    // O banco Supabase entende que passamos o ID fixo e cadastra-o, e pelo Real-time ele retornará formatado.
    const { error } = await supabase.from('tasks').insert([{
      id: tempId, 
      title: taskData.title,
      description: taskData.description,
      owner: taskData.owner,
      status: taskData.status || 'Não iniciado',
      tags: taskData.tags
    }]);
    
    if (error) {
      console.error('Erro ao adicionar tarefa:', error);
      fetchTasks(); // Reverte pro banco em caso de falha
    }
  };

  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id'>>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, ...updates, updatedAt: new Date().toISOString() } 
          : task
      )
    );

    // Mapeamento minucioso do banco
    const dbUpdates: any = {...updates};
    
    await supabase.from('tasks').update(dbUpdates).eq('id', id);
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    await supabase.from('tasks').delete().eq('id', id);
  };

  const moveTask = async (id: string, newStatus: TaskStatus) => {
    // Muda a cor logo que dropar a coluna do kanban - UX imediato.
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString() } 
          : task
      )
    );
    await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, moveTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used dentro de um TaskProvider');
  }
  return context;
}
