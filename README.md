# BHEMED - Educación Farmacéutica y Gestión de Medicamentos

Una aplicación segura, intuitiva y accesible para conocer tus medicamentos, comprender su información farmacológica y organizar tus tratamientos mediante una app multiplataforma.

## Tecnologías

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS**
- **Lucide React** (iconos)
- **Framer Motion** (animaciones SVG)
- **Drizzle ORM** + **@neondatabase/serverless** (Neon PostgreSQL serverless)
- **Neon Auth** (Managed Better Auth) para autenticación
- **Neon Object Storage** (S3 API) para fotografías
- **Zustand** (estado global)
- **React Hook Form** + **Zod** (formularios)

## Estructura

```
bhemed-next/
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── drizzle.config.ts
├── src/
│   ├── app/
│   │   ├── page.tsx              # Página de inicio
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── recover/page.tsx
│   │   ├── farmacheck/
│   │   │   ├── page.tsx          # FarmaCheck (buscar, glosario)
│   │   │   └── ... (componentes)
│   │   ├── farmatrack/
│   │   │   ├── page.tsx          # Dashboard, medicamentos, tratamientos, recordatorios
│   │   │   └── ...
│   │   ├── perfil/
│   │   └── api/
│   │       ├── auth/
│   │       ├── medicamentos/
│   │       ├── tratamientos/
│   │       ├── recordatorios/
│   │       ├── glosario/
│   │       └── seed/
│   ├── components/
│   │   ├── ui/                   # Button, Input, Card, Badge, Modal, Spinner, EmptyState
│   │   ├── layout/               # Header, Footer, Sidebar, Layout principal
│   │   └── common/               # ActionButton, AnimatedDetails
│   ├── lib/
│   │   ├── db.ts                 # Drizzle + Neon PostgreSQL (driver serverless)
│   │   ├── schemas.ts            # Tipos Drizzle
│   │   ├── storage.ts            # Neon Object Storage (S3)
│   │   ├── utils.ts              # Helpers (id, truncateText, capitalizeText, etc.)
│   │   ├── auth.ts               # Auth utilities
│   │   └── seed.ts               # Seed de datos de ejemplo
│   ├── store/
│   │   ├── useAuthStore.ts       # Zustand auth
│   │   ├── useThemeStore.ts      # Zustand theme
│   │   ├── useNotificationStore.ts
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/
│   ├── types/
│   ├── styles/
│   └── public/
│       └── svg/                  # SVGs animados
└── .env.local                    # Variables de entorno (no commits)
```

## Funcionalidades

### A. FarmaCheck — Información farmacológica
- Buscar medicamentos por nombre comercial, genérico o principio activo.
- Consultar concentraciones, formas, indicaciones, contraindicaciones, reacciones adversas, interacciones, conservación.
- Glosario farmacológico (20 términos).

### B. FarmaTrack — Organización y seguimiento personal
- Registrar medicamentos personales.
- Tratamientos según indicación del profesional.
- Horarios, recordatorios, dosis tomadas, pendientes.
- Perfiles de dependientes, autorización de cuidadores.

### C. Fotografías
- Subida, selección y visualización de fotos asociadas a medicamentos.

### D. Diseño UX/UI
- Colores oficiales: Azul océano #3688B8, Azul petróleo #24566F, Azul hielo #E8F1F5.
- Modo claro y oscuro, tipografía legible, botones identificables, navegación intuitiva.
- Accesibilidad para adultos mayores.

## Seguridad
- No exponer claves privadas ni credenciales en código.
- Proteger datos de salud, fotografías y perfiles de dependientes.
- Row Level Security disponible en PostgreSQL; las sesiones las gestiona Neon Auth (cookies firmadas).
- No diagnosticar enfermedades ni prescribir medicamentos.

## Próxima etapa
Backend conectado a Neon (PostgreSQL + Auth + Object Storage). Pendiente: configurar SMTP en Neon Auth para emails de recuperación y aplicar RLS según roles.

---
*Documento generado según BHEMED master instructions.*