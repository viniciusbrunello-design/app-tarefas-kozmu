import { useState, useEffect } from 'react';
import type { Task, TaskOwner, TaskStatus, TaskTag } from '../types';
import { useTasks } from '../contexts/TaskContext';
import { Button } from './ui/Button';

interface TaskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  editingTask: Task | null;
}

const AVAILABLE_TAGS: TaskTag[] = ['Criação de conteúdo', 'Estruturação', 'Planejamento', 'Design', 'Automação'];

export function TaskDrawer({ isOpen, onClose, editingTask }: TaskDrawerProps) {
  const { addTask, updateTask } = useTasks();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState<TaskOwner>('Julia');
  const [status, setStatus] = useState<TaskStatus>('Não iniciado');
  const [tags, setTags] = useState<TaskTag[]>([]);

  useEffect(() => {
    if (editingTask && isOpen) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setOwner(editingTask.owner);
      setStatus(editingTask.status);
      setTags(editingTask.tags);
    } else if (isOpen) {
      setTitle('');
      setDescription('');
      setOwner('Julia');
      setStatus('Não iniciado');
      setTags([]);
    }
  }, [editingTask, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, { title, description, owner, status, tags });
    } else {
      addTask({ title, description, owner, status, tags });
    }
    onClose();
  };

  const toggleTag = (tag: TaskTag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <>
      {isOpen && <div className="drawer-overlay" onClick={onClose} />}
      <div className={`drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2>{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="drawer-body">
          <div className="form-group">
            <label>Título da tarefa</label>
            <input 
              autoFocus
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Ex: Criar postagem de blog..."
              required
            />
          </div>

          <div className="form-group">
            <label>Descrição (opcional)</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Detalhes ou observações adicionais"
              rows={4}
            />
          </div>

          <div className="form-group row-group">
            <div className="flex-group">
              <label>Responsável</label>
              <select value={owner} onChange={e => setOwner(e.target.value as TaskOwner)}>
                <option value="Julia">Julia</option>
                <option value="Vinicius">Vinicius</option>
              </select>
            </div>

            <div className="flex-group">
              <label>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as TaskStatus)}>
                <option value="Não iniciado">Não iniciado</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Finalizada">Finalizada</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tags-selector">
              {AVAILABLE_TAGS.map(tag => (
                <button 
                  type="button" 
                  key={tag}
                  className={`tag-select-btn ${tags.includes(tag) ? 'selected' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="drawer-actions">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar Tarefa</Button>
          </div>
        </form>
      </div>
    </>
  );
}
