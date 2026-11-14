import { auth } from '@/lib/auth/server';

// Proxy de las rutas de Better Auth (get-session, sign-in/email, etc.) al servicio Neon Auth.
// Las rutas propias de la app (/api/auth, /api/auth/register, /api/auth/recover)
// tienen prioridad sobre este catch-all y mantienen el contrato del frontend.
export const { GET, POST, PUT, PATCH, DELETE } = auth.handler();

export const dynamic = 'force-dynamic';
