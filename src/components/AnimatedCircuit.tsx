'use client';

import { motion } from 'framer-motion';

export function AnimatedCircuit() {
  return (
    <svg
      className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circuit paths with animated dashes */}
      <motion.path
        d="M50 200 H150 V100 H250"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeDasharray="8 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
          times: [0, 0.4, 0.6, 1],
        }}
      />
      <motion.path
        d="M50 250 H100 V350 H200"
        stroke="#6366F1"
        strokeWidth="2"
        strokeDasharray="8 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
          delay: 2,
          times: [0, 0.4, 0.6, 1],
        }}
      />
      <motion.path
        d="M300 50 V150 H350 V250"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeDasharray="8 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
          delay: 1,
          times: [0, 0.4, 0.6, 1],
        }}
      />
      <motion.path
        d="M150 300 H250 V380"
        stroke="#6366F1"
        strokeWidth="2"
        strokeDasharray="8 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'linear',
          delay: 3,
          times: [0, 0.4, 0.6, 1],
        }}
      />

      {/* Animated nodes */}
      <motion.circle
        cx="150"
        cy="200"
        r="6"
        fill="#3B82F6"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="250"
        cy="100"
        r="6"
        fill="#6366F1"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      <motion.circle
        cx="100"
        cy="250"
        r="6"
        fill="#3B82F6"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.circle
        cx="200"
        cy="350"
        r="6"
        fill="#6366F1"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
      <motion.circle
        cx="300"
        cy="150"
        r="6"
        fill="#3B82F6"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.circle
        cx="350"
        cy="250"
        r="6"
        fill="#6366F1"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
      />

      {/* Connection lines */}
      <line x1="150" y1="200" x2="250" y2="100" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
      <line x1="100" y1="250" x2="200" y2="350" stroke="#6366F1" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}
