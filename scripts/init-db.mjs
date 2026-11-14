/**
 * Script de inicialización de la base de datos SQLite.
 * Crea todas las tablas definidas en src/lib/schemas.ts si no existen.
 * Ejecutar con: node scripts/init-db.mjs
 *
 * Para migrar a PostgreSQL remoto, usar `npm run db:push` con drizzle-kit
 * y cambiar el dialect en drizzle.config.ts.
 */
import { createClient } from '@libsql/client';

const client = createClient({ url: process.env.DATABASE_URL || 'file:./local.db' });

const statements = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    telefono TEXT,
    fecha_nacimiento TEXT,
    foto_perfil TEXT,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    role TEXT NOT NULL DEFAULT 'paciente',
    activo INTEGER NOT NULL DEFAULT 1
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
    requiere_receta INTEGER NOT NULL DEFAULT 0,
    descripcion_lenguaje_sencillo TEXT,
    fuentes_bibliograficas TEXT,
    fecha_actualizacion TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS glosario (
    id TEXT PRIMARY KEY,
    termino TEXT NOT NULL UNIQUE,
    definicion TEXT NOT NULL,
    categoria TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
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
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
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
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS recordatorios (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    tratamiento_id TEXT NOT NULL,
    fecha_hora TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'medicamento',
    estado TEXT NOT NULL DEFAULT 'pendiente',
    notificado INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS historial_dosis (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    tratamiento_id TEXT NOT NULL,
    fecha_hora TEXT NOT NULL,
    dosis_tomada TEXT,
    estado TEXT NOT NULL,
    notas TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS alertas_reposicion (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    medicamento_personal_id TEXT NOT NULL,
    stock_actual INTEGER NOT NULL DEFAULT 0,
    stock_minimo INTEGER NOT NULL DEFAULT 5,
    fecha_alerta TEXT,
    estado TEXT NOT NULL DEFAULT 'pendiente',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS perfiles_dependientes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    nombre_dependiente TEXT NOT NULL,
    relacion TEXT,
    fecha_nacimiento TEXT,
    notas_medicas TEXT,
    permisos TEXT,
    activo INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS sesiones (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    refresh_token TEXT,
    ip_address TEXT,
    user_agent TEXT,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS configuraciones_usuario (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    tema TEXT NOT NULL DEFAULT 'light',
    idioma TEXT NOT NULL DEFAULT 'es',
    notificaciones_push INTEGER NOT NULL DEFAULT 1,
    notificaciones_email INTEGER NOT NULL DEFAULT 1,
    recordatorios_sonidos INTEGER NOT NULL DEFAULT 1,
    zona_horaria TEXT NOT NULL DEFAULT 'America/Mexico_City',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
];

async function main() {
  for (const sql of statements) {
    await client.execute(sql);
  }
  console.log('✅ Base de datos SQLite inicializada: tablas creadas correctamente.');
}

main().catch((err) => {
  console.error('❌ Error inicializando la base de datos:', err);
  process.exit(1);
});
