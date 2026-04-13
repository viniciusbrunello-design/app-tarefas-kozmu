import type { TaskTag } from '../../types';

interface TagBadgeProps {
  tag: TaskTag;
}

const tagColors: Record<TaskTag, string> = {
  'Criação de conteúdo': 'var(--tag-criacao)',
  'Estruturação': 'var(--tag-estruturacao)',
  'Planejamento': 'var(--tag-planejamento)',
  'Design': 'var(--tag-design)',
  'Automação': 'var(--tag-automacao)',
};

export function TagBadge({ tag }: TagBadgeProps) {
  // Transparência de 12% no background, equivalente à opacidade 0.12 do alpha hex css
  return (
    <span className="tag-badge" style={{ color: tagColors[tag], backgroundColor: `${tagColors[tag]}1F` }}>
      <span className="tag-dot" style={{ backgroundColor: tagColors[tag] }} />
      {tag}
    </span>
  );
}
