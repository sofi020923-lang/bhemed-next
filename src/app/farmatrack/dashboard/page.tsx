'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Pill, Search, Heart, Shield, Clock, Bell, CheckCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import { useAuth } from '@/store/AuthContext';

type RecordatorioItem = {
  id: string;
  fechaHora: string;
  estado: string;
  tipo: string;
};

export default function FarmatrackDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [medicamentosCount, setMedicamentosCount] = useState<number>(0);
  const [tratamientosCount, setTratamientosCount] = useState<number>(0);
  const [recordatorios, setRecordatorios] = useState<RecordatorioItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const userId = user?.id || '';

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!userId) return;
    let active = true;

    async function load() {
      setLoadingData(true);
      try {
        const [medRes, tratRes, recRes] = await Promise.all([
          fetch(`/api/medicamentos-personales?userId=${userId}`).then(r => r.json()).catch(() => ({ success: false })),
          fetch(`/api/tratamientos?userId=${userId}`).then(r => r.json()).catch(() => ({ success: false })),
          fetch(`/api/recordatorios?userId=${userId}`).then(r => r.json()).catch(() => ({ success: false })),
        ]);
        if (!active) return;
        setMedicamentosCount(medRes.success ? (medRes.data?.length || 0) : 0);
        setTratamientosCount(tratRes.success ? (tratRes.data?.length || 0) : 0);
        setRecordatorios(recRes.success ? (recRes.data || []) : []);
      } finally {
        if (active) setLoadingData(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhemed-ocean-blue"></div>
      </div>
    );
  }

  const todayISO = new Date().toISOString().slice(0, 10);
  const recordatoriosHoy = recordatorios.filter(
    (r) => r.fechaHora && r.fechaHora.slice(0, 10) === todayISO
  );
  const pendientesHoy = recordatoriosHoy.filter((r) => r.estado === 'pendiente');
  const tomadasHoy = recordatoriosHoy.filter((r) => r.estado === 'tomado');

  const stats = [
    { label: 'Medicamentos activos', value: String(medicamentosCount), icon: Pill, color: 'bg-bhemed-ocean-blue' },
    { label: 'Tratamientos', value: String(tratamientosCount), icon: Shield, color: 'bg-bhemed-petroleum-blue' },
    { label: 'Recordatorios hoy', value: String(recordatoriosHoy.length), icon: Bell, color: 'bg-indigo-500' },
    { label: 'Dosis tomadas', value: `${tomadasHoy.length}/${recordatoriosHoy.length}`, icon: CheckCircle, color: 'bg-green-500' },
  ];

  const proximos = [...pendientesHoy]
    .sort((a, b) => (a.fechaHora > b.fechaHora ? 1 : -1))
    .slice(0, 5);

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-bhemed-ocean-blue to-bhemed-petroleum-blue rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                ¡Hola, {user?.nombre || 'Usuario'}!
              </h2>
              <p className="text-bhemed-ice-blue">
                {currentTime.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <p className="text-bhemed-ice-blue mt-2">
                Tienes <strong>{pendientesHoy.length} recordatorio(s)</strong> pendiente(s) para hoy
              </p>
            </div>
            <Clock className="w-16 h-16 text-bhemed-ice-blue/30" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="card p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {loadingData ? '—' : stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Próximos recordatorios</h3>
            {proximos.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {loadingData ? 'Cargando...' : 'No tienes recordatorios pendientes para hoy.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {proximos.map((recordatorio, index) => (
                  <motion.div
                    key={recordatorio.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-bhemed-ice-blue dark:bg-bhemed-petroleum-blue/30 rounded-full flex items-center justify-center">
                        <Bell className="w-5 h-5 text-bhemed-ocean-blue" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Recordatorio #{index + 1}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(recordatorio.fechaHora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <span className="badge badge-warning">Pendiente</span>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Acciones rápidas</h3>
            <div className="grid grid-cols-2 gap-3">
              <a href="/farmatrack/medicamentos" className="p-4 bg-bhemed-ice-blue dark:bg-bhemed-petroleum-blue/30 rounded-lg hover:bg-bhemed-ocean-blue/10 transition-colors text-center">
                <Pill className="w-8 h-8 text-bhemed-ocean-blue mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Mis medicamentos</span>
              </a>
              <a href="/farmatrack/tratamientos" className="p-4 bg-bhemed-ice-blue dark:bg-bhemed-petroleum-blue/30 rounded-lg hover:bg-bhemed-ocean-blue/10 transition-colors text-center">
                <Shield className="w-8 h-8 text-bhemed-ocean-blue mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Tratamientos</span>
              </a>
              <a href="/farmacheck" className="p-4 bg-bhemed-ice-blue dark:bg-bhemed-petroleum-blue/30 rounded-lg hover:bg-bhemed-ocean-blue/10 transition-colors text-center">
                <Search className="w-8 h-8 text-bhemed-ocean-blue mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Buscar medicamento</span>
              </a>
              <a href="/farmatrack/recordatorios" className="p-4 bg-bhemed-ice-blue dark:bg-bhemed-petroleum-blue/30 rounded-lg hover:bg-bhemed-ocean-blue/10 transition-colors text-center">
                <Bell className="w-8 h-8 text-bhemed-ocean-blue mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Recordatorios</span>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
