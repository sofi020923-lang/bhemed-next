'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedSVGProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  type?: 'fade' | 'slide' | 'scale' | 'rotate';
}

export default function AnimatedSVG({
  children,
  className,
  delay = 0,
  duration = 0.5,
  type = 'fade',
}: AnimatedSVGProps) {
  const animations = {
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
    slide: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
    scale: { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 } },
    rotate: { initial: { opacity: 0, rotate: -180 }, animate: { opacity: 1, rotate: 0 } },
  };

  const { initial, animate } = animations[type];

  return (
    <motion.svg
      className={cn('w-full h-full', className)}
      initial={initial}
      animate={animate}
      transition={{ duration, delay, ease: 'easeOut' }}
      viewBox="0 0 200 200"
    >
      {children}
    </motion.svg>
  );
}