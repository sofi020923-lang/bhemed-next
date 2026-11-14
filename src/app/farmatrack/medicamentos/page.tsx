'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Pill,
  Plus,
  Camera,
  Trash2,
  Edit,
  Search,
  Filter,
  Heart,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/store/AuthContext';

type MedicamentoPersonalItem = {
  id: string;
  nombre: string;
  principioActivo: string;
  concentracion: string;
  formaFarmaceutica: string;
  fotoUrl: string | null;
  color: string;
  notas: string;
};

export default function MedicamentosPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Estado local solo para el formulario nuevo (no persistente aún)
  const [newMed, setNewMed] = useState<Omit<MedicamentoPersonalItem, 'id'>>({
    nombre: '',
    principioActivo: '',
    concentracion: '',
    formaFarmaceutica: '',
    color: '#3688B8',
    notas: '',
    fotoUrl: null as string | null,
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // --- Lista de medicamentos desde la API ---
  const [medicamentos, setMedicamentos] = useState<MedicamentoPersonalItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!isLoading && userId) {
      fetch(`/api/medicamentos-personales?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setMedicamentos(data.data || []);
          }
        })
        .catch((err) => {
          console.error('Error cargando medicamentos:', err);
        });
    }
  }, [isLoading, userId]);

  // --- Subir foto ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setNewMed({ ...newMed, fotoUrl: '' }); // placeholder mientras sube
      // Subir a Neon Storage
      const fd = new FormData();
      fd.append('file', file);
      fetch('/api/upload-photo', { method: 'POST', body: fd })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setNewMed({ ...newMed, fotoUrl: data.url });
            setUploadError(null);
          } else {
            setUploadError(data.error || 'Error al subir la foto');
            // Volver al placeholder o quitar foto
            setNewMed({ ...newMed, fotoUrl: null });
          }
        })
        .catch((err) => {
          console.error('Error en upload:', err);
          setUploadError('Error de conexión al subir');
          setNewMed({ ...newMed, fotoUrl: null });
        });
    } else {
      setNewMed({ ...newMed, fotoUrl: null });
    }
  };

  const handleAdd = async () => {
    if (!newMed.nombre.trim()) return;
    setUploading(true);
    setUploadError(null);
    try {
      // Ya tenemos fotoUrl lista (subida en handleFileChange o vacío si no hay archivo)
      const med: MedicamentoPersonalItem = {
        id: Date.now().toString(),
        ...newMed,
        fotoUrl: newMed.fotoUrl || null,
      };
      // Persistir en BD
      await fetch('/api/medicamentos-personales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          ...med,
        }),
      });
      // Actualizar UI local
      setMedicamentos([...medicamentos, med]);
      // Resetear formulario
      setNewMed({
        nombre: '',
        principioActivo: '',
        concentracion: '',
        formaFarmaceutica: '',
        color: '#3688B8',
        notas: '',
        fotoUrl: null as string | null,
      });
      if (uploadError) setUploadError(null);
      setShowAddForm(false);
    } catch (err: any) {
      setUploadError(err.message || 'Error al guardar el medicamento');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Primero borrar foto de Neon si existe
    const med = medicamentos.find((m) => m.id === id);
    const fotoKey = med?.fotoUrl ? med.fotoUrl.replace(/.*\/(.+)$/, '$1') : null; // extraer key de URL
    if (fotoKey) {
      await fetch(`/api/upload-photo?key=${fotoKey}`, { method: 'DELETE' });
    }
    // Borrar de BD
    await fetch(`/api/medicamentos-personales?id=${id}`, { method: 'DELETE' });
    // Actualizar UI local
    setMedicamentos(medicamentos.filter((m) => m.id !== id));
  };

  const filtered = medicamentos.filter((m) =>
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.principioActivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Limpiar preview al cerrar
  useEffect(() => {
    return () => {
      if (uploadError) setUploadError(null);
    };
  }, [uploadError]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhemed-ocean-blue"></div>
      </div>
    );
  }

  return (
    <Layout title="Mis Medicamentos">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Medicamentos</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {medicamentos.length} medicamentos registrados
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Agregar medicamento
          </Button>
        </motion.div>

        {/* Search */}
        <Card>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar medicamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue"
            />
          </div>
        </Card>

        {/* Add form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-bhemed-ocean-blue" /> Nuevo medicamento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Nombre del medicamento *</label>
                  <input
                    type="text"
                    value={newMed.nombre}
                    onChange={(e) =>
                      setNewMed({ ...newMed, nombre: e.target.value })
                    }
                    className="input-field"
                    placeholder="Ej: Paracetamol 500mg"
                  />
                </div>
                <div>
                  <label className="label-field">Principio activo</label>
                  <input
                    type="text"
                    value={newMed.principioActivo}
                    onChange={(e) =>
                      setNewMed({ ...newMed, principioActivo: e.target.value })
                    }
                    className="input-field"
                    placeholder="Ej: Paracetamol"
                  />
                </div>
                <div>
                  <label className="label-field">Concentración</label>
                  <input
                    type="text"
                    value={newMed.concentracion}
                    onChange={(e) =>
                      setNewMed({ ...newMed, concentracion: e.target.value })
                    }
                    className="input-field"
                    placeholder="Ej: 500mg"
                  />
                </div>
                <div>
                  <label className="label-field">Forma farmacéutica</label>
                  <input
                    type="text"
                    value={newMed.formaFarmaceutica}
                    onChange={(e) =>
                      setNewMed({ ...newMed, formaFarmaceutica: e.target.value })
                    }
                    className="input-field"
                    placeholder="Ej: Tableta, Cápsula, Jarabe"
                  />
                </div>
                <div>
                  <label className="label-field">Color de la pastilla/cápsula</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={newMed.color}
                      onChange={(e) =>
                        setNewMed({ ...newMed, color: e.target.value })
                      }
                      className="h-10 w-16 rounded cursor-pointer"
                    />
                    <span className="text-xs text-gray-500">{newMed.color}</span>
                  </div>
                </div>
                <div>
                  <label className="label-field">Notas (opcional)</label>
                  <input
                    type="text"
                    value={newMed.notas}
                    onChange={(e) =>
                      setNewMed({ ...newMed, notas: e.target.value })
                    }
                    className="input-field"
                    placeholder="Ej: Para dolor de cabeza"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label-field">Fotografía del medicamento</label>
                  <div className="flex items-start gap-4">
                    <label
                      htmlFor="foto-input"
                      className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-700 cursor-pointer hover:border-bhemed-ocean-blue transition-colors shrink-0"
                    >
                      {newMed.fotoUrl ? (
                        <img
                          src={newMed.fotoUrl}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Camera className="w-8 h-8 text-gray-400" />
                      )}
                      <input
                        id="foto-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <p className="mb-1">Tomar foto o seleccionar de la galería</p>
                      <p className="text-xs">La fotografía es solo una referencia visual</p>
                      {uploadError && <p className="text-xs text-red-500 mt-2">{uploadError}</p>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={() => {
                  // Limpiar preview y estados
                  if (uploadError) setUploadError(null);
                  setShowAddForm(false);
                }}>Cancelar</Button>
                <Button onClick={handleAdd} leftIcon={<Plus className="w-4 h-4" />}>
                  {uploading ? 'Subiendo...' : 'Guardar'}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* List */}
        {filtered.length === 0 ? (
          <Card className="text-center py-12">
            <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No hay medicamentos</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm
                ? `No se encontraron resultados para "${searchTerm}"`
                : 'Aún no has agregado medicamentos a tu lista personal.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowAddForm(true)} leftIcon={<Plus className="w-4 h-4" />}>
                Agregar el primero
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((med, index) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${med.color}30` }}
                      >
                        {med.fotoUrl ? (
                          <img
                            src={med.fotoUrl}
                            alt={med.nombre}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: med.color }}
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {med.nombre}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {med.principioActivo} {med.concentracion} · {med.formaFarmaceutica}
                        </p>
                      </div>
                    </div>
                  </div>
                  {med.notas && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                      {med.notas}
                    </p>
                  )}
                  <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                      className="flex-1 flex items-center justify-center gap-1 text-sm text-bhemed-ocean-blue hover:bg-bhemed-ice-blue dark:hover:bg-bhemed-petroleum-blue/30 py-2 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" /> Editar
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-1 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 rounded-lg transition-colors"
                      onClick={() => handleDelete(med.id)}
                    >
                      <Trash2 className="w-4 h-4" /> Eliminar
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}