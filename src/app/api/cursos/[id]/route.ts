import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getAuthInstitutionId,
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userInstitutionId = await getAuthInstitutionId(request);
    if (userInstitutionId == null) {
      return NextResponse.json({ error: 'Se requiere autenticación' }, { status: 401 });
    }

    const { id } = await params;
    const cursoId = Number.parseInt(id, 10);
    const institucionIdParam = request.nextUrl.searchParams.get('institucionId');
    const institucionId = institucionIdParam ? Number.parseInt(institucionIdParam, 10) : NaN;

    if (Number.isNaN(cursoId) || Number.isNaN(institucionId)) {
      return NextResponse.json(
        { error: 'ID de curso o institución inválido' },
        { status: 400 }
      );
    }

    const curso = await prisma.cursos.findFirst({
      where: { id: cursoId, institucion_id: institucionId }
    });

    if (!curso) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    enforceTenant(userInstitutionId, curso.institucion_id);

    await prisma.cursos.delete({
      where: { id: cursoId }
    });

    return NextResponse.json({
      success: true,
      message: 'Curso eliminado exitosamente',
      data: {
        id: curso.id,
        nombre: curso.nombre
      }
    });
  } catch (error) {
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error al eliminar curso:', error);
    return NextResponse.json(
      {
        error: 'Error interno del servidor al eliminar el curso',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
