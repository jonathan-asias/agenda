import { NextRequest, NextResponse } from 'next/server';
import { enforceTenant, tenantErrorToResponse } from '@/lib/tenant';
import { withTenantFromRequest } from '@/lib/db/with-tenant-request';
import { getInstitutionPlanInfo } from '@/lib/subscription/get-institution-plan';

/** GET /api/instituciones/[id]/plan — plan y suscripción de la institución */
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

    const info = await withTenantFromRequest(request, async (tx, userInstitutionId) => {
      enforceTenant(userInstitutionId, institucionId);
      return getInstitutionPlanInfo(tx, institucionId);
    });

    if (!info) {
      return NextResponse.json({ error: 'Institución no encontrada' }, { status: 404 });
    }

    return NextResponse.json(info);
  } catch (error) {
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error obteniendo plan de institución:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
