/**
 * Tipos de dominio para Estudiante.
 * Centralizado para uso en modales, listados y perfiles.
 */

export interface Estudiante {
  id: number;
  nombres: string;
  apellidos: string;
  codigo_estudiantil: string;
  nombre_acudiente?: string;
  correo_acudiente?: string;
  telefono_acudiente?: string;
  grado_id?: number | null;
  curso_id?: number | null;
  institucion_id?: number;
  activo?: boolean;
  grado?: {
    nombre: string;
    nivel: string;
  };
  curso?: {
    nombre: string;
    jornada: string | null;
  };
}
