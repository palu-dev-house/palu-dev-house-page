import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = '', hoverable = true }: CardProps) {
  const hoverProps = hoverable ? { whileHover: { y: -4, boxShadow: '0 12px 32px -8px rgba(32, 101, 161, 0.18)' } } : {};
  return (
    <motion.div
      {...hoverProps}
      transition={{ duration: 0.2 }}
      className={`rounded-xl border border-line bg-surface p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
