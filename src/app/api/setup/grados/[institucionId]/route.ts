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
    const institucionIdFromUrl = parseInt(institucionId);

    if (!institucionIdFromUrl || isNaN(institucionIdFromUrl)) {
      return NextResponse.json(
        { error: 'ID de institución inválido' },
        { status: 400 }
      );
    }

    enforceTenant(userInstitutionId, institucionIdFromUrl);

    // Listado SIEMPRE por sesión autenticada
    console.log('Cargando grados para institución (desde sesión):', userInstitutionId);

    const grados = await prisma.grados.findMany({
      where: { institucion_id: userInstitutionId },
      include: {
        cursos: {
          select: {
            id: true,
            nombre: true,
            grado_id: true
          }
        }
      },
      orderBy: { orden: 'asc' }
    });

    console.log('Grados encontrados:', grados.length);

    return NextResponse.json({
      success: true,
      grados: grados,
      total: grados.length
    });

  } catch (error) {
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error cargando grados:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cargar grados',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
