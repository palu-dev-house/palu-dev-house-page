import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  /** `sunken` sits back on a muted band; `raised` floats above white. */
  tone?: 'default' | 'raised' | 'sunken';
}

const toneStyles = {
  default: 'border-line bg-surface',
  raised: 'border-line bg-surface shadow-md',
  sunken: 'border-line bg-surface-muted',
} as const;

export function Card({ children, className = '', hoverable = true, tone = 'default' }: CardProps) {
  return (
    <motion.div
      // Transform-only on hover; the shadow is a CSS transition so the browser
      // is not recompositing a blur on every frame.
      whileHover={hoverable ? { y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className={
        `rounded-lg border p-6 transition-shadow duration-200 ${toneStyles[tone]} ` +
        (hoverable ? 'hover:shadow-lg ' : '') +
        className
      }
    >
      {children}
    </motion.div>
  );
}
