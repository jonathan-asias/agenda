/** Plan Plus: subir PDF y extraer HTML. Plan Básico: solo formulario. */
export function planAllowsPlanSemanalPdf(planNombre: string | null | undefined): boolean {
  if (!planNombre) return false;
  return planNombre.toLowerCase().includes('plus');
}

export type PlanSemanalOrigen = 'formulario' | 'pdf';

export function planSemanalMode(planNombre: string | null | undefined): PlanSemanalOrigen {
  return planAllowsPlanSemanalPdf(planNombre) ? 'pdf' : 'formulario';
}
