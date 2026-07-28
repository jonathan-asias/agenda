import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { enforceTenant, tenantErrorToResponse } from '@/lib/tenant';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import { subscriptionErrorToResponse } from '@/lib/security/subscription-guard';
import { resolveInstitutionSubscriptionAccess } from '@/lib/subscription/institution-access';
import { getSubscriptionGraceDays } from '@/lib/subscription/grace-period';
import { requireAuthInstitutionId } from '@/lib/tenant';
import { resolveRoleAndInstitutionFromUser } from '@/lib/auth/resolveTenantFromUser';

/** GET /api/instituciones/[id]/subscription-access — estado de acceso por suscripción */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const institucionId = Number.parseInt(id, 10);
    if (Number.isNaN(institucionId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const userInstitutionId = await requireAuthInstitutionId(request);
    enforceTenant(userInstitutionId, institucionId);

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const roleInfo = user ? await resolveRoleAndInstitutionFromUser(user) : null;
    const role = roleInfo?.institutionId === institucionId ? roleInfo.role : null;

    const access = await resolveInstitutionSubscriptionAccess(institucionId, role);

    return NextResponse.json({
      ...access,
      gracePeriodDays: getSubscriptionGraceDays(),
    });
  } catch (error) {
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const subResp = subscriptionErrorToResponse(error);
    if (subResp) return subResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error obteniendo acceso por suscripción:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
