/**
 * Ilustraciones SVG animadas para secciones de la landing.
 * Trazos que se dibujan con stroke-dashoffset; respetan prefers-reduced-motion
 * mediante las utilidades .svg-draw / .svg-breathe de globals.css.
 */

interface ArtProps {
  className?: string;
}

export function VerifyArt({ className = '' }: ArtProps) {
  return (
    <svg viewBox="0 0 220 180" fill="none" className={className} aria-hidden="true">
      <rect x="18" y="14" width="130" height="152" rx="12" fill="#FFFFFF" stroke="#3688B8" strokeWidth="2" />
      <rect x="18" y="14" width="130" height="152" rx="12" className="dot-grid" opacity="0.5" />
      <line x1="38" y1="42" x2="112" y2="42" stroke="#24566F" strokeWidth="3" strokeLinecap="round" className="svg-draw" style={{ ['--dash' as string]: '80', animationDelay: '0.2s' }} />
      <line x1="38" y1="62" x2="128" y2="62" stroke="#3688B8" strokeOpacity="0.6" strokeWidth="2.5" strokeLinecap="round" className="svg-draw" style={{ ['--dash' as string]: '95', animationDelay: '0.45s' }} />
      <line x1="38" y1="80" x2="120" y2="80" stroke="#3688B8" strokeOpacity="0.6" strokeWidth="2.5" strokeLinecap="round" className="svg-draw" style={{ ['--dash' as string]: '88', animationDelay: '0.6s' }} />
      <line x1="38" y1="98" x2="126" y2="98" stroke="#3688B8" strokeOpacity="0.6" strokeWidth="2.5" strokeLinecap="round" className="svg-draw" style={{ ['--dash' as string]: '92', animationDelay: '0.75s' }} />
      {/* Lupa */}
      <g>
        <circle cx="152" cy="112" r="34" fill="#E8F1F5" stroke="#24566F" strokeWidth="3" />
        <path d="M152 96v10m0 12v10m-16-16h10m12 0h10" stroke="#3688B8" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="178" y1="138" x2="202" y2="162" stroke="#24566F" strokeWidth="7" strokeLinecap="round" />
      </g>
      {/* Check de verificación */}
      <g className="svg-breathe" style={{ transformOrigin: '52px 132px' }}>
        <circle cx="52" cy="132" r="24" fill="#3688B8" />
        <path d="M41 132l8 8 15-16" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  );
}

export function ScheduleArt({ className = '' }: ArtProps) {
  return (
    <svg viewBox="0 0 220 180" fill="none" className={className} aria-hidden="true">
      {/* Tarjeta de recordatorio */}
      <rect x="14" y="30" width="150" height="120" rx="14" fill="#FFFFFF" stroke="#3688B8" strokeWidth="2" />
      <rect x="30" y="48" width="52" height="52" rx="26" fill="#E8F1F5" />
      {/* Reloj: arco que se llena */}
      <circle cx="56" cy="74" r="18" stroke="#24566F" strokeWidth="2.5" fill="none" />
      <path d="M56 62v12l9 6" stroke="#3688B8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="svg-draw" style={{ ['--dash' as string]: '40' }} />
      <line x1="94" y1="60" x2="146" y2="60" stroke="#24566F" strokeWidth="3" strokeLinecap="round" className="svg-draw" style={{ ['--dash' as string]: '56', animationDelay: '0.3s' }} />
      <line x1="94" y1="78" x2="132" y2="78" stroke="#3688B8" strokeOpacity="0.65" strokeWidth="2.5" strokeLinecap="round" className="svg-draw" style={{ ['--dash' as string]: '42', animationDelay: '0.5s' }} />
      {/* Dosis del día */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="94" y={94 + i * 16} width="86" height="10" rx="5" fill={i === 0 ? '#3688B8' : '#E8F1F5'} className={i === 0 ? 'svg-breathe' : undefined} />
        </g>
      ))}
      <circle cx="46" cy="99" r="5" fill="#3688B8" className="svg-breathe" />
      <circle cx="46" cy="115" r="5" fill="#3688B8" opacity="0.45" />
      <circle cx="46" cy="131" r="5" fill="#3688B8" opacity="0.25" />
      {/* Campana */}
      <g className="svg-breathe" style={{ transformOrigin: '186px 46px', animationDelay: '0.8s' }}>
        <circle cx="186" cy="46" r="27" fill="#24566F" />
        <path d="M186 32c-7 0-11 5-11 12v7l-4 6h30l-4-6v-7c0-7-4-12-11-12Z" fill="#FFFFFF" />
        <path d="M181 60a5 5 0 0 0 10 0" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

export function ShieldArt({ className = '' }: ArtProps) {
  return (
    <svg viewBox="0 0 220 180" fill="none" className={className} aria-hidden="true">
      {/* Anillo de datos */}
      <circle cx="110" cy="90" r="70" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 9" style={{ transformOrigin: '110px 90px', animation: 'orbitSlow 40s linear infinite' }} />
      {/* Escudo */}
      <path
        d="M110 26l52 18v40c0 34-22 58-52 70-30-12-52-36-52-70V44l52-18Z"
        fill="rgba(255,255,255,0.10)"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        className="svg-draw"
        style={{ ['--dash' as string]: '520' }}
      />
      {/* Candado */}
      <rect x="94" y="84" width="32" height="26" rx="6" fill="#FFFFFF" />
      <path d="M100 84v-8a10 10 0 0 1 20 0v8" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" className="svg-draw" style={{ ['--dash' as string]: '46', animationDelay: '0.5s' }} />
      <circle cx="110" cy="95" r="4" fill="#24566F" />
      <rect x="108" y="95" width="4" height="8" rx="2" fill="#24566F" />
      {/* Check */}
      <path d="M84 128l16 16 36-38" stroke="#7FBFDF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" className="svg-draw" style={{ ['--dash' as string]: '86', animationDelay: '0.9s' }} />
    </svg>
  );
}
