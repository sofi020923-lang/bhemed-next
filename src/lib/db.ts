import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schemas';

// Provider local: SQLite (libSQL) - listo para soportar uno remoto como PostgreSQL
// Para usar PostgreSQL remoto, cambiar la URL por la cadena de conexión de Supabase/Neon/ etc.
// y cambiar el dialect en drizzle.config.ts
const client = createClient({
  url: process.env.DATABASE_URL || 'file:./local.db',
});

export const db = drizzle(client, { schema });

export type DB = typeof db;

// Función para inicializar la base de datos (crear tablas si no existen)
export async function initDatabase() {
  try {
    // Las tablas se crean automáticamente con drizzle-kit push
    // Este espacio queda para migraciones adicionales o seeds
    console.log('Base de datos SQLite inicializada correctamente');
  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
    throw error;
  }
}