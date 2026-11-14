import Link from 'next/link';
import {
  Heart,
  Pill,
  Shield,
  Bell,
  User,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bhemed-ice-blue to-bhemed-ocean-blue/20 dark:from-gray-900 dark:to-gray-800">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="30" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'pulse 4s infinite ease-in-out' }} />
            <circle cx="70" cy="70" r="25" fill="none" stroke="currentColor" strokeWidth="1" style={{ animation: 'pulse 5s infinite ease-in-out' }} />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-gray-800/90 text-bhemed-ocean-blue text-sm font-medium shadow-soft mb-6">
            <Heart className="w-4 h-4" />
            BHEMED - Educación Farmacéutica
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
            Cuida tu salud,<br className="hidden md:block" />
            conoce tus medicamentos
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            BHEMED te ayuda a entender información farmacológica, organizar tus tratamientos
            y recordar tus medicamentos de forma segura y sencilla.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="px-8 py-4 bg-bhemed-ocean-blue text-white rounded-xl font-semibold text-lg hover:bg-bhemed-petroleum-blue transition-all shadow-lg flex items-center justify-center gap-2">
              <User className="w-5 h-5" />
              Crear cuenta gratis
            </Link>
            <Link href="/farmacheck" className="px-8 py-4 bg-white dark:bg-gray-800 text-bhemed-ocean-blue dark:text-bhemed-ocean-blue rounded-xl font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow flex items-center justify-center gap-2">
              <Pill className="w-5 h-5" />
              Explorar FarmaCheck
            </Link>
          </div>
        </div>

        {/* Animated feature icons */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-8 opacity-60 dark:opacity-40">
          <div className="text-center" style={{ animation: 'bounce 3s infinite' }}>
            <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center mx-auto mb-2 shadow-md">
              <Pill className="w-6 h-6 text-bhemed-ocean-blue" />
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Medicamentos</div>
          </div>
          <div className="text-center" style={{ animation: 'pulse 2s infinite' }}>
            <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center mx-auto mb-2 shadow-md">
              <Shield className="w-6 h-6 text-bhemed-ocean-blue" />
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Tratamientos</div>
          </div>
          <div className="text-center" style={{ animation: 'spin 4s linear infinite' }}>
            <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center mx-auto mb-2 shadow-md">
              <Bell className="w-6 h-6 text-bhemed-ocean-blue" />
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Recordatorios</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">¿Por qué BHEMED?</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Una aplicación completa para el cuidado farmacéutico personal, diseñada pensando en ti.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Pill className="w-8 h-8 text-bhemed-ocean-blue" />}
              title="Información verificada"
              description="Consulta datos farmacológicos respaldados por fuentes bibliográficas oficiales y actualizadas."
            />
            <FeatureCard
              icon={<CheckCircle2 className="w-8 h-8 text-bhemed-ocean-blue" />}
              title="Organiza tus tratamientos"
              description="Registra tus medicamentos, configura horarios y mantén un historial de tus dosis."
            />
            <FeatureCard
              icon={<ShieldAlert className="w-8 h-8 text-bhemed-ocean-blue" />}
              title="Seguro y privado"
              description="Tus datos de salud están protegidos con autenticación segura y almacenamiento local cifrado."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-bhemed-ocean-blue">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">¿Listo para empezar?</h2>
            <p className="text-white/80 mb-8">Únete a miles de usuarios que ya gestionan su salud con BHEMED.</p>
            <Link href="/auth/register" className="px-8 py-4 bg-white text-bhemed-ocean-blue rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl flex items-center justify-center gap-2 inline-block">
              <User className="w-5 h-5" />
              Crear mi cuenta
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center hover:border-bhemed-ocean-blue transition-colors">
      <div className="w-16 h-16 rounded-xl bg-bhemed-ice-blue dark:bg-bhemed-petroleum-blue/30 flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}