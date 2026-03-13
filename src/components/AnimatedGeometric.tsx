'use client';

import { motion } from 'framer-motion';

export function AnimatedGeometric() {
  return (
    <svg
      className="absolute bottom-0 left-0 w-80 h-80 opacity-10 pointer-events-none"
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rotating hexagons */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '160px 160px' }}
      >
        <polygon
          points="160,40 280,100 280,220 160,280 40,220 40,100"
          stroke="#3B82F6"
          strokeWidth="2"
          fill="none"
        />
      </motion.g>

      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '160px 160px' }}
      >
        <polygon
          points="160,80 240,120 240,200 160,240 80,200 80,120"
          stroke="#6366F1"
          strokeWidth="2"
          fill="none"
        />
      </motion.g>

      {/* Pulsing circles */}
      <motion.circle
        cx="160"
        cy="160"
        r="30"
        fill="#3B82F6"
        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="160"
        cy="160"
        r="20"
        fill="#6366F1"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* Small decorative circles */}
      <motion.circle
        cx="160"
        cy="40"
        r="4"
        fill="#3B82F6"
        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="280"
        cy="100"
        r="4"
        fill="#6366F1"
        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      />
      <motion.circle
        cx="280"
        cy="220"
        r="4"
        fill="#3B82F6"
        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
      />
      <motion.circle
        cx="160"
        cy="280"
        r="4"
        fill="#6366F1"
        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.9, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
      />
      <motion.circle
        cx="40"
        cy="220"
        r="4"
        fill="#3B82F6"
        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      />
      <motion.circle
        cx="40"
        cy="100"
        r="4"
        fill="#6366F1"
        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
    </svg>
  );
}
