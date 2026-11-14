CREATE TABLE `alertas_reposicion` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`medicamento_personal_id` text NOT NULL,
	`stock_actual` integer DEFAULT 0 NOT NULL,
	`stock_minimo` integer DEFAULT 5 NOT NULL,
	`fecha_alerta` text,
	`estado` text DEFAULT 'pendiente' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `configuraciones_usuario` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`tema` text DEFAULT 'light' NOT NULL,
	`idioma` text DEFAULT 'es' NOT NULL,
	`notificaciones_push` integer DEFAULT true NOT NULL,
	`notificaciones_email` integer DEFAULT true NOT NULL,
	`recordatorios_sonidos` integer DEFAULT true NOT NULL,
	`zona_horaria` text DEFAULT 'America/Mexico_City' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `configuraciones_usuario_user_id_unique` ON `configuraciones_usuario` (`user_id`);--> statement-breakpoint
CREATE TABLE `glosario` (
	`id` text PRIMARY KEY NOT NULL,
	`termino` text NOT NULL,
	`definicion` text NOT NULL,
	`categoria` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `glosario_termino_unique` ON `glosario` (`termino`);--> statement-breakpoint
CREATE TABLE `historial_dosis` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`tratamiento_id` text NOT NULL,
	`fecha_hora` text NOT NULL,
	`dosis_tomada` text,
	`estado` text NOT NULL,
	`notas` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `medicamentos` (
	`id` text PRIMARY KEY NOT NULL,
	`nombre_comercial` text NOT NULL,
	`nombre_generico` text NOT NULL,
	`principio_activo` text NOT NULL,
	`concentracion` text,
	`forma_farmaceutica` text,
	`laboratorio` text,
	`indicaciones` text,
	`contraindicaciones` text,
	`reacciones_adversas` text,
	`interacciones` text,
	`conservacion` text,
	`dosis_comun` text,
	`via_administracion` text,
	`requiere_receta` integer DEFAULT false NOT NULL,
	`descripcion_lenguaje_sencillo` text,
	`fuentes_bibliograficas` text,
	`fecha_actualizacion` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `medicamentos_personales` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`nombre` text NOT NULL,
	`principio_activo` text,
	`concentracion` text,
	`forma_farmaceutica` text,
	`laboratorio` text,
	`foto_url` text,
	`color` text,
	`forma` text,
	`notas` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `perfiles_dependientes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`nombre_dependiente` text NOT NULL,
	`relacion` text,
	`fecha_nacimiento` text,
	`notas_medicas` text,
	`permisos` text,
	`activo` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `recordatorios` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`tratamiento_id` text NOT NULL,
	`fecha_hora` text NOT NULL,
	`tipo` text DEFAULT 'medicamento' NOT NULL,
	`estado` text DEFAULT 'pendiente' NOT NULL,
	`notificado` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sesiones` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`refresh_token` text,
	`ip_address` text,
	`user_agent` text,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`last_used_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sesiones_token_unique` ON `sesiones` (`token`);--> statement-breakpoint
CREATE TABLE `tratamientos` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`medicamento_personal_id` text,
	`nombre_tratamiento` text NOT NULL,
	`fecha_inicio` text NOT NULL,
	`fecha_fin` text,
	`dosis` text NOT NULL,
	`frecuencia` text NOT NULL,
	`horarios` text,
	`instrucciones` text,
	`estado` text DEFAULT 'activo' NOT NULL,
	`notas` text,
	`creado_por` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`nombre` text NOT NULL,
	`apellido` text NOT NULL,
	`telefono` text,
	`fecha_nacimiento` text,
	`foto_perfil` text,
	`password_hash` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`role` text DEFAULT 'paciente' NOT NULL,
	`activo` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);