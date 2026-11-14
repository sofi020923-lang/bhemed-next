'use client';

import { motion } from 'framer-motion';
import { Search, BookOpen, PackageOpen } from 'lucide-react';

export function useFarmacheckNavigation() {
  const items = [
    { href: '/farmacheck', label: 'Búsqueda', icon: <Search className="w-4 h-4" />, description: 'Buscar medicamentos por nombre, principio activo o concentración' },
    { href: '/farmacheck/glosario', label: 'Glosario', icon: <BookOpen className="w-4 h-4" />, description: 'Diccionario farmacológico con términos y definiciones' },
  ];

  return items;
}

export function FarmacheckSearchBar({
  searchTerm,
  setSearchTerm,
  loading,
  onSearch,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  loading: boolean;
  onSearch: (term: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex gap-2"
    >
      <input
        type="text"
        placeholder="Buscar medicamento..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={loading}
        className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue"
        aria-label="Buscar medicamento"
      />
      <button
        onClick={() => onSearch(searchTerm)}
        disabled={loading || !searchTerm.trim()}
        className="btn-bhemed bg-bhemed-ocean-blue text-white rounded-lg px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Buscar"
      >
        Buscar
      </button>
    </motion.div>
  );
}

export function FarmacheckMedicineCard({
  medicamento,
  onSelect,
}: {
  medicamento: {
    id: string;
    nombreComercial: string;
    nombreGenerico: string;
    principioActivo: string;
    concentracion?: string;
    formaFarmaceutica?: string;
    requiereReceta: boolean;
  };
  onSelect: (medicamento: any) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg border border-gray-100 dark:border-gray-700 hover:border-bhemed-ocean-blue transition-all cursor-pointer"
      onClick={() => onSelect(medicamento)}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-bhemed-ice-blue dark:bg-bhemed-petroleum-blue/20 flex items-center justify-center text-sm">
            <span className="font-medium text-bhemed-ocean-blue">
              {medicamento.nombreComercial.charAt(0).toUpperCase()}{medicamento.nombreGenerico.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">{medicamento.nombreComercial}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{medicamento.principioActivo}</p>
          </div>
        </div>
      </div>
      <div className="p-3 pt-0 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Requiere receta: <span className="font-medium">{medicamento.requiereReceta ? 'Sí' : 'No'}</span>
        </p>
      </div>
    </motion.div>
  );
}

export function FarmacheckEmptyState() {
  return (
    <div className="py-16 text-center">
      <PackageOpen className="w-12 h-12 text-bhemed-ocean-blue mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No hay medicamentos</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">Intenta buscar un medicamento por su nombre comercial, genérico o principio activo</p>
    </div>
  );
}