'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/brand/Logo';

const links = [
  { href: '/farmacheck', label: 'FarmaCheck' },
  { href: '/farmatrack/dashboard', label: 'FarmaTrack' },
];

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ease-out-expo ${
        scrolled
          ? 'bg-white/85 dark:bg-gray-900/85 backdrop-blur-lg shadow-soft border-b border-bhemed-ice-blue dark:border-gray-800'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo />
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-bhemed-petroleum-blue dark:hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="hidden sm:inline-flex text-sm font-semibold text-bhemed-petroleum-blue dark:text-bhemed-ice-blue hover:text-bhemed-ocean-blue transition-colors px-3 py-2"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex items-center rounded-full bg-bhemed-ocean-blue px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-bhemed-petroleum-blue hover:shadow-lift transition-all duration-300 ease-out-expo focus:outline-none focus-visible:ring-2 focus-visible:ring-bhemed-ocean-blue focus-visible:ring-offset-2"
          >
            Crear cuenta
          </Link>
        </div>
      </nav>
    </header>
  );
}
