import Link from 'next/link';
import Logo from '@/components/brand/Logo';

const columns = [
  {
    title: 'Producto',
    links: [
      { href: '/farmacheck', label: 'FarmaCheck' },
      { href: '/farmatrack/dashboard', label: 'FarmaTrack' },
      { href: '/farmacheck/glosario', label: 'Glosario farmacológico' },
    ],
  },
  {
    title: 'Cuenta',
    links: [
      { href: '/auth/register', label: 'Crear cuenta' },
      { href: '/auth/login', label: 'Iniciar sesión' },
      { href: '/auth/recover', label: 'Recuperar contraseña' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-bhemed-petroleum-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10">
          <div>
            <Logo variant="on-dark" href="/" />
            <p className="mt-4 text-sm leading-relaxed text-white/70 max-w-xs">
              Educación farmacéutica y seguimiento de tratamientos, con información verificada
              y recordatorios que se adaptan a tu día.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-white/15 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} BHEMED. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/60 max-w-md">
            La información de BHEMED es educativa y no sustituye la consulta, el diagnóstico
            ni el tratamiento de un profesional de la salud.
          </p>
        </div>
      </div>
    </footer>
  );
}
