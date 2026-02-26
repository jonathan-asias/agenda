import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getAuthInstitutionId,
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

    // Institución SIEMPRE desde sesión autenticada; no se usa query ni body
    const estudiantes = await prisma.estudiantes.findMany({
      where: {
        curso_id: cursoId,
        institucion_id: userInstitutionId,
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

