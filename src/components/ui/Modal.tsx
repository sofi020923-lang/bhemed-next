'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export type ModalVariant = 'success' | 'error' | 'info';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  variant?: ModalVariant;
  /** Texto del botón principal. Por defecto 'Entendido'. */
  actionLabel?: string;
  /** Acción del botón principal. Por defecto solo cierra el modal. */
  onAction?: () => void;
}

const variants: Record<
  ModalVariant,
  { icon: typeof CheckCircle2; tile: string; button: 'primary' | 'danger' }
> = {
  success: {
    icon: CheckCircle2,
    tile: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    button: 'primary',
  },
  error: {
    icon: AlertCircle,
    tile: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
    button: 'danger',
  },
  info: {
    icon: Info,
    tile: 'bg-bhemed-ice-blue text-bhemed-ocean-blue dark:bg-bhemed-ocean-blue/10 dark:text-bhemed-ice-blue',
    button: 'primary',
  },
};

/**
 * Diálogo del sistema de diseño BHEMED.
 * Reemplaza los alert() nativos: overlay con blur, panel con spring sutil,
 * icono por variante y cierre con Escape / click fuera.
 */
export default function Modal({
  open,
  onClose,
  title,
  message,
  variant = 'info',
  actionLabel = 'Entendido',
  onAction,
}: ModalProps) {
  const actionRef = useRef<HTMLButtonElement>(null);
  const config = variants[variant];
  const Icon = config.icon;

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    actionRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bhemed-petroleum-blue/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-lift dark:bg-gray-800"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <span
                className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-full',
                  config.tile
                )}
              >
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              {message && (
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {message}
                </p>
              )}
              <Button
                ref={actionRef}
                variant={config.button}
                className="mt-6"
                fullWidth
                onClick={onAction ?? onClose}
              >
                {actionLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
