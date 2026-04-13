import type { TaskOwner } from '../../types';

interface OwnerBadgeProps {
  owner: TaskOwner;
}

export function OwnerBadge({ owner }: OwnerBadgeProps) {
  const isJulia = owner === 'Julia';
  return (
    <span className={`owner-badge ${isJulia ? 'owner-julia' : 'owner-vinicius'}`}>
      {owner}
    </span>
  );
}
