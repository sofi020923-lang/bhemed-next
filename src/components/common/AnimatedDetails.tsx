'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedDetailsProps {
  children: React.ReactNode;
  title: string;
  showMore?: boolean;
  onToggle?: () => void;
  delay?: number;
  defaultExpanded?: boolean;
}

export default function AnimatedDetails({
  children,
  title,
  onToggle,
  delay = 0,
  defaultExpanded = false,
}: AnimatedDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggle = () => {
    setIsExpanded((prev) => !prev);
    onToggle?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        'rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden',
        isExpanded && 'border-bhemed-ocean-blue'
      )}
    >
      <div
        onClick={toggle}
        className="flex items-center justify-between cursor-pointer p-4"
      >
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-gray-100 dark:border-gray-700">
              <div className="pt-3">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}