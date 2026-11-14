'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BttleAuthProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export default function BttleAuth({
  className,
  size = 'md',
  variant = 'primary',
  children,
  onClick,
  disabled = false,
}: BttleAuthProps) {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variants = {
    primary: 'bg-bhemed-ocean-blue text-white hover:bg-bhemed-petroleum-blue',
    secondary: 'bg-white text-bhemed-ocean-blue hover:bg-bhemed-ice-blue border border-bhemed-ocean-blue',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        sizes[size],
        variants[variant],
        className
      )}
    >
      {children}
    </motion.button>
  );
}