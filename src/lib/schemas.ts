import { sql } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  text,
} from 'drizzle-orm/pg-core';

// Tabla de usuarios (perfiles de aplicación; las credenciales y sesiones las gestiona Neon Auth)
export const users = pgTable('users', {
  id: text('id').primaryKey(), // UUID (id del usuario de Neon Auth)
  email: text('email').notNull().unique(),
  nombre: text('nombre').notNull(),
  apellido: text('apellido').notNull(),
  telefono: text('telefono'),
  fechaNacimiento: text('fecha_nacimiento'),
  fotoPerfil: text('foto_perfil'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  role: text('role').default('paciente').notNull(), // paciente, cuidador, admin
  activo: boolean('activo').default(true).notNull(),
});

// Tabla de medicamentos (catálogo general - FarmaCheck)
export const medicamentos = pgTable('medicamentos', {
  id: text('id').primaryKey(),
  nombreComercial: text('nombre_comercial').notNull(),
  nombreGenerico: text('nombre_generico').notNull(),
  principioActivo: text('principio_activo').notNull(),
  concentracion: text('concentracion'),
  formaFarmaceutica: text('forma_farmaceutica'), // tableta, cápsula, jarabe, inyectable, etc.
  laboratorio: text('laboratorio'),
  indicaciones: text('indicaciones'), // JSON array o texto plano
  contraindicaciones: text('contraindicaciones'),
  reaccionesAdversas: text('reacciones_adversas'),
  interacciones: text('interacciones'),
  conservacion: text('conservacion'),
  dosisComun: text('dosis_comun'),
  viaAdministracion: text('via_administracion'), // oral, intravenosa, tópica, etc.
  requiereReceta: boolean('requiere_receta').default(false).notNull(),
  descripcionLenguajeSencillo: text('descripcion_lenguaje_sencillo'),
  fuentesBibliograficas: text('fuentes_bibliograficas'), // JSON array
  fechaActualizacion: text('fecha_actualizacion'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Tabla de glosario farmacológico
export const glosario = pgTable('glosario', {
  id: text('id').primaryKey(),
  termino: text('termino').notNull().unique(),
  definicion: text('definicion').notNull(),
  categoria: text('categoria'), // principio activo, forma farmacéutica, efecto, etc.
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Tabla de medicamentos personales (FarmaTrack)
export const medicamentosPersonales = pgTable('medicamentos_personales', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  nombre: text('nombre').notNull(),
  principioActivo: text('principio_activo'),
  concentracion: text('concentracion'),
  formaFarmaceutica: text('forma_farmaceutica'),
  laboratorio: text('laboratorio'),
  fotoUrl: text('foto_url'), // URL de la fotografía del medicamento
  color: text('color'), // Color de la pastilla/cápsula para identificación visual
  forma: text('forma'), // redonda, ovalada, cápsula, etc.
  notas: text('notas'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Tabla de tratamientos
export const tratamientos = pgTable('tratamientos', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  medicamentoPersonalId: text('medicamento_personal_id'),
  nombreTratamiento: text('nombre_tratamiento').notNull(),
  fechaInicio: text('fecha_inicio').notNull(),
  fechaFin: text('fecha_fin'),
  dosis: text('dosis').notNull(),
  frecuencia: text('frecuencia').notNull(), // cada 8 horas, cada 12 horas, etc.
  horarios: text('horarios'), // JSON array de horarios
  instrucciones: text('instrucciones'),
  estado: text('estado').default('activo').notNull(), // activo, completado, suspendido
  notas: text('notas'),
  creadoPor: text('creado_por'), // userId del cuidador si aplica
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Tabla de recordatorios
export const recordatorios = pgTable('recordatorios', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  tratamientoId: text('tratamiento_id').notNull(),
  fechaHora: text('fecha_hora').notNull(),
  tipo: text('tipo').default('medicamento').notNull(), // medicamento, reposicion, cita
  estado: text('estado').default('pendiente').notNull(), // pendiente, tomado, omitido, reprogramado
  notificado: boolean('notificado').default(false).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Tabla de historial de dosis
export const historialDosis = pgTable('historial_dosis', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  tratamientoId: text('tratamiento_id').notNull(),
  fechaHora: text('fecha_hora').notNull(),
  dosisTomada: text('dosis_tomada'), // La dosis que se tomó
  estado: text('estado').notNull(), // tomada, pendiente, olvidada
  notas: text('notas'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Tabla de alertas de reposición
export const alertasReposicion = pgTable('alertas_reposicion', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  medicamentoPersonalId: text('medicamento_personal_id').notNull(),
  stockActual: integer('stock_actual').default(0).notNull(),
  stockMinimo: integer('stock_minimo').default(5).notNull(),
  fechaAlerta: text('fecha_alerta'),
  estado: text('estado').default('pendiente').notNull(), // pendiente, resuelto, ignorado
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Tabla de perfiles de personas dependientes
export const perfilesDependientes = pgTable('perfiles_dependientes', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(), // ID del cuidador principal
  nombreDependiente: text('nombre_dependiente').notNull(),
  relacion: text('relacion'), // hijo, padre, pareja, etc.
  fechaNacimiento: text('fecha_nacimiento'),
  notasMedicas: text('notas_medicas'),
  permisos: text('permisos'), // JSON con permisos específicos
  activo: boolean('activo').default(true).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Tabla de configuración del usuario
export const configuracionesUsuario = pgTable('configuraciones_usuario', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  tema: text('tema').default('light').notNull(), // light, dark, system
  idioma: text('idioma').default('es').notNull(),
  notificacionesPush: boolean('notificaciones_push').default(true).notNull(),
  notificacionesEmail: boolean('notificaciones_email').default(true).notNull(),
  recordatoriosSonidos: boolean('recordatorios_sonidos').default(true).notNull(),
  zonaHoraria: text('zona_horaria').default('America/Mexico_City').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});
