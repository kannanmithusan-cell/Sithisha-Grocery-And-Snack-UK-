'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  id?: string;
}

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  id,
}: AnimatedSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  let initialY = 0;
  let initialX = 0;

  if (!shouldReduceMotion) {
    if (direction === 'up') initialY = 30;
    if (direction === 'down') initialY = -30;
    if (direction === 'left') initialX = 30;
    if (direction === 'right') initialX = -30;
  }

  return (
    <motion.div
      id={id}
      initial={{
        opacity: 0,
        y: initialY,
        x: initialX,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
      }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: shouldReduceMotion ? 0.1 : 0.6,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
