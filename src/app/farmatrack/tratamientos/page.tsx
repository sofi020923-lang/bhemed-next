'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Shield,
  Calendar,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal, { type ModalVariant } from '@/components/ui/Modal';
import { useAuth } from '@/store/AuthContext';

type TratamientoItem = {
  id: string;
  nombreTratamiento: string;
  medicamento?: string;
  medicamentoPersonalId?: string;
  fechaInicio: string;
  fechaFin?: string | null;
  dosis: string;
  frecuencia: string;
  horarios: string[];
  instrucciones?: string | null;
  estado: string;
  notas?: string | null;
  userId: string;
};

type FormData = {
  nombreTratamiento: string;
  medicamentoPersonalId: string;
  fechaInicio: string;
  fechaFin?: string | null;
  dosis: string;
  frecuencia: string;
  horarios: string;
  instrucciones?: string | null;
  estado: string;
  notas?: string | null;
};

export default function TratamientosPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const userId = user?.id || '';

  const [tratamientos, setTratamientos] = useState<TratamientoItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editing, setEditing] = useState<TratamientoItem | null>(null);
  const [form, setForm] = useState<FormData>({
    nombreTratamiento: '',
    medicamentoPersonalId: '',
    fechaInicio: '',
    fechaFin: null,
    dosis: '',
    frecuencia: '',
    horarios: '',
    instrucciones: '',
    estado: 'activo',
    notas: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeEditId, setActiveEditId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<{ title: string; message?: string; variant: ModalVariant } | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (user?.id) {
      loadTratamientos();
    }
  }, [isAuthenticated, isLoading, user?.id, router]);

  async function loadTratamientos() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tratamientos?userId=${userId}`);
      const data = await res.json();
      if (data.success) setTratamientos(data.data || []);
      else setError(data.error || 'Error cargando tratamientos');
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const horarios = form.horarios
        .split(',')
        .map((h) => h.trim())
        .filter(Boolean);

      let res: Response;
      if (editing) {
        res = await fetch('/api/tratamientos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editing.id,
            ...form,
            horarios,
            medicamentoPersonalId: form.medicamentoPersonalId || undefined,
            fechaFin: form.fechaFin || undefined,
            instrucciones: form.instrucciones || undefined,
            notas: form.notas || undefined,
          }),
        });
      } else {
        res = await fetch('/api/tratamientos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            userId,
            horarios,
            medicamentoPersonalId: form.medicamentoPersonalId || undefined,
            fechaFin: form.fechaFin || undefined,
            instrucciones: form.instrucciones || undefined,
            notas: form.notas || undefined,
          }),
        });
      }

      const data = await res.json();
      if (data.success) {
        await loadTratamientos();
        setForm({
          nombreTratamiento: '',
          medicamentoPersonalId: '',
          fechaInicio: '',
          fechaFin: null,
          dosis: '',
          frecuencia: '',
          horarios: '',
          instrucciones: '',
          estado: 'activo',
          notas: '',
        });
        setEditing(null);
        setShowAddForm(false);
      } else {
        setError(data.error || 'Error al guardar tratamiento');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleEstado(id: string, nuevoEstado: string) {
    setSaving(true);
    try {
      const res = await fetch('/api/tratamientos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, estado: nuevoEstado }),
      });
      const data = await res.json();
      if (data.success) await loadTratamientos();
      else
        setDialog({
          title: 'No se pudo actualizar el estado',
          message: data.error || 'Ocurrió un error al actualizar el tratamiento.',
          variant: 'error',
        });
    } catch {
      setDialog({
        title: 'Error de conexión',
        message: 'No pudimos conectar con el servidor. Intenta de nuevo.',
        variant: 'error',
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('¿Eliminar este tratamiento? Esta acción no se puede deshacer.')) return;
    setSaving(true);
    try {
      const res = await fetch('/api/tratamientos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) await loadTratamientos();
      else
        setDialog({
          title: 'No se pudo eliminar',
          message: data.error || 'Ocurrió un error al eliminar el tratamiento.',
          variant: 'error',
        });
    } catch {
      setDialog({
        title: 'Error de conexión',
        message: 'No pudimos conectar con el servidor. Intenta de nuevo.',
        variant: 'error',
      });
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setEditing(null);
    setForm({
      nombreTratamiento: '',
      medicamentoPersonalId: '',
      fechaInicio: '',
      fechaFin: null,
      dosis: '',
      frecuencia: '',
      horarios: '',
      instrucciones: '',
      estado: 'activo',
      notas: '',
    });
  }

  const activeCount = tratamientos.filter((t) => t.estado === 'activo').length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhemed-ocean-blue"></div>
      </div>
    );
  }

  return (
    <Layout title="Mis Tratamientos">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Tratamientos</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {activeCount} tratamientos activos de {tratamientos.length} totales
            </p>
          </div>
          <Button onClick={() => { resetForm(); setShowAddForm(true); }} leftIcon={<Plus className="w-4 h-4" />}>
            {editing ? 'Nuevo tratamiento' : 'Agregar tratamiento'}
          </Button>
        </motion.div>

        {error && (
          <Card className="p-4 border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/30">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-bhemed-ocean-blue mx-auto mb-4"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Cargando tratamientos...</p>
          </div>
        ) : tratamientos.length === 0 ? (
          <Card className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No hay tratamientos</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Aún no has creado ningún tratamiento.</p>
            <Button onClick={() => { resetForm(); setShowAddForm(true); }} leftIcon={<Plus className="w-4 h-4" />}>
              Agregar tratamiento
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tratamientos.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full border-gray-100 dark:border-gray-700">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-bhemed-ocean-blue/10 dark:bg-bhemed-petroleum-blue/20 flex items-center justify-center text-bhemed-ocean-blue">
                        <Shield className="w-5 h-5" />
                      </div>
                      <span
                        className={`inline-block text-xs font-semibold px-2 py-1 rounded ${
                          t.estado === 'activo'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}
                      >
                        {t.estado === 'activo' ? 'Activo' : t.estado.charAt(0).toUpperCase() + t.estado.slice(1)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t.nombreTratamiento}</h3>
                    {t.medicamento && <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{t.medicamento}</p>}
                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>Inicio: {new Date(t.fechaInicio).toLocaleDateString('es-ES')}</span>
                      </div>
                      {t.fechaFin && (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>Fin: {new Date(t.fechaFin).toLocaleDateString('es-ES')}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span>{t.dosis}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">Horarios:</span>
                        <span className="ml-2 break-all">{t.horarios.join(', ')}</span>
                      </div>
                    </div>
                    {t.instrucciones && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                        {t.instrucciones}
                      </div>
                    )}
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={saving}
                        onClick={() => handleToggleEstado(t.id, t.estado === 'activo' ? 'inactivo' : 'activo')}
                      >
                        {t.estado === 'activo' ? 'Desactivar' : 'Activar'}
                      </Button>
                      <Button variant="ghost" size="sm" leftIcon={<Edit className="w-3 h-3" />} onClick={() => setEditing(t)} disabled={saving} />
                      <Button variant="danger" size="sm" leftIcon={<Trash2 className="w-3 h-3" />} onClick={() => handleDelete(t.id)} disabled={saving} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add/edit form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-bhemed-ocean-blue" />
                {editing ? 'Editar tratamiento' : 'Nuevo tratamiento'}
              </h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre del tratamiento *
                  </label>
                  <input
                    type="text"
                    value={form.nombreTratamiento}
                    onChange={(e) => setForm({ ...form, nombreTratamiento: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Medicamento personal (ID)
                  </label>
                  <input
                    type="text"
                    value={form.medicamentoPersonalId}
                    onChange={(e) => setForm({ ...form, medicamentoPersonalId: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Ej: med-uuid"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Fecha de inicio *
                    </label>
                    <input
                      type="date"
                      value={form.fechaInicio}
                      onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Fecha de fin
                    </label>
                    <input
                      type="date"
                      value={form.fechaFin || ''}
                      onChange={(e) => setForm({ ...form, fechaFin: e.target.value || null })}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dosis *
                    </label>
                    <input
                      type="text"
                      value={form.dosis}
                      onChange={(e) => setForm({ ...form, dosis: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                      placeholder="Ej: 1 tableta"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Frecuencia *
                    </label>
                    <input
                      type="text"
                      value={form.frecuencia}
                      onChange={(e) => setForm({ ...form, frecuencia: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                      placeholder="Ej: cada 8 horas"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Horarios *
                  </label>
                  <input
                    type="text"
                    value={form.horarios}
                    onChange={(e) => setForm({ ...form, horarios: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                    placeholder="Ej: 08:00, 14:00, 20:00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Instrucciones
                  </label>
                  <textarea
                    value={form.instrucciones || ''}
                    onChange={(e) => setForm({ ...form, instrucciones: e.target.value || null })}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Ej: Tomar con comida"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notas adicionales
                  </label>
                  <textarea
                    value={form.notas || ''}
                    onChange={(e) => setForm({ ...form, notas: e.target.value || null })}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Notas..."
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAddForm(false)}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" isLoading={saving} disabled={saving}>
                    {saving ? 'Guardando...' : editing ? 'Actualizar tratamiento' : 'Guardar tratamiento'}
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
