import { NextRequest, NextResponse } from 'next/server';
import { enforceTenant, tenantErrorToResponse } from '@/lib/tenant';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import { subscriptionErrorToResponse } from '@/lib/security/subscription-guard';
import { writeAuditLog } from '@/lib/security/audit-log';
import { withOwnerTenantDb } from '@/lib/security/require-admin-api';
import {
  cancelInstitutionSubscription,
  getSubscriptionGraceDays,
} from '@/lib/subscription/cancel-institution-subscription';

/** POST /api/instituciones/[id]/plan/cancel — cancela la suscripción activa con periodo de gracia */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const institucionId = Number.parseInt(id, 10);
    if (Number.isNaN(institucionId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const result = await withOwnerTenantDb(request, async (tx, userInstitutionId) => {
      enforceTenant(userInstitutionId, institucionId);
      return cancelInstitutionSubscription(tx, institucionId);
    });

    if (!result.ok) {
      if (result.reason === 'not_found') {
        return NextResponse.json({ error: 'Institución no encontrada' }, { status: 404 });
      }
      if (result.reason === 'no_subscription') {
        return NextResponse.json({ error: 'No hay suscripción activa' }, { status: 400 });
      }
      return NextResponse.json({ error: 'La suscripción ya está cancelada' }, { status: 400 });
    }

    const { data } = result;
    await writeAuditLog({
      usuario: data.email,
      accion: 'SUSCRIPCION_CANCELADA',
      metadata: {
        institucionId,
        graceUntil: data.graceUntil.toISOString(),
        wompiLinkDeactivated: data.wompiLinkDeactivated,
      },
      request,
    });

    return NextResponse.json({
      cancelled: true,
      graceUntil: data.graceUntil.toISOString(),
      graceDays: getSubscriptionGraceDays(),
      wompiLinkDeactivated: data.wompiLinkDeactivated,
      mercadoPagoNote: data.mercadoPagoNote,
    });
  } catch (error) {
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const subResp = subscriptionErrorToResponse(error);
    if (subResp) return subResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error cancelando suscripción:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
