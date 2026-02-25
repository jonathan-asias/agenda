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

    const { institucionId: institucionIdParam } = await params;
    const institucionId = parseInt(institucionIdParam);

    if (isNaN(institucionId)) {
      return NextResponse.json(
        { success: false, error: 'ID de institución inválido' },
        { status: 400 }
      );
    }

    enforceTenant(userInstitutionId, institucionId);

    // Buscar materias de la institución
    const materias = await prisma.materias.findMany({
      where: { institucion_id: institucionId },
      orderBy: { nombre: 'asc' }
    });

    return NextResponse.json({
      success: true,
      materias: materias
    });

  } catch (error) {
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error cargando materias:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
