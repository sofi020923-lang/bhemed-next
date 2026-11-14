'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Bell,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  CalendarPlus,
  Trash2,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal, { type ModalVariant } from '@/components/ui/Modal';
import { useAuth } from '@/store/AuthContext';

type RecordatorioItem = {
  id: string;
  fechaHora: string;
  tipo: string;
  estado: string;
  tratamientoId: string;
  tratamiento?: string;
  medicamento?: string;
};

export default function RecordatoriosPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [recordatorios, setRecordatorios] = useState<RecordatorioItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecordatorio, setNewRecordatorio] = useState({
    fechaHora: '',
    tipo: 'medicamento',
    tratamientoId: '',
  });
  const [creating, setCreating] = useState(false);
  const [dialog, setDialog] = useState<{ title: string; message?: string; variant: ModalVariant } | null>(null);

  const userId = user?.id || '';

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (userId) {
      fetch(`/api/recordatorios?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setRecordatorios(data.data || []);
        })
        .catch((err) => console.error('Error cargando recordatorios:', err));
    }
  }, [userId]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/recordatorios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          tratamientoId: newRecordatorio.tratamientoId,
          fechaHora: newRecordatorio.fechaHora,
          tipo: newRecordatorio.tipo,
          estado: 'pendiente',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRecordatorios((prev) => [...prev, data.data]);
        setNewRecordatorio({ fechaHora: '', tipo: 'medicamento', tratamientoId: '' });
        setShowAddForm(false);
      } else {
        setDialog({
          title: 'No se pudo crear el recordatorio',
          message: data.error || 'Ocurrió un error al crear el recordatorio.',
          variant: 'error',
        });
      }
    } catch (err) {
      setDialog({
        title: 'Error de conexión',
        message: 'No pudimos conectar con el servidor. Intenta de nuevo.',
        variant: 'error',
      });
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdateEstado(id: string, estado: string) {
    await fetch('/api/recordatorios', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, estado }),
    });
    setRecordatorios((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado } : r))
    );
  }

  async function handleDelete(id: string) {
    if (!window.confirm('¿Eliminar este recordatorio?')) return;
    await fetch('/api/recordatorios', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setRecordatorios((prev) => prev.filter((r) => r.id !== id));
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhemed-ocean-blue"></div>
      </div>
    );
  }

  return (
    <Layout title="Recordatorios">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recordatorios</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Administra tus recordatorios de medicamentos
            </p>
          </div>
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddForm(true)}
          >
            Nuevo recordatorio
          </Button>
        </motion.div>

        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recordatorios de hoy</h3>
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full">
              Hoy: {new Date().toLocaleDateString('es-ES')}
            </span>
          </div>
          {recordatorios.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Sin recordatorios</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">No tienes recordatorios programados para hoy.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recordatorios.map((r) => {
                const statusConfigs: Record<string, { color: string; text: string }> = {
                  pendiente: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', text: 'Pendiente' },
                  tomado: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', text: 'Tomado' },
                  omitido: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', text: 'Omitido' },
                  reprogramado: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300', text: 'Reprogramado' },
                };
                const config = statusConfigs[r.estado] || statusConfigs.pendiente;

                return (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {r.tipo === 'medicamento' ? (
                        <Package className="w-6 h-6 text-bhemed-ocean-blue" />
                      ) : (
                        <CalendarPlus className="w-6 h-6 text-indigo-600" />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{r.medicamento || 'Medicamento'}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{r.tratamiento || 'Tratamiento'}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(r.fechaHora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${config.color}`}>{config.text}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {r.estado === 'pendiente' && (
                        <>
                          <button
                            className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                            title="Marcar como tomado"
                            onClick={() => handleUpdateEstado(r.id, 'tomado')}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            title="Marcar como omitido"
                            onClick={() => handleUpdateEstado(r.id, 'omitido')}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title="Eliminar"
                        onClick={() => handleDelete(r.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Add form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-bhemed-ocean-blue" /> Nuevo recordatorio
              </h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fecha y hora *
                  </label>
                  <input
                    type="datetime-local"
                    value={newRecordatorio.fechaHora}
                    onChange={(e) => setNewRecordatorio({ ...newRecordatorio, fechaHora: e.target.value })}
                    className="input-field w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ID de tratamiento
                  </label>
                  <input
                    type="text"
                    value={newRecordatorio.tratamientoId}
                    onChange={(e) => setNewRecordatorio({ ...newRecordatorio, tratamientoId: e.target.value })}
                    className="input-field w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue"
                    placeholder="Ej: tratamiento-uuid"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo
                  </label>
                  <select
                    value={newRecordatorio.tipo}
                    onChange={(e) => setNewRecordatorio({ ...newRecordatorio, tipo: e.target.value })}
                    className="input-field w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue bg-white dark:bg-gray-800"
                  >
                    <option value="medicamento">Medicamento</option>
                    <option value="reposicion">Reposición</option>
                    <option value="cita">Cita médica</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <Button variant="ghost" type="button" onClick={() => setShowAddForm(false)} disabled={creating}>
                    Cancelar
                  </Button>
                  <Button type="submit" isLoading={creating} disabled={creating}>
                    {creating ? 'Guardando...' : 'Guardar recordatorio'}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </div>
      <Modal
        open={dialog !== null}
        onClose={() => setDialog(null)}
        title={dialog?.title ?? ''}
        message={dialog?.message}
        variant={dialog?.variant ?? 'info'}
      />
    </Layout>
  );
}
