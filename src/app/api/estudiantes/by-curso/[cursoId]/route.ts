import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getAuthInstitutionId,
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cursoId: string }> }
) {
  try {
    const userInstitutionId = await getAuthInstitutionId(request);
    if (userInstitutionId == null) {
      return NextResponse.json({ error: 'Se requiere autenticación' }, { status: 401 });
    }

    const { cursoId: cursoIdParam } = await params;
    const cursoId = parseInt(cursoIdParam);

    if (!cursoId || isNaN(cursoId)) {
      return NextResponse.json({ error: 'ID de curso inválido' }, { status: 400 });
    }

    // Obtener institucion_id desde query params
    const { searchParams } = new URL(request.url);
    const institucionId = searchParams.get('institucionId');

    if (!institucionId) {
      return NextResponse.json({ error: 'ID de institución es requerido' }, { status: 400 });
    }

    const institucionIdNum = parseInt(institucionId);
    if (isNaN(institucionIdNum)) {
      return NextResponse.json({ error: 'ID de institución inválido' }, { status: 400 });
    }

    enforceTenant(userInstitutionId, institucionIdNum);

    const estudiantes = await prisma.estudiantes.findMany({
      where: {
        curso_id: cursoId,
        institucion_id: institucionIdNum,
        activo: true
      },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        codigo_estudiantil: true
      },
      orderBy: [
        { apellidos: 'asc' },
        { nombres: 'asc' }
      ]
    });

    return NextResponse.json({ estudiantes });
  } catch (error) {
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error buscando estudiantes:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

