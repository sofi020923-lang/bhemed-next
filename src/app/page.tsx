import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PublicNav from '@/components/layout/PublicNav';
import Footer from '@/components/layout/Footer';
import OrbitArt from '@/components/brand/OrbitArt';
import { VerifyArt, ScheduleArt, ShieldArt } from '@/components/brand/Illustrations';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNav />

      {/* ============ Hero ============ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-bhemed-ice-blue via-bhemed-ice-blue/60 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        <div className="dot-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-24 lg:pt-20 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-8 items-center">
            {/* Copy */}
            <div className="max-w-xl">
              <h1 className="text-[2.6rem] leading-[1.05] sm:text-6xl xl:text-[4.2rem] font-extrabold tracking-tight text-bhemed-petroleum-blue dark:text-white">
                Conoce tus medicamentos.
                <span className="block text-bhemed-ocean-blue">Toma el control.</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                BHEMED reúne información farmacológica verificada y el seguimiento de tu
                tratamiento en un solo lugar: consulta, organiza y no olvides ninguna dosis.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row gap-3.5">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-bhemed-ocean-blue px-7 py-3.5 text-base font-semibold text-white shadow-lift hover:bg-bhemed-petroleum-blue hover:-translate-y-0.5 transition-all duration-300 ease-out-expo focus:outline-none focus-visible:ring-2 focus-visible:ring-bhemed-ocean-blue focus-visible:ring-offset-2"
                >
                  Crear cuenta gratis
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/farmacheck"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white dark:bg-gray-800 px-7 py-3.5 text-base font-semibold text-bhemed-petroleum-blue dark:text-bhemed-ice-blue border border-bhemed-ice-blue dark:border-gray-700 shadow-soft hover:border-bhemed-ocean-blue hover:-translate-y-0.5 transition-all duration-300 ease-out-expo focus:outline-none focus-visible:ring-2 focus-visible:ring-bhemed-ocean-blue focus-visible:ring-offset-2"
                >
                  Explorar FarmaCheck
                </Link>
              </div>
              {/* Señales de confianza reales */}
              <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-bhemed-ocean-blue/15 dark:border-gray-700 pt-7">
                {[
                  ['Fuentes oficiales', 'cada ficha citada'],
                  ['Recordatorios 24/7', 'horarios y dosis'],
                  ['Tus datos', 'siempre privados'],
                ].map(([title, sub]) => (
                  <div key={title}>
                    <dt className="text-sm font-bold text-bhemed-petroleum-blue dark:text-bhemed-ice-blue">
                      {title}
                    </dt>
                    <dd className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Arte orbital */}
            <div className="relative lg:pl-6">
              <OrbitArt />
            </div>
          </div>
        </div>
      </section>

      {/* ============ Features ============ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-bhemed-petroleum-blue dark:text-white">
              Tres pilares, un cuidado completo
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Consultar, organizar y recordar: cada parte de BHEMED existe para que tu
              tratamiento funcione en la vida real.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="Información verificada"
              description="Fichas de medicamentos con datos respaldados por fuentes bibliográficas oficiales, en un lenguaje que sí entiendes."
              art={<VerifyArt className="w-full h-44" />}
            />
            <FeatureCard
              title="Tratamientos organizados"
              description="Registra medicamentos, configura horarios y consulta el historial completo de tus dosis."
              art={<ScheduleArt className="w-full h-44" />}
              delay
            />
            <FeatureCard
              title="Seguro y privado"
              description="Autenticación gestionada con sesiones cifradas y tus fotografías guardadas en almacenamiento privado."
              art={<ShieldArt className="w-full h-44" />}
            />
          </div>
        </div>
      </section>

      {/* ============ Seguridad (banda petroleum) ============ */}
      <section className="bg-bhemed-petroleum-blue dark:bg-gray-950 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Tu salud es información sensible. La tratamos así.
            </h2>
            <p className="mt-4 text-white/75 leading-relaxed">
              Las sesiones se gestionan con autenticación cifrada de extremo a extremo y las
              fotografías de tus medicamentos se almacenan en buckets privados con acceso
              controlado. Nunca compartimos tus datos.
            </p>
            <ul className="mt-8 space-y-3.5">
              {[
                'Sesiones cifradas con cookies seguras',
                'Contraseñas nunca almacenadas en la aplicación',
                'Fotografías en almacenamiento de acceso privado',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/85">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
                    <circle cx="10" cy="10" r="9" stroke="#7FBFDF" strokeWidth="1.6" />
                    <path d="M6 10.2l2.6 2.6L14 7.5" stroke="#7FBFDF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative max-w-md w-full mx-auto aspect-square opacity-95">
            <ShieldArt className="w-full h-full" />
          </div>
        </div>
      </section>

      {/* ============ CTA final ============ */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-bhemed-ice-blue dark:from-gray-900 dark:to-gray-800">
        <div className="dot-grid absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-bhemed-petroleum-blue dark:text-white">
            Empieza hoy, no olvides la próxima dosis
          </h2>
          <p className="mt-5 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Crear tu cuenta toma menos de un minuto. Después, BHEMED hace el resto.
          </p>
          <Link
            href="/auth/register"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-bhemed-ocean-blue px-9 py-4 text-lg font-semibold text-white shadow-lift hover:bg-bhemed-petroleum-blue hover:-translate-y-0.5 transition-all duration-300 ease-out-expo focus:outline-none focus-visible:ring-2 focus-visible:ring-bhemed-ocean-blue focus-visible:ring-offset-2"
          >
            Crear mi cuenta
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({
  title,
  description,
  art,
  delay = false,
}: {
  title: string;
  description: string;
  art: React.ReactNode;
  delay?: boolean;
}) {
  return (
    <article className="group relative flex flex-col rounded-3xl border border-bhemed-ice-blue dark:border-gray-700 bg-white dark:bg-gray-800 p-7 shadow-soft hover:shadow-lift hover:-translate-y-1 transition-all duration-300 ease-out-expo">
      <div className="rounded-2xl bg-gradient-to-br from-bhemed-ice-blue to-white dark:from-gray-700/60 dark:to-gray-800 p-4 mb-6 border border-bhemed-ice-blue/60 dark:border-gray-700">
        {art}
      </div>
      <h3 className="text-lg font-bold text-bhemed-petroleum-blue dark:text-white">{title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {description}
      </p>
      <span
        aria-hidden="true"
        className={`absolute top-0 left-7 right-7 h-0.5 rounded-b bg-bhemed-ocean-blue origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out-expo ${
          delay ? 'delay-75' : ''
        }`}
      />
    </article>
  );
}
