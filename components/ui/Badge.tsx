import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'brand' | 'muted';
}

export function Badge({ children, variant = 'brand' }: BadgeProps) {
  const styles =
    variant === 'brand'
      ? 'bg-brand text-white'
      : 'bg-surface-muted text-ink-muted border border-line';
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>
      {children}
    </span>
  );
}
