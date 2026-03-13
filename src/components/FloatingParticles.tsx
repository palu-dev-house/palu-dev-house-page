'use client';

import { motion } from 'framer-motion';

const particleData = [
  { x: 10, y: 15, size: 3, duration: 18, delay: 0 },
  { x: 25, y: 80, size: 4, duration: 22, delay: 2 },
  { x: 40, y: 25, size: 2, duration: 16, delay: 1 },
  { x: 55, y: 65, size: 5, duration: 20, delay: 3 },
  { x: 70, y: 40, size: 3, duration: 19, delay: 4 },
  { x: 85, y: 85, size: 4, duration: 21, delay: 2 },
  { x: 15, y: 55, size: 2, duration: 17, delay: 1 },
  { x: 30, y: 10, size: 5, duration: 23, delay: 0 },
  { x: 45, y: 75, size: 3, duration: 18, delay: 3 },
  { x: 60, y: 30, size: 4, duration: 20, delay: 2 },
  { x: 75, y: 90, size: 2, duration: 16, delay: 4 },
  { x: 90, y: 20, size: 3, duration: 22, delay: 1 },
  { x: 5, y: 70, size: 5, duration: 19, delay: 3 },
  { x: 35, y: 45, size: 4, duration: 21, delay: 0 },
  { x: 50, y: 5, size: 2, duration: 17, delay: 2 },
  { x: 65, y: 95, size: 3, duration: 18, delay: 4 },
  { x: 80, y: 50, size: 4, duration: 20, delay: 1 },
  { x: 20, y: 35, size: 2, duration: 16, delay: 3 },
  { x: 95, y: 60, size: 5, duration: 23, delay: 0 },
  { x: 8, y: 90, size: 3, duration: 19, delay: 2 },
];

export function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particleData.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-blue-400/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size * 2}px`,
            height: `${particle.size * 2}px`,
          }}
          animate={{
            y: [-20, -40, -20, 0, -20],
            x: [0, 10, -10, 5, 0],
            opacity: [0.3, 0.6, 0.3, 0.5, 0.3],
            scale: [1, 1.2, 1, 1.1, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
