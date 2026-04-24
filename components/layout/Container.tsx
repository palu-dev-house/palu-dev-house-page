import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}

export function Container({ children, className = '', narrow = false }: ContainerProps) {
  const maxW = narrow ? 'max-w-prose' : 'max-w-content';
  return <div className={`${maxW} mx-auto px-6 ${className}`}>{children}</div>;
}
