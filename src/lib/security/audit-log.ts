import type { NextRequest } from 'next/server';
import { withDbBypass } from '@/lib/db/rls-context';

export type AuditAction =
  | 'PAGO_CREADO'
  | 'PAGO_CONFIRMADO'
  | 'INSTITUCION_CREADA'
  | 'INSTITUCION_ELIMINADA'
  | 'SUSCRIPCION_CANCELADA'
  | 'CAMBIO_PLAN_INICIADO'
  | 'PLATFORM_ADMIN_RESET_PASSWORD'
  | 'PLATFORM_ADMIN_RESEND_VERIFICATION'
  | 'TRIAL_INVITE_CREATED'
  | 'TRIAL_INVITE_RESENT'
  | 'TRIAL_INSTITUTION_PROVISIONED';

function getClientIp(request?: NextRequest): string | null {
  if (!request) return null;
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip');
}

export async function writeAuditLog(params: {
  usuario?: string | null;
  accion: AuditAction;
  ip?: string | null;
  metadata?: Record<string, unknown>;
  request?: NextRequest;
}): Promise<void> {
  const ip = params.ip ?? getClientIp(params.request) ?? null;
  const metadata =
    params.metadata && Object.keys(params.metadata).length > 0
      ? JSON.stringify(params.metadata)
      : null;

  try {
    await withDbBypass(async (tx) => {
      await tx.auditLog.create({
        data: {
          usuario: params.usuario?.trim() || null,
          accion: params.accion,
          ip,
          metadata,
        },
      });
    });
  } catch (error) {
    console.error('Error al escribir audit log:', error);
  }
}
