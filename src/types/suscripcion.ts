/**
 * Tipos y comentarios para la futura escalabilidad SaaS (Wompi + suscripciones).
 * NO modificar base de datos aún; solo arquitectura y documentación preparada.
 *
 * Estructura futura sugerida:
 *
 * - Tabla: suscripciones
 *   - id, institucion_id, plan_actual ('basic' | 'plus'),
 *   - estado_suscripcion ('activa' | 'cancelada' | 'vencida' | 'trial'),
 *   - fecha_expiracion (DateTime),
 *   - referencia_wompi (string, opcional),
 *   - created_at, updated_at
 *
 * - Instituciones: agregar
 *   - plan_actual: enum o string nullable
 *   - (opcional) enlace a suscripciones para historial
 *
 * - Flujo: create-checkout-session -> Wompi -> webhook confirmación
 *   -> insert/update suscripciones + update institucion.plan_actual
 */

export type PlanSuscripcion = 'basic' | 'plus';

export type EstadoSuscripcion = 'activa' | 'cancelada' | 'vencida' | 'trial';

/** Usar cuando se implemente la tabla suscripciones. */
export interface SuscripcionFutura {
  id: number;
  institucion_id: number;
  plan_actual: PlanSuscripcion;
  estado_suscripcion: EstadoSuscripcion;
  fecha_expiracion: Date;
  referencia_wompi?: string | null;
}
