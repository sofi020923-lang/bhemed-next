'use client';

import { motion } from 'framer-motion';
import { PackageOpen, Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-bhemed-ice-blue dark:bg-bhemed-petroleum-blue/30 flex items-center justify-center mb-4">
        {icon || <PackageOpen className="w-10 h-10 text-bhemed-ocean-blue" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-bhemed btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}