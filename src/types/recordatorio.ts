/**
 * Tipos de dominio para Recordatorio.
 */

export interface Recordatorio {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  tipo: string;
  modo_envio?: string | null;
  created_at?: string;
  updated_at?: string;
  grado: {
    id: number;
    nombre: string;
    nivel: string;
  };
  curso: {
    id: number;
    nombre: string;
    jornada: string | null;
  };
  area: {
    id: number;
    nombre: string;
  };
  materia: {
    id: number;
    nombre: string;
  };
  docente?: {
    nombres: string;
    apellidos: string;
    email: string;
  };
  estudiantes?: Array<{
    estudiante: {
      id: number;
      nombres: string;
      apellidos: string;
      codigo_estudiantil: string;
    };
  }>;
}
