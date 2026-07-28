import { PLAN_PLUS_NOMBRE } from '@/lib/planes';

export type SilabusOrigen = 'formulario' | 'pdf';

export function isPlanPlus(planNombre: string | null | undefined): boolean {
  if (!planNombre) return false;
  return planNombre.toLowerCase().includes('plus');
}

/** Plan Plus: subir PDF y extraer HTML. Plan Básico: solo formulario. */
export function planAllowsSilabusPdf(planNombre: string | null | undefined): boolean {
  return isPlanPlus(planNombre);
}

export function planSilabusMode(planNombre: string | null | undefined): SilabusOrigen {
  return planAllowsSilabusPdf(planNombre) ? 'pdf' : 'formulario';
}

export { PLAN_PLUS_NOMBRE };
