'use client';

import { motion } from 'framer-motion';
import { Package, AlarmClock, CalendarPlus, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReminderCardProps {
  id: string;
  fechaHora: string;
  tipo: 'medicamento' | 'reposicion' | 'cita';
  estado: 'pendiente' | 'tomado' | 'omitido' | 'reprogramado';
  onMarkTaken?: () => void;
  onDelete?: () => void;
}

export default function ReminderCard({
  fechaHora,
  tipo,
  estado,
  onDelete,
}: ReminderCardProps) {
  const statusColors = {
    pendiente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    tomado: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    omitido: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    reprogramado: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  };

  const statusTexts = {
    pendiente: 'Pendiente',
    tomado: 'Tomado',
    omitido: 'Omitido',
    reprogramado: 'Reprogramado',
  };

  const tipoIcons = {
    medicamento: <Package className="w-4 h-4 text-bhemed-ocean-blue" />,
    reposicion: <AlarmClock className="w-4 h-4 text-indigo-600" />,
    cita: <CalendarPlus className="w-4 h-4 text-green-600" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('rounded-lg border border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900')}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {tipoIcons[tipo]}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">{tipo}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(fechaHora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs rounded ${statusColors[estado]}`}>
          {statusTexts[estado]}
        </span>
      </div>
      {onDelete && (
        <button
          onClick={onDelete}
          className="mt-3 text-red-400 dark:text-red-500 hover:text-red-500 dark:hover:text-red-400 text-sm"
          aria-label="Eliminar recordatorio"
        >
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}