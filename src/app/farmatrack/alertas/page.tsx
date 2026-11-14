'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Plus,
  XCircle,
  Package,
  Bell,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/store/AuthContext';

type AlertaItem = {
  id: string;
  userId: string;
  medicamentoPersonalId: string;
  stockActual: number;
  stockMinimo: number;
  fechaAlerta: string;
  estado: 'pendiente' | 'resolvido' | 'ignorado';
  createdAt: string;
  updatedAt: string;
};

export default function AlertasPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [alertas, setAlertas] = useState<AlertaItem[]>([]);

  const userId = user?.id || '';

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (userId) {
      fetch(`/api/alertas-reposicion?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setAlertas(data.data || []);
        })
        .catch(err => console.error('Error cargando alertas:', err));
    }
  }, [userId, isAuthenticated, isLoading]);

  async function handleUpdateEstado(id: string, estado: 'pendiente' | 'resolvido' | 'ignorado') {
    await fetch('/api/alertas-reposicion', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, estado }),
    });
    setAlertas(prev =>
      prev.map(a => (a.id === id ? { ...a, estado } : a))
    );
  }

  async function handleDelete(id: string) {
    if (!window.confirm('¿Eliminar esta alerta?')) return;
    await fetch('/api/alertas-reposicion', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setAlertas(prev => prev.filter(a => a.id !== id));
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhemed-ocean-blue"></div>
      </div>
    );
  }

  const openAlertas = alertas.filter(a => a.estado === 'pendiente');

  return (
    <Layout title="Alertas de Reposición">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alertas de Reposición</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Monitorea el stock de medicamentos para evitar faltantes.
            </p>
          </div>
          <Button leftIcon={<Plus className="w-4 h-4" />}>Crear alerta</Button>
        </motion.div>

        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            <Bell className="w-5 h-5 inline-block mr-2 text-bhemed-ocean-blue" />
            Alertas de reposición ({openAlertas.length} activas)
          </h3>
          {alertas.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Sin alertas activas</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No tienes alertas de stock pendientes.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alertas.map((a) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-bhemed-ocean-blue/10 dark:bg-bhemed-petroleum-blue/20 flex items-center justify-center">
                      <Package className="w-5 h-5 text-bhemed-ocean-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{a.medicamentoPersonalId}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Stock actual: {a.stockActual} | Mínimo: {a.stockMinimo}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Estado: {a.estado}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {a.estado === 'pendiente' && (
                      <>
                        <button
                          className="px-2 py-1 text-xs rounded bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                          onClick={() => handleUpdateEstado(a.id, 'resolvido')}
                        >
                          ✅ Resolver
                        </button>
                        <button
                          className="px-2 py-1 text-xs rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                          onClick={() => handleUpdateEstado(a.id, 'ignorado')}
                        >
                          ❌ Ignorar
                        </button>
                      </>
                    )}
                    <button
                      className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      onClick={() => handleDelete(a.id)}
                      title="Eliminar"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
