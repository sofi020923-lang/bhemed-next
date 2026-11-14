import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schemas';

// Provider: Neon PostgreSQL (driver serverless HTTP, ideal para App Router/serverless)
// La cadena de conexión se gestiona con `neon deploy` y vive en .env.local (DATABASE_URL)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL no está definida. Ejecuta `neon deploy` para generar .env.local con las credenciales de Neon.'
  );
}

export const db = drizzle(neon(connectionString), { schema });

export type DB = typeof db;

// Función para inicializar la base de datos (crear tablas si no existen)
export async function initDatabase() {
  try {
    // Las tablas se crean con `npm run db:init` (scripts/init-db.mjs) o `npm run db:push`
    // Este espacio queda para migraciones adicionales o seeds
    console.log('Base de datos Neon PostgreSQL inicializada correctamente');
  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
    throw error;
  }
}
