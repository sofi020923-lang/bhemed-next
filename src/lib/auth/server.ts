import { createNeonAuth } from '@neon/auth/next/server';

// Instancia única de Neon Auth (Managed Better Auth) para uso en el servidor:
// RSCs, Server Actions, Route Handlers y Middleware.
// Variables provistas por `neon deploy` en .env.local:
//  - NEON_AUTH_BASE_URL: base URL del servicio Neon Auth del branch
//  - NEON_AUTH_COOKIE_SECRET: secreto (>=32 chars) para firmar las cookies de sesión
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});
