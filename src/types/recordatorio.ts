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
  motivo?: string | null;
  evento_nombre?: string | null;
  fecha_evento?: string | null;
  lugar_evento?: string | null;
  hora_llegada?: string | null;
  hora_fin?: string | null;
  documento_path?: string | null;
  documento_nombre?: string | null;
  documento_mime?: string | null;
  documento_tamano?: number | null;
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
    autorizacion_respuesta?: string | null;
    autorizacion_respondido_at?: string | null;
  }>;
}
