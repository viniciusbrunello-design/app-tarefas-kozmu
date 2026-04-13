export type TaskOwner = 'Julia' | 'Vinicius';

export type TaskStatus = 'Não iniciado' | 'Em andamento' | 'Finalizada';

export type TaskTag = 
  | 'Criação de conteúdo'
  | 'Estruturação'
  | 'Planejamento'
  | 'Design'
  | 'Automação';

export interface Task {
  id: string;
  title: string;
  description?: string;
  owner: TaskOwner;
  status: TaskStatus;
  tags: TaskTag[];
  createdAt: string;
  updatedAt: string;
}
