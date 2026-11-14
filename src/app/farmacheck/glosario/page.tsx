'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Search, Tag, X, Plus, Trash2, Database } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/store/AuthContext';

type GlosarioItem = {
  id: string;
  termino: string;
  definicion: string;
  categoria?: string;
};

export default function GlosarioPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [terminos, setTerminos] = useState<GlosarioItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('todas');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTermino, setNewTermino] = useState({ termino: '', definicion: '', categoria: 'concepto' });
  const [saving, setSaving] = useState(false);

  const userId = user?.id || '';

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, isLoading, router]);

  async function cargarTerminos() {
    setLoading(true);
    try {
      const res = await fetch('/api/glosario');
      const data = await res.json();
      if (data.success) setTerminos(data.data || []);
    } catch (err) {
      console.error('Error cargando glosario:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) cargarTerminos();
  }, [userId]);

  async function handleSeed() {
    await fetch('/api/seed');
    await cargarTerminos();
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/glosario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTermino),
      });
      const data = await res.json();
      if (data.success) {
        setTerminos((prev) => [...prev, data.data]);
        setNewTermino({ termino: '', definicion: '', categoria: 'concepto' });
        setShowAddForm(false);
      } else {
        alert(data.error || 'Error al crear término');
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('¿Eliminar este término del glosario?')) return;
    await fetch('/api/glosario', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setTerminos((prev) => prev.filter((t) => t.id !== id));
  }

  const filtered = terminos.filter((t) => {
    const matchSearch =
      !searchTerm ||
      t.termino.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.definicion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategoria === 'todas' || t.categoria === selectedCategoria;
    return matchSearch && matchCat;
  });

  const categorias = Array.from(new Set(terminos.map((t) => t.categoria).filter(Boolean)));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhemed-ocean-blue"></div>
      </div>
    );
  }

  return (
    <Layout title="Glosario Farmacológico">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-bhemed-ocean-blue to-bhemed-petroleum-blue rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Glosario Farmacológico</h1>
            </div>
            <p className="text-bhemed-ice-blue">
              Consulta términos técnicos de farmacología en lenguaje comprensible.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              leftIcon={<Database className="w-4 h-4" />}
              onClick={handleSeed}
            >
              Cargar datos
            </Button>
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setShowAddForm(true)}
            >
              Nuevo término
            </Button>
          </div>
        </motion.div>

        <Card>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar término..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategoria('todas')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategoria === 'todas'
                    ? 'bg-bhemed-ocean-blue text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Todas
              </button>
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoria(cat || '')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategoria === cat
                      ? 'bg-bhemed-ocean-blue text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-bhemed-ocean-blue mx-auto"></div>
              <p className="text-sm text-gray-500 mt-3">Cargando glosario...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron términos que coincidan con tu búsqueda.
              </p>
              {terminos.length === 0 && (
                <p className="text-sm text-gray-400 mt-2">
                  Usa el botón "Cargar datos" para insertar términos de ejemplo.
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map((termino, index) => (
                <motion.div
                  key={termino.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-bhemed-ocean-blue transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{termino.termino}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{termino.definicion}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {termino.categoria && (
                        <span className="shrink-0 inline-flex items-center gap-1 text-xs bg-bhemed-ice-blue dark:bg-bhemed-petroleum-blue/30 text-bhemed-ocean-blue dark:text-bhemed-ice-blue px-2 py-1 rounded">
                          <Tag className="w-3 h-3" />
                          {termino.categoria}
                        </span>
                      )}
                      <button
                        onClick={() => handleDelete(termino.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Eliminar término"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-bhemed-ocean-blue" /> Nuevo término
              </h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Término *
                  </label>
                  <input
                    type="text"
                    value={newTermino.termino}
                    onChange={(e) => setNewTermino({ ...newTermino, termino: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Definición *
                  </label>
                  <textarea
                    value={newTermino.definicion}
                    onChange={(e) => setNewTermino({ ...newTermino, definicion: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={newTermino.categoria}
                    onChange={(e) => setNewTermino({ ...newTermino, categoria: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bhemed-ocean-blue bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="concepto">Concepto</option>
                    <option value="efecto">Efecto</option>
                    <option value="proceso">Proceso</option>
                    <option value="precaucion">Precaución</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" type="button" onClick={() => setShowAddForm(false)} disabled={saving}>
                    Cancelar
                  </Button>
                  <Button type="submit" isLoading={saving} disabled={saving}>
                    Guardar término
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>Este glosario es de carácter educativo. Para consultas específicas, consulte con un profesional de la salud.</p>
        </div>
      </div>
    </Layout>
  );
}
