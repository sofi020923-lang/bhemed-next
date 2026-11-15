'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Shield,
  Plus,
  Calendar,
  UserPlus,
  User,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal, { type ModalVariant } from '@/components/ui/Modal';
import { useAuth } from '@/store/AuthContext';

type DependienteItem = {
  id: string;
  nombreDependiente: string;
  relacion: string;
  fechaNacimiento?: string;
  notasMedicas?: string;
  permisos?: string;
  activo: boolean;
  userId: string;
};

export default function DependientesPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [dependientes, setDependientes] = useState<DependienteItem[]>([]);
  const [dialog, setDialog] = useState<{ title: string; message?: string; variant: ModalVariant } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDependiente, setNewDependiente] = useState({
    nombreDependiente: '',
    relacion: '',
    fechaNacimiento: '',
    notasMedicas: '',
    permisos: '',
    activo: true,
  });

  const userId = user?.id || '';

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (userId) {
      fetch(`/api/dependientes?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setDependientes(data.data || []);
        });
    }
  }, [userId, isAuthenticated, isLoading, router]);

  async function handleAddDependiente() {
    const res = await fetch('/api/dependientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId,
        nombreDependiente: newDependiente.nombreDependiente,
        relacion: newDependiente.relacion,
        fechaNacimiento: newDependiente.fechaNacimiento,
        notasMedicas: newDependiente.notasMedicas,
        permisos: newDependiente.permisos,
        activo: newDependiente.activo,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setDependientes((prev) => [...prev, data.data]);
      setShowAddForm(false);
      setNewDependiente({
        nombreDependiente: '',
        relacion: '',
        fechaNacimiento: '',
        notasMedicas: '',
        permisos: '',
        activo: true,
      });
    } else {
      setDialog({
        title: 'No se pudo crear el dependiente',
        message: data.error || 'Ocurrió un error al crear el perfil de dependiente.',
        variant: 'error',
      });
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
    <Layout title="Dependientes">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dependientes</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {dependientes.length} dependientes registrados
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Añadir dependiente
          </Button>
        </motion.div>

        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Dependientes</h3>
          {dependientes.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Sin dependientes</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No tienes dependientes registrados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dependientes.map((d, index) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-bhemed-ocean-blue/10 dark:bg-bhemed-petroleum-blue/20 flex items-center justify-center">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{d.nombreDependiente}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            <strong>Relación:</strong> {d.relacion}
                          </p>
                          {d.fechaNacimiento && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              <span>Fecha de nacimiento:</span> {new Date(d.fechaNacimiento).toLocaleDateString('es-ES')}
                            </p>
                          )}
                          {d.permisos && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              <span>Permisos:</span> {d.permisos}
                            </p>
                          )}
                          <div className="mt-2">
                            <span className="text-sm font-medium text-gray-600">
                              {d.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
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