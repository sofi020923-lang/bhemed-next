'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, PackageOpen, Info, AlertCircle, X, CheckCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import { useAuth } from '@/store/AuthContext';
import { useNotificationStore } from '@/store/useNotificationStore';

type MedicamentoItem = {
  id: string;
  nombreComercial: string;
  nombreGenerico: string;
  principioActivo: string;
  concentracion?: string;
  formaFarmaceutica?: string;
  laboratorio?: string;
  indicaciones?: string;
  contraindicaciones?: string;
  reaccionesAdversas?: string;
  interacciones?: string;
  conservacion?: string;
  dosisComun?: string;
  viaAdministracion?: string;
  requiereReceta: boolean;
  descripcionLenguajeSencillo?: string;
  fuentesBibliograficas?: string;
  fechaActualizacion?: string;
};

function formatSources(fuentes?: string): string {
  if (!fuentes) return 'Sin fuentes';
  try {
    const parsed = JSON.parse(fuentes);
    if (Array.isArray(parsed)) return parsed.join(' · ');
    return String(parsed);
  } catch {
    return fuentes;
  }
}

export default function FarmaCheckPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { addNotification } = useNotificationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<MedicamentoItem[]>([]);
  const [selectedMedicamento, setSelectedMedicamento] = useState<MedicamentoItem | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setResults([]);
      setShowSearch(false);
      setSearchError(null);
      return;
    }
    setLoading(true);
    setSearchError(null);
    try {
      const res = await fetch(`/api/medicamentos?search=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.data || []);
      } else {
        setSearchError(data.error || 'Error de búsqueda');
        setResults([]);
      }
    } catch (err) {
      setSearchError('Error de conexión');
      setResults([]);
    } finally {
      setLoading(false);
      setShowSearch(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhemed-ocean-blue"></div>
      </div>
    );
  }

  return (
    <Layout title="FarmaCheck">
      <div className="space-y-6">
        {/* Hero search */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-bhemed-ocean-blue to-bhemed-petroleum-blue rounded-2xl p-8 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <motion.circle
                cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2"
                animate={{ r: [80, 100, 80], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.circle
                cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="1"
                animate={{ r: [50, 65, 50], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">FarmaCheck</h1>
          <p className="text-bhemed-ice-blue mb-6 max-w-xl">
            Busca y consulta información farmacológica verificada. Encuentra concentraciones, indicaciones, contraindicaciones y más.
          </p>
          <div className="flex gap-2 max-w-2xl">
            <input
              type="text"
              placeholder="Buscar por nombre, principio activo o concentración..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
              className="flex-1 px-5 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Buscar medicamento"
            />
            <button
              onClick={() => handleSearch(searchTerm)}
              className="px-6 py-3 bg-white text-bhemed-ocean-blue font-semibold rounded-xl hover:bg-bhemed-ice-blue transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Buscar
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Resultados ({results.length})
                </h2>
                <button onClick={() => { setResults([]); setSearchTerm(''); setShowSearch(false); }} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                  <X className="w-4 h-4" /> Limpiar
                </button>
              </div>
              {loading ? (
                <Card className="text-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-bhemed-ocean-blue mx-auto"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Buscando...</p>
                </Card>
              ) : searchError ? (
                <Card className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">{searchError}</p>
                </Card>
              ) : results.length === 0 ? (
                <Card className="text-center py-12">
                  <PackageOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No se encontraron resultados para "{searchTerm}"</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((med) => (
                    <Card
                      key={med.id}
                      className="cursor-pointer hover:border-bhemed-ocean-blue transition-all"
                      animated
                      onClick={() => setSelectedMedicamento(med)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-bhemed-ice-blue dark:bg-bhemed-petroleum-blue/30 flex items-center justify-center shrink-0">
                          <span className="text-lg font-bold text-bhemed-ocean-blue">{med.nombreComercial.charAt(0)}</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{med.nombreComercial}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{med.principioActivo} {med.concentracion}</p>
                          <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded ${med.requiereReceta ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {med.requiereReceta ? 'Requiere receta' : 'Sin receta'}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Medicamento detail modal */}
        <AnimatePresence>
          {selectedMedicamento && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setSelectedMedicamento(null)}
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 30 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedMedicamento.nombreComercial}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedMedicamento.nombreGenerico} · {selectedMedicamento.concentracion} · {selectedMedicamento.formaFarmaceutica}</p>
                    </div>
                    <button onClick={() => setSelectedMedicamento(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <DetailSection icon={<Info className="w-5 h-5 text-bhemed-ocean-blue" />} title="Descripción en lenguaje sencillo" content={selectedMedicamento.descripcionLenguajeSencillo} />
                    <DetailSection icon={<CheckCircle className="w-5 h-5 text-green-500" />} title="Indicaciones y usos" content={selectedMedicamento.indicaciones} />
                    <DetailSection icon={<AlertCircle className="w-5 h-5 text-red-500" />} title="Contraindicaciones" content={selectedMedicamento.contraindicaciones} />
                    <DetailSection icon={<AlertCircle className="w-5 h-5 text-yellow-500" />} title="Reacciones adversas" content={selectedMedicamento.reaccionesAdversas} />
                    <DetailSection icon={<AlertCircle className="w-5 h-5 text-orange-500" />} title="Interacciones" content={selectedMedicamento.interacciones} />
                    <DetailSection icon={<Info className="w-5 h-5 text-blue-500" />} title="Conservación" content={selectedMedicamento.conservacion} />
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <strong>Fuentes:</strong> {formatSources(selectedMedicamento.fuentesBibliograficas)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <strong>Actualizado:</strong> {selectedMedicamento.fechaActualizacion || 'Desconocido'}
                      </p>
                    </div>
                    <div className="p-4 bg-bhemed-ice-blue dark:bg-bhemed-petroleum-blue/30 rounded-lg">
                      <p className="text-xs text-bhemed-petroleum-blue dark:text-bhemed-ice-blue">
                        <strong>Aviso:</strong> Esta información es educativa y no sustituye la orientación de un profesional de la salud. Consulta siempre a tu médico o farmacéutico.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Quick access to glosario */}
        {!showSearch && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/farmacheck/glosario" className="card p-6 flex items-center gap-4 hover:border-bhemed-ocean-blue transition-all">
              <div className="w-14 h-14 bg-bhemed-ice-blue dark:bg-bhemed-petroleum-blue/30 rounded-xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-bhemed-ocean-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Glosario Farmacológico</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Consulta términos y definiciones</p>
              </div>
            </a>
            <div className="card p-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-bhemed-ice-blue dark:bg-bhemed-petroleum-blue/30 rounded-xl flex items-center justify-center">
                <Info className="w-7 h-7 text-bhemed-ocean-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Fuentes verificadas</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Información respaldada por organismos oficiales</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function DetailSection({ icon, title, content }: { icon: React.ReactNode; title: string; content?: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 ml-7">{content || 'No disponible'}</p>
    </div>
  );
}