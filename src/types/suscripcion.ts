export type PlanSuscripcion = 'basic' | 'plus';

export type EstadoSuscripcion = 'ACTIVA' | 'USADA' | 'CANCELADA' | 'VENCIDA';

export interface Suscripcion {
  id: number;
  email: string;
  plan_id: number;
  estado: EstadoSuscripcion;
  fecha_inicio: Date | null;
  fecha_fin: Date | null;
  institucion_id: number | null;
}
