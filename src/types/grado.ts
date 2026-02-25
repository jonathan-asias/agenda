/**
 * Tipos de dominio para Grado.
 */

export interface Grado {
  id: number;
  nombre: string;
  nivel: string;
  cursos?: {
    id: number;
    nombre: string;
    jornada: string | null;
  }[];
  _count?: { estudiantes: number };
}
