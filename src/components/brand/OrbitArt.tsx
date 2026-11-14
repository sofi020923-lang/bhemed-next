/**
 * Arte principal del hero: sistema orbital farmacéutico.
 * - Anillos dashed que rotan lentamente (órbitas de adherencia al tratamiento)
 * - Cápsula y comprimido flotando en órbita
 * - Línea de EKG que se traza en loop (señal vital)
 * - Cruz farmacéutica central que respira
 *
 * Toda la animación es CSS puro y se apaga con prefers-reduced-motion.
 */
export default function OrbitArt() {
  return (
    <div className="relative w-full max-w-[520px] mx-auto aspect-square select-none" aria-hidden="true">
      {/* Halo de fondo */}
      <svg viewBox="0 0 520 520" className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="orb-halo" cx="50%" cy="46%" r="60%">
            <stop offset="0%" stopColor="#3688B8" stopOpacity="0.14" />
            <stop offset="70%" stopColor="#3688B8" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#3688B8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="260" cy="250" r="240" fill="url(#orb-halo)" />
      </svg>

      {/* Anillos orbitales */}
      <svg viewBox="0 0 520 520" className="absolute inset-0 w-full h-full">
        <g style={{ transformOrigin: '260px 250px', animation: 'orbitSlow 46s linear infinite' }}>
          <circle cx="260" cy="250" r="204" fill="none" stroke="#3688B8" strokeOpacity="0.28" strokeWidth="1.4" strokeDasharray="3 10" />
          {/* Comprimido en órbita exterior */}
          <g transform="translate(260 46)">
            <rect x="-17" y="-11" width="34" height="22" rx="11" transform="rotate(24)" fill="#E8F1F5" stroke="#3688B8" strokeWidth="1.8" />
            <line x1="0" y1="-10" x2="0" y2="10" transform="rotate(24)" stroke="#3688B8" strokeWidth="1.6" />
          </g>
        </g>

        <g style={{ transformOrigin: '260px 250px', animation: 'orbitReverse 32s linear infinite' }}>
          <circle cx="260" cy="250" r="150" fill="none" stroke="#24566F" strokeOpacity="0.34" strokeWidth="1.2" strokeDasharray="14 9" />
          {/* Cápsula en órbita media */}
          <g transform="translate(410 250)">
            <g transform="rotate(-32)" style={{ animation: 'floatY 5s ease-in-out infinite' }}>
              <rect x="-24" y="-12" width="48" height="24" rx="12" fill="#3688B8" />
              <path d="M0 -12h12a12 12 0 0 1 0 24H0V-12Z" fill="#24566F" />
              <line x1="0" y1="-10.5" x2="0" y2="10.5" stroke="#E8F1F5" strokeWidth="2" />
              <circle cx="-11" cy="0" r="2.4" fill="#E8F1F5" opacity="0.9" />
            </g>
          </g>
        </g>

        <circle cx="260" cy="250" r="98" fill="none" stroke="#3688B8" strokeOpacity="0.5" strokeWidth="1.6" />

        {/* Ticks de reloj sobre el anillo interior (horarios de toma) */}
        <g stroke="#24566F" strokeWidth="2" strokeLinecap="round" opacity="0.55">
          {[0, 90, 180, 270].map((deg) => (
            <line
              key={deg}
              x1={260 + 98 * Math.cos(((deg - 90) * Math.PI) / 180)}
              y1={250 + 98 * Math.sin(((deg - 90) * Math.PI) / 180)}
              x2={260 + 90 * Math.cos(((deg - 90) * Math.PI) / 180)}
              y2={250 + 90 * Math.sin(((deg - 90) * Math.PI) / 180)}
            />
          ))}
        </g>

        {/* Puntos de "dosis tomada" sobre órbitas */}
        <circle cx="106" cy="160" r="4.5" fill="#2A6B91" className="svg-breathe" />
        <circle cx="420" cy="150" r="3.5" fill="#3688B8" className="svg-breathe" style={{ animationDelay: '1.2s' }} />
        <circle cx="96" cy="330" r="3" fill="#24566F" className="svg-breathe" style={{ animationDelay: '2.1s' }} />
      </svg>

      {/* Núcleo: cruz farmacéutica + anillo de latido */}
      <svg viewBox="0 0 520 520" className="absolute inset-0 w-full h-full">
        <g className="svg-breathe">
          <circle cx="260" cy="250" r="62" fill="#FFFFFF" stroke="#3688B8" strokeWidth="2" />
          <path
            d="M260 218c8-10 22-10 30 0 8 11 5 24-6 33l-24 20-24-20c-11-9-14-22-6-33 8-10 22-10 30 0Z"
            fill="#3688B8"
          />
        </g>
        {/* Latido dentro del núcleo */}
        <path
          d="M212 250h30l8-16 12 32 10-22 6 6h30"
          fill="none"
          stroke="#24566F"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="svg-ekg"
          opacity="0"
        />
      </svg>

      {/* EKG trazándose por debajo de las órbitas */}
      <svg viewBox="0 0 520 520" className="absolute inset-0 w-full h-full">
        <path
          d="M40 388h96l14-26 20 46 16-34 10 14h60l12-20 14 20h64l16-30 18 30h120"
          fill="none"
          stroke="#2A6B91"
          strokeOpacity="0.5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="svg-ekg"
        />
        <path
          d="M40 120h110l12-18 16 36 14-26 8 8h70"
          fill="none"
          stroke="#3688B8"
          strokeOpacity="0.35"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="svg-ekg"
          style={{ animationDelay: '1.4s' }}
        />
      </svg>
    </div>
  );
}
