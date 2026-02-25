/**
 * Tipos de dominio para Docente y Asignación (docente a grado/curso/materia).
 */

/** Forma mínima de asignación (p. ej. docenteAsignaciones del docente). */
export interface AsignacionLike {
  id?: number;
  grado: { id?: number; nombre: string; nivel: string };
  curso: { id?: number; nombre: string; jornada?: string | null };
  materia: { id?: number; nombre: string; area?: { id: number; nombre: string } };
}

export interface Asignacion extends AsignacionLike {
  id: number;
  grado: { id: number; nombre: string; nivel: string };
  curso: { id: number; nombre: string; jornada: string | null };
  materia: { id: number; nombre: string; area?: { id: number; nombre: string } };
}

export interface Docente {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  sede_id?: number;
  activo?: boolean;
  institucion?: {
    id: number;
    nombre: string;
  };
  sede?: {
    id?: number;
    nombre: string;
  } | null;
  docenteAsignaciones?: {
    grado: { id?: number; nombre: string; nivel: string };
    curso: { id?: number; nombre: string; jornada?: string | null };
    materia: { id?: number; nombre: string; area?: { id: number; nombre: string } };
  }[];
}
