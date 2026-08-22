import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'brand' | 'muted' | 'accent' | 'outline';
  className?: string;
}

const styles = {
  brand: 'bg-brand-600 text-white',
  accent: 'bg-accent-500/15 text-accent-600 dark:text-accent-400',
  muted: 'bg-surface-muted text-ink-muted border border-line',
  outline: 'bg-surface/70 text-ink-muted border border-line backdrop-blur-sm',
} as const;

export function Badge({ children, variant = 'brand', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
