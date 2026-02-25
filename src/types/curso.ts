/**
 * Tipos de dominio para Curso.
 */

export interface Curso {
  id: number;
  nombre: string;
  jornada: string | null;
  grado?: {
    id?: number;
    nombre: string;
    nivel?: string;
  };
  _count?: { estudiantes: number };
}
