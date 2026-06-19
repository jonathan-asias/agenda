import { NextRequest, NextResponse } from 'next/server';
import { enforceTenant, tenantErrorToResponse } from '@/lib/tenant';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import { withOwnerTenantDb } from '@/lib/security/require-admin-api';
import { createInstitutionPlanCheckout } from '@/lib/payments/create-institution-plan-checkout';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';
import { writeAuditLog } from '@/lib/security/audit-log';
import { getPlanChargeAmount, parseBillingCycle } from '@/lib/plan-billing';
import { isWompiAmountValid, WOMPI_MIN_AMOUNT_COP } from '@/lib/wompi/config';

interface ChangeCheckoutBody {
  planId?: number;
  gateway?: 'mercadopago' | 'wompi';
  ciclo?: string;
  billingCycle?: string;
  returnOrigin?: string;
}

/** POST /api/instituciones/[id]/plan/change-checkout — inicia pago para cambiar de plan */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rate = checkRateLimit(request, 'plan-change-checkout', { max: 10, windowSec: 60 });
  if (!rate.ok) {
    return rateLimitResponse(rate.retryAfterSec ?? 60);
  }

  try {
    const { id } = await params;
    const institucionId = Number.parseInt(id, 10);
    if (Number.isNaN(institucionId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    let body: ChangeCheckoutBody;
    try {
      body = (await request.json()) as ChangeCheckoutBody;
    } catch {
      return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
    }

    const planId = body.planId;
    const gateway = body.gateway;
    if (!planId || !Number.isInteger(planId) || planId <= 0) {
      return NextResponse.json({ error: 'planId inválido' }, { status: 400 });
    }
    if (gateway !== 'mercadopago' && gateway !== 'wompi') {
      return NextResponse.json({ error: 'gateway inválido' }, { status: 400 });
    }

    const institucion = await withOwnerTenantDb(request, async (tx, userInstitutionId) => {
      enforceTenant(userInstitutionId, institucionId);

      const inst = await tx.instituciones.findUnique({
        where: { id: institucionId },
        select: { id: true, email: true, plan_id: true },
      });

      if (!inst) return null;

      const plan = await tx.plan.findFirst({
        where: { id: planId, activo: true },
        select: { id: true, nombre: true, precio: true },
      });

      if (!plan) {
        return { error: 'plan_not_found' as const };
      }

      if (inst.plan_id === planId) {
        return { error: 'same_plan' as const };
      }

      return { inst, plan };
    });

    if (!institucion) {
      return NextResponse.json({ error: 'Institución no encontrada' }, { status: 404 });
    }
    if ('error' in institucion) {
      if (institucion.error === 'plan_not_found') {
        return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Ya tiene ese plan contratado' }, { status: 400 });
    }

    const billingCycle = parseBillingCycle(body.billingCycle ?? body.ciclo);
    const monto = getPlanChargeAmount(institucion.plan.precio, billingCycle);
    if (gateway === 'wompi' && !isWompiAmountValid(monto)) {
      return NextResponse.json(
        {
          error: `Wompi exige un monto mínimo de $${WOMPI_MIN_AMOUNT_COP.toLocaleString('es-CO')} COP.`,
          code: 'WOMPI_MIN_AMOUNT',
        },
        { status: 400 }
      );
    }

    const checkout = await createInstitutionPlanCheckout({
      request,
      institucionId,
      email: institucion.inst.email,
      planId: institucion.plan.id,
      planNombre: institucion.plan.nombre,
      planPrecio: institucion.plan.precio,
      gateway,
      billingCycle: body.billingCycle ?? body.ciclo,
      returnOrigin: body.returnOrigin,
    });

    if (!checkout.ok) {
      return NextResponse.json(
        { error: checkout.error, code: checkout.code },
        { status: checkout.status }
      );
    }

    await writeAuditLog({
      usuario: institucion.inst.email,
      accion: 'CAMBIO_PLAN_INICIADO',
      metadata: {
        institucionId,
        planId: institucion.plan.id,
        gateway,
        referencia: checkout.referencia,
      },
      request,
    });

    return NextResponse.json({
      checkoutUrl: checkout.checkoutUrl,
      referencia: checkout.referencia,
      gateway,
      billingPeriod: checkout.billingPeriod,
      planNombre: institucion.plan.nombre,
    });
  } catch (error) {
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error en change-checkout:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
