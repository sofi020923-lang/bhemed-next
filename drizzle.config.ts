import type { Config } from 'drizzle-kit';
import { readFileSync } from 'fs';

// drizzle-kit no carga .env.local automáticamente: leemos la DATABASE_URL de Neon manualmente
function databaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  try {
    const raw = readFileSync('.env.local', 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*DATABASE_URL\s*=\s*"?([^"\n#]+)"?\s*$/);
      if (m) return m[1].trim();
    }
  } catch {
    // .env.local no existe; caer al error de abajo
  }
  throw new Error('DATABASE_URL no encontrada. Ejecuta `neon deploy` para generar .env.local.');
}

export default {
  schema: './src/lib/schemas.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl(),
  },
} satisfies Config;
