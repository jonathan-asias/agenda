export type PlanSuscripcion = 'basic' | 'plus';

export type EstadoSuscripcion = 'ACTIVA' | 'PRUEBA' | 'USADA' | 'CANCELADA' | 'VENCIDA';

export type InvitacionPruebaEstado = 'PENDIENTE' | 'USADA' | 'EXPIRADA' | 'REVOCADA';

export interface Suscripcion {
  id: number;
  email: string;
  plan_id: number;
  estado: EstadoSuscripcion;
  es_prueba: boolean;
  fecha_inicio: Date | null;
  fecha_fin: Date | null;
  institucion_id: number | null;
}
