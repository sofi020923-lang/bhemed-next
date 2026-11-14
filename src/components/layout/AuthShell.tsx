'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Logo from '@/components/brand/Logo';
import OrbitArt from '@/components/brand/OrbitArt';

interface AuthShellProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Pantalla de autenticación: panel de marca con el sistema orbital BHEMED
 * a la izquierda (desktop) y la tarjeta de formulario a la derecha.
 */
export default function AuthShell({ title, subtitle, icon, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1.05fr_1fr] bg-white dark:bg-gray-900">
      {/* Panel de marca */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-bhemed-petroleum-blue px-12 py-10">
        <div className="dot-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <div
          className="absolute -right-32 -top-32 w-[480px] h-[480px] rounded-full bg-bhemed-ocean-blue/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative">
          <Logo variant="on-dark" href="/" />
        </div>
        <div className="relative self-center w-full max-w-[440px] -my-6">
          <OrbitArt />
        </div>
        <div className="relative">
          <p className="text-xl font-semibold text-white leading-snug max-w-sm">
            Información que confías,
            <br />
            tratamiento que se cumple.
          </p>
          <p className="mt-3 text-sm text-white/60 max-w-sm leading-relaxed">
            Consulta fichas verificadas en FarmaCheck y deja que FarmaTrack te recuerde
            cada dosis.
          </p>
        </div>
      </aside>

      {/* Formulario */}
      <main className="relative flex flex-col items-center justify-center px-4 py-10 sm:px-8 bg-gradient-to-b from-bhemed-ice-blue/70 to-white dark:from-gray-900 dark:to-gray-900 min-h-screen lg:min-h-0">
        <div className="dot-grid absolute inset-0 opacity-50 dark:opacity-30" aria-hidden="true" />
        <div className="lg:hidden relative mb-8">
          <Logo href="/" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.15 }}
              className="mx-auto h-14 w-14 bg-bhemed-ocean-blue rounded-2xl shadow-lift flex items-center justify-center text-white"
            >
              {icon}
            </motion.div>
            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-bhemed-petroleum-blue dark:text-white">
              {title}
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {subtitle}
            </p>
          </div>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">{footer}</div>}
          <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
            <Link href="/" className="hover:text-bhemed-ocean-blue transition-colors">
              Volver al inicio
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
