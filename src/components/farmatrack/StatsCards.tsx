'use client';

import { motion } from 'framer-motion';
import { PackageOpen, Heart, Activity, CheckCircle } from 'lucide-react';
import Card from '@/components/ui/Card';

interface FarmaTrackStats {
  totalMedicamentos: number;
  tratamientosActivos: number;
  dosisTomadasHoy: number;
  recordatoriosPendientes: number;
}

export function FarmaTrackStatsCards({ stats }: { stats: FarmaTrackStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card animated={true} delay={0.1}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="p-4 bg-bhemed-ice-blue dark:bg-bhemed-petroleum-blue text-white"
        >
          <PackageOpen className="w-6 h-6 mb-3" />
          <h3 className="text-2xl font-bold">{stats.totalMedicamentos}</h3>
          <p className="text-sm opacity-80">Medicamentos registrados</p>
        </motion.div>
      </Card>

      <Card animated={true} delay={0.2}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="p-4 bg-bhemed-ocean-blue text-white"
        >
          <Heart className="w-6 h-6 mb-3" />
          <h3 className="text-2xl font-bold">{stats.tratamientosActivos}</h3>
          <p className="text-sm opacity-80">Tratamientos activos</p>
        </motion.div>
      </Card>

      <Card animated={true} delay={0.3}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="p-4 bg-indigo-500 dark:bg-indigo-600 text-white"
        >
          <Activity className="w-6 h-6 mb-3" />
          <h3 className="text-2xl font-bold">{stats.dosisTomadasHoy}</h3>
          <p className="text-sm opacity-80">Dosis tomadas hoy</p>
        </motion.div>
      </Card>

      <Card animated={true} delay={0.4}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="p-4 bg-green-500 dark:bg-green-600 text-white"
        >
          <CheckCircle className="w-6 h-6 mb-3" />
          <h3 className="text-2xl font-bold">{stats.recordatoriosPendientes}</h3>
          <p className="text-sm opacity-80">Recordatorios pendientes</p>
        </motion.div>
      </Card>
    </div>
  );
}