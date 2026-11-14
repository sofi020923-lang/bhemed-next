# BHEMED - Educación Farmacéutica y Gestión de Medicamentos

Una aplicación segura, intuitiva y accesible para conocer tus medicamentos, comprender su información farmacológica y organizar tus tratamientos mediante una app multiplataforma.

## Tecnologías

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS**
- **Lucide React** (iconos)
- **Framer Motion** (animaciones SVG)
- **Drizzle ORM** + **better-sqlite3** (SQLite local, migrable a PostgreSQL)
- **Supabase Auth** (autenticación, con posibilidad de cambiar a provider remoto como PostgreSQL)
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
│   │   ├── db.ts                 # Drizzle + SQLite (listo para PostgreSQL remoto)
│   │   ├── schemas.ts            # Tipos Drizzle
│   │   ├── supabase.ts           # Supabase client
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
- Implementar Row Level Security (RLS) en Supabase y PostgreSQL.
- No diagnosticar enfermedades ni prescribir medicamentos.

## Próxima etapa
Crear las rutas API REST, configurar Supabase (o PostgreSQL remoto), inicializar base de datos SQLite y migrar a PostgreSQL cuando esté disponible.

---
*Documento generado según BHEMED master instructions.*