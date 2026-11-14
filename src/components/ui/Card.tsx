'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  animated?: boolean;
  delay?: number;
  onClick?: () => void;
}

export default function Card({ children, className, animated = false, delay = 0, onClick }: CardProps) {
  const baseClasses = cn('card p-6', onClick && 'cursor-pointer', className);

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        whileHover={onClick ? { scale: 1.01 } : undefined}
        className={baseClasses}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );
}