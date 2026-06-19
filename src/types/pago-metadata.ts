export type PagoMetadataTipo = 'cambio_plan' | 'registro';

export interface PagoMetadata {
  tipo?: PagoMetadataTipo;
  institucionId?: number;
  billingCycle?: string;
  ciclo?: string;
}

export function parsePagoMetadata(raw: unknown): PagoMetadata | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const tipo = obj.tipo;
  if (tipo !== 'cambio_plan' && tipo !== 'registro') return null;
  const institucionId =
    typeof obj.institucionId === 'number' ? obj.institucionId : undefined;
  const billingCycle =
    typeof obj.billingCycle === 'string'
      ? obj.billingCycle
      : typeof obj.ciclo === 'string'
        ? obj.ciclo
        : undefined;
  return { tipo, institucionId, billingCycle, ciclo: billingCycle };
}
