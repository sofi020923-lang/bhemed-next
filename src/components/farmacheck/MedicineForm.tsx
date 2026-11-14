'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MedicineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (medicamento: {
    nombre: string;
    principioActivo?: string;
    concentracion?: string;
    formaFarmaceutica?: string;
    laboratorio?: string;
  }) => void;
  initialValues?: {
    nombre: string;
    principioActivo?: string;
    concentracion?: string;
    formaFarmaceutica?: string;
    laboratorio?: string;
  };
}

export default function MedicineForm({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: MedicineFormProps) {
  const [formValues, setFormValues] = useState(initialValues || { nombre: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.nombre.trim()) {
      setError('El nombre del medicamento es requerido');
      return;
    }
    onSubmit(formValues);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'bg-white dark:bg-gray-800 rounded-xl shadow-soft w-full max-w-md p-6',
          'max-w-md'
        )}
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
          <Pill className="w-5 h-5 mr-2 text-bhemed-ocean-blue inline-block" /> Agregar Medicamento
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre del medicamento
            </label>
            <input
              type="text"
              value={formValues.nombre}
              onChange={(e) => setFormValues({ ...formValues, nombre: e.target.value })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue"
              placeholder="Ej: Paracetamol 500mg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Principio activo
            </label>
            <input
              type="text"
              value={formValues.principioActivo || ''}
              onChange={(e) => setFormValues({ ...formValues, principioActivo: e.target.value })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue"
              placeholder="Ej: Paracetamol"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Concentración
            </label>
            <input
              type="text"
              value={formValues.concentracion || ''}
              onChange={(e) => setFormValues({ ...formValues, concentracion: e.target.value })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue"
              placeholder="Ej: 500mg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Laboratorio
            </label>
            <input
              type="text"
              value={formValues.laboratorio || ''}
              onChange={(e) => setFormValues({ ...formValues, laboratorio: e.target.value })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue"
              placeholder="Ej: laboratorioABC"
            />
          </div>
          {error && <p className="text-error text-sm">{error}</p>}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="submit"
              className="btn-bhemed bg-bhemed-ocean-blue text-white hover:bg-bhemed-petroleum-blue focus:ring-bhemed-ocean-blue"
            >
              <Plus className="w-4 h-4 mr-2" />
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-bhemed bg-white text-bhemed-ocean-blue hover:bg-bhemed-ice-blue focus:ring-bhemed-ocean-blue"
            >
              Cancelar
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}