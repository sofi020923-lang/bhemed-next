// Tipos principales de BHEMED

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  fechaNacimiento?: string;
  fotoPerfil?: string;
  role: 'paciente' | 'cuidador' | 'admin';
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Medicamento {
  id: string;
  nombreComercial: string;
  nombreGenerico: string;
  principioActivo: string;
  concentracion?: string;
  formaFarmaceutica?: string;
  laboratorio?: string;
  indicaciones?: string;
  contraindicaciones?: string;
  reaccionesAdversas?: string;
  interacciones?: string;
  conservacion?: string;
  dosisComun?: string;
  viaAdministracion?: string;
  requiereReceta: boolean;
  descripcionLenguajeSencillo?: string;
  fuentesBibliograficas?: string[];
  fechaActualizacion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TerminoGlosario {
  id: string;
  termino: string;
  definicion: string;
  categoria?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicamentoPersonal {
  id: string;
  userId: string;
  nombre: string;
  principioActivo?: string;
  concentracion?: string;
  formaFarmaceutica?: string;
  laboratorio?: string;
  fotoUrl?: string;
  color?: string;
  forma?: string;
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tratamiento {
  id: string;
  userId: string;
  medicamentoPersonalId?: string;
  nombreTratamiento: string;
  fechaInicio: string;
  fechaFin?: string;
  dosis: string;
  frecuencia: string;
  horarios?: string[];
  instrucciones?: string;
  estado: 'activo' | 'completado' | 'suspendido';
  notas?: string;
  creadoPor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Recordatorio {
  id: string;
  userId: string;
  tratamientoId: string;
  fechaHora: string;
  tipo: 'medicamento' | 'reposicion' | 'cita';
  estado: 'pendiente' | 'tomado' | 'omitido' | 'reprogramado';
  notificado: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HistorialDosis {
  id: string;
  userId: string;
  tratamientoId: string;
  fechaHora: string;
  dosisTomada?: string;
  estado: 'tomada' | 'pendiente' | 'olvidada';
  notas?: string;
  createdAt: string;
}

export interface AlertaReposicion {
  id: string;
  userId: string;
  medicamentoPersonalId: string;
  stockActual: number;
  stockMinimo: number;
  fechaAlerta?: string;
  estado: 'pendiente' | 'resuelto' | 'ignorado';
  createdAt: string;
  updatedAt: string;
}

export interface PerfilDependiente {
  id: string;
  userId: string;
  nombreDependiente: string;
  relacion?: string;
  fechaNacimiento?: string;
  notasMedicas?: string;
  permisos?: Record<string, boolean>;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConfiguracionUsuario {
  id: string;
  userId: string;
  tema: 'light' | 'dark' | 'system';
  idioma: string;
  notificacionesPush: boolean;
  notificacionesEmail: boolean;
  recordatoriosSonidos: boolean;
  zonaHoraria: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sesion {
  id: string;
  userId: string;
  token: string;
  refreshtToken?: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: string;
  createdAt: string;
  lastUsedAt?: string;
}

// Tipos de respuesta API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Tipos de formularios
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  fechaNacimiento?: string;
  aceptaTerminos: boolean;
}

export interface RecoverFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
  token: string;
}

export interface MedicamentoFormData {
  nombre: string;
  principioActivo?: string;
  concentracion?: string;
  formaFarmaceutica?: string;
  laboratorio?: string;
  fotoUrl?: string;
  color?: string;
  forma?: string;
  notas?: string;
}

export interface TratamientoFormData {
  medicamentoPersonalId?: string;
  nombreTratamiento: string;
  fechaInicio: string;
  fechaFin?: string;
  dosis: string;
  frecuencia: string;
  horarios?: string[];
  instrucciones?: string;
  notas?: string;
}

export interface RecordatorioFormData {
  tratamientoId: string;
  fechaHora: string;
  tipo: 'medicamento' | 'reposicion' | 'cita';
}

export interface PerfilDependienteFormData {
  nombreDependiente: string;
  relacion?: string;
  fechaNacimiento?: string;
  notasMedicas?: string;
  permisos?: Record<string, boolean>;
}

export type Theme = 'light' | 'dark' | 'system';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}