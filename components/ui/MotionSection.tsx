import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}

/**
 * Fade-up section with:
 * - `once: true` + `amount: 0.1` so the IntersectionObserver disconnects early
 * - `cv-auto` to skip rendering offscreen sections (big scroll FPS win)
 * - `gpu-layer` to keep the fade on its own compositor layer during animation
 */
export function MotionSection({ children, className = '', id, delay = 0 }: MotionSectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px', amount: 0.1 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={`cv-auto gpu-layer ${className}`}
    >
      {children}
    </motion.section>
  );
}
