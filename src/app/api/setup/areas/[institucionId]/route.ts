import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getAuthInstitutionId,
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ institucionId: string }> }
) {
  try {
    const userInstitutionId = await getAuthInstitutionId(request);
    if (userInstitutionId == null) {
      return NextResponse.json({ error: 'Se requiere autenticación' }, { status: 401 });
    }

    const { institucionId } = await params;
    const idFromUrl = parseInt(institucionId);

    if (isNaN(idFromUrl)) {
      return NextResponse.json(
        { error: 'ID de institución inválido' },
        { status: 400 }
      );
    }

    enforceTenant(userInstitutionId, idFromUrl);

    // Listado SIEMPRE por sesión autenticada; no se confía en el parámetro de URL para los datos
    const areas = await prisma.areas.findMany({
      where: { institucion_id: userInstitutionId },
      orderBy: { orden: 'asc' }
    });

    return NextResponse.json({ areas });

  } catch (error) {
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error fetching areas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}