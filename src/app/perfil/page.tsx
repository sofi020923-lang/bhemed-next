'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Calendar,
  AlertCircle,
  Save,
  Upload,
  Image,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/store/AuthContext';

type Configuracion = {
  id: string;
  userId: string;
  tema?: string;
  idioma?: string;
  notificacionesPush?: boolean;
  notificacionesEmail?: boolean;
  recordatoriosSonidos?: boolean;
  zonaHoraria?: string;
};

export default function PerfilPage() {
  const { user, isAuthenticated, isLoading, setUser } = useAuth();
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [saving, setSaving] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [configuracion, setConfiguracion] = useState<Configuracion | null>(null);
  const [notificacionesPush, setNotificacionesPush] = useState(true);
  const [notificacionesEmail, setNotificacionesEmail] = useState(true);
  const [recordatoriosSonidos, setRecordatoriosSonidos] = useState(true);
  const [zonaHoraria, setZonaHoraria] = useState('America/Mexico_City');

  const userId = user?.id || '';

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (userId) {
      fetch(`/api/perfil?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data?.user) {
            const u = data.data.user;
            setNombre(u.nombre || '');
            setApellido(u.apellido || '');
            setTelefono(u.telefono || '');
            setFechaNacimiento(u.fechaNacimiento || '');
            if (data.data?.configuracion) {
              setConfiguracion(data.data.configuracion);
              setNotificacionesPush(data.data.configuracion.notificacionesPush ?? true);
              setNotificacionesEmail(data.data.configuracion.notificacionesEmail ?? true);
              setRecordatoriosSonidos(data.data.configuracion.recordatoriosSonidos ?? true);
              setZonaHoraria(data.data.configuracion.zonaHoraria || 'America/Mexico_City');
            }
          }
        })
        .catch(() => {
          setError('Error al cargar perfil');
        });
    }
  }, [userId, isAuthenticated, isLoading]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMensaje(null);
    setError(null);
    try {
      const res = await fetch('/api/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          nombre,
          apellido,
          telefono: telefono || undefined,
          fechaNacimiento: fechaNacimiento || undefined,
          configuracion: {
            tema: configuracion?.tema,
            idioma: configuracion?.idioma,
            notificacionesPush,
            notificacionesEmail,
            recordatoriosSonidos,
            zonaHoraria,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMensaje('Perfil actualizado correctamente');
        // Actualizar usuario en store local
        setUser({
          id: userId,
          email: user?.email || '',
          nombre: nombre || user?.nombre || '',
          apellido: apellido || user?.apellido || '',
          telefono: telefono,
          fechaNacimiento: fechaNacimiento,
          fotoPerfil: user?.fotoPerfil,
          role: user?.role,
          activo: user?.activo,
          createdAt: user?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as any);
      } else {
        setError(data.error || 'Error al actualizar perfil');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhemed-ocean-blue"></div>
      </div>
    );
  }

  return (
    <Layout title="Mi Perfil">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row gap-6 items-center"
        >
          <div className="w-24 h-24 rounded-full bg-bhemed-ocean-blue flex items-center justify-center text-white flex-shrink-0">
            <User className="w-12 h-12" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.nombre} {user?.apellido}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Rol: {user?.role} | Miembro desde {new Date(user?.createdAt || Date.now()).toLocaleDateString('es-ES')}
            </p>
          </div>
        </motion.div>

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-bhemed-ocean-blue" />
                Información personal
              </h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="input-field w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellido *</label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="input-field w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="input-field w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue"
                    placeholder="Ej: +52 55 1234 5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de nacimiento</label>
                  <input
                    type="date"
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    className="input-field w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue"
                  />
                </div>
                <Button type="submit" isLoading={saving} disabled={saving} fullWidth>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
                {mensaje && <p className="text-sm text-green-600 dark:text-green-400">{mensaje}</p>}
                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              </form>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-bhemed-ocean-blue" />
                Notificaciones
              </h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <span>Recordatorios de medicamentos</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-bhemed-ocean-blue rounded"
                    checked={notificacionesPush}
                    onChange={(e) => setNotificacionesPush(e.target.checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <span>Alertas de reposición</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-bhemed-ocean-blue rounded"
                    checked={notificacionesPush}
                    onChange={(e) => setNotificacionesPush(e.target.checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <span>Correos electrónicos</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-bhemed-ocean-blue rounded"
                    checked={notificacionesEmail}
                    onChange={(e) => setNotificacionesEmail(e.target.checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <span>Recordatorios sonoros</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-bhemed-ocean-blue rounded"
                    checked={recordatoriosSonidos}
                    onChange={(e) => setRecordatoriosSonidos(e.target.checked)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zona horaria</label>
                  <select
                    value={zonaHoraria}
                    onChange={(e) => setZonaHoraria(e.target.value)}
                    className="input-field w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue bg-white dark:bg-gray-800"
                  >
                    <option value="America/Mexico_City">America/Mexico_City (Ciudad de México)</option>
                    <option value="America/Mexico_City">America/Mexico_City (UTC-6)</option>
                    <option value="America/Mexico_City">America/Mexico_City (UTC-6)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 flex flex-col">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-bhemed-ocean-blue" />
                Seguridad
              </h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <Button variant="ghost" onClick={() => {}} className="w-full text-left">
                  Cambiar contraseña
                </Button>
                <Button variant="outline" className="w-full text-left border-0 bg-transparent">
                  Verificar dos pasos
                </Button>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-6 border border-red-100 dark:border-red-900/50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-300 mb-1">Eliminar cuenta</h3>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Esta acción es irreversible y eliminará todos tus datos personales.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="danger" onClick={() => {}} className="text-sm">
                  Eliminar cuenta y datos
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
