/**
 * Script de inicialización de la base de datos Neon PostgreSQL.
 * Crea todas las tablas definidas en src/lib/schemas.ts si no existen.
 * Ejecutar con: node scripts/init-db.mjs (usa DATABASE_URL de .env.local o del entorno)
 */
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

function databaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const raw = readFileSync('.env.local', 'utf8');
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*DATABASE_URL\s*=\s*"?([^"\n#]+)"?\s*$/);
    if (m) return m[1].trim();
  }
  throw new Error('DATABASE_URL no encontrada. Ejecuta `neon deploy` para generar .env.local.');
}

const sql = neon(databaseUrl());

const statements = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    telefono TEXT,
    fecha_nacimiento TEXT,
    foto_perfil TEXT,
    created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text),
    updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text),
    role TEXT NOT NULL DEFAULT 'paciente',
    activo BOOLEAN NOT NULL DEFAULT TRUE
  )`,
  `CREATE TABLE IF NOT EXISTS medicamentos (
    id TEXT PRIMARY KEY,
    nombre_comercial TEXT NOT NULL,
    nombre_generico TEXT NOT NULL,
    principio_activo TEXT NOT NULL,
    concentracion TEXT,
    forma_farmaceutica TEXT,
    laboratorio TEXT,
    indicaciones TEXT,
    contraindicaciones TEXT,
    reacciones_adversas TEXT,
    interacciones TEXT,
    conservacion TEXT,
    dosis_comun TEXT,
    via_administracion TEXT,
    requiere_receta BOOLEAN NOT NULL DEFAULT FALSE,
    descripcion_lenguaje_sencillo TEXT,
    fuentes_bibliograficas TEXT,
    fecha_actualizacion TEXT,
    created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text),
    updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text)
  )`,
  `CREATE TABLE IF NOT EXISTS glosario (
    id TEXT PRIMARY KEY,
    termino TEXT NOT NULL UNIQUE,
    definicion TEXT NOT NULL,
    categoria TEXT,
    created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text),
    updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text)
  )`,
  `CREATE TABLE IF NOT EXISTS medicamentos_personales (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    nombre TEXT NOT NULL,
    principio_activo TEXT,
    concentracion TEXT,
    forma_farmaceutica TEXT,
    laboratorio TEXT,
    foto_url TEXT,
    color TEXT,
    forma TEXT,
    notas TEXT,
    created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text),
    updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text)
  )`,
  `CREATE TABLE IF NOT EXISTS tratamientos (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    medicamento_personal_id TEXT,
    nombre_tratamiento TEXT NOT NULL,
    fecha_inicio TEXT NOT NULL,
    fecha_fin TEXT,
    dosis TEXT NOT NULL,
    frecuencia TEXT NOT NULL,
    horarios TEXT,
    instrucciones TEXT,
    estado TEXT NOT NULL DEFAULT 'activo',
    notas TEXT,
    creado_por TEXT,
    created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text),
    updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text)
  )`,
  `CREATE TABLE IF NOT EXISTS recordatorios (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    tratamiento_id TEXT NOT NULL,
    fecha_hora TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'medicamento',
    estado TEXT NOT NULL DEFAULT 'pendiente',
    notificado BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text),
    updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text)
  )`,
  `CREATE TABLE IF NOT EXISTS historial_dosis (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    tratamiento_id TEXT NOT NULL,
    fecha_hora TEXT NOT NULL,
    dosis_tomada TEXT,
    estado TEXT NOT NULL,
    notas TEXT,
    created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text)
  )`,
  `CREATE TABLE IF NOT EXISTS alertas_reposicion (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    medicamento_personal_id TEXT NOT NULL,
    stock_actual INTEGER NOT NULL DEFAULT 0,
    stock_minimo INTEGER NOT NULL DEFAULT 5,
    fecha_alerta TEXT,
    estado TEXT NOT NULL DEFAULT 'pendiente',
    created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text),
    updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text)
  )`,
  `CREATE TABLE IF NOT EXISTS perfiles_dependientes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    nombre_dependiente TEXT NOT NULL,
    relacion TEXT,
    fecha_nacimiento TEXT,
    notas_medicas TEXT,
    permisos TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text),
    updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text)
  )`,
  `CREATE TABLE IF NOT EXISTS configuraciones_usuario (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    tema TEXT NOT NULL DEFAULT 'light',
    idioma TEXT NOT NULL DEFAULT 'es',
    notificaciones_push BOOLEAN NOT NULL DEFAULT TRUE,
    notificaciones_email BOOLEAN NOT NULL DEFAULT TRUE,
    recordatorios_sonidos BOOLEAN NOT NULL DEFAULT TRUE,
    zona_horaria TEXT NOT NULL DEFAULT 'America/Mexico_City',
    created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text),
    updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP::text)
  )`,
];

async function main() {
  for (const stmt of statements) {
    await sql.query(stmt);
  }
  console.log('✅ Base de datos Neon PostgreSQL inicializada: tablas creadas correctamente.');
}

main().catch((err) => {
  console.error('❌ Error inicializando la base de datos:', err);
  process.exit(1);
});
