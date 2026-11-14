import Link from 'next/link';

interface LogoProps {
  variant?: 'color' | 'on-dark';
  size?: number;
  withWordmark?: boolean;
  href?: string | null;
  className?: string;
}

/**
 * Marca BHEMED: cápsula partida dentro de un anillo con cruz farmacéutica.
 * Todo trazado a mano en SVG para mantener la identidad en cualquier tamaño.
 */
export default function Logo({
  variant = 'color',
  size = 36,
  withWordmark = true,
  href = '/',
  className = '',
}: LogoProps) {
  const ink = variant === 'on-dark' ? '#FFFFFF' : '#24566F';
  const ring = variant === 'on-dark' ? 'rgba(255,255,255,0.45)' : '#3688B8';
  const capTop = variant === 'on-dark' ? '#FFFFFF' : '#3688B8';
  const capBottom = variant === 'on-dark' ? 'rgba(255,255,255,0.55)' : '#24566F';

  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="24" cy="24" r="21.5" stroke={ring} strokeWidth="2.5" />
      <g transform="rotate(-45 24 24)">
        <rect x="11" y="18.5" width="26" height="11" rx="5.5" fill={capBottom} />
        <path d="M24 18.5h7.5a5.5 5.5 0 0 1 0 11H24V18.5Z" fill={capTop} />
        <line x1="24" y1="19.5" x2="24" y2="28.5" stroke={variant === 'on-dark' ? '#24566F' : '#E8F1F5'} strokeWidth="1.6" />
      </g>
      <path d="M24 6.5v4M24 37.5v4M6.5 24h4M37.5 24h4" stroke={ring} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
    </svg>
  );

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {mark}
      {withWordmark && (
        <span
          className="font-bold tracking-tight text-lg leading-none"
          style={{ color: ink }}
        >
          BHEMED
          <span className="block text-[10px] font-medium tracking-[0.18em] uppercase opacity-60 mt-0.5">
            Farmacia digital
          </span>
        </span>
      )}
    </span>
  );

  if (!href) return content;
  return <Link href={href} aria-label="BHEMED — inicio">{content}</Link>;
}
