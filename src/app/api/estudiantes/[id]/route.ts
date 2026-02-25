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
    const estudianteId = parseInt(id);

    if (isNaN(estudianteId)) {
      return NextResponse.json(
        { error: 'ID de estudiante inválido' },
        { status: 400 }
      );
    }

    console.log(`Iniciando eliminación del estudiante con ID: ${estudianteId}`);

    // Verificar que el estudiante existe
    const estudiante = await prisma.estudiantes.findUnique({
      where: { id: estudianteId }
    });

    if (!estudiante) {
      return NextResponse.json(
        { error: 'Estudiante no encontrado' },
        { status: 404 }
      );
    }

    enforceTenant(userInstitutionId, estudiante.institucion_id);

    console.log(`Estudiante encontrado: ${estudiante.nombres} ${estudiante.apellidos}`);

    // Eliminar el estudiante de la base de datos
    await prisma.estudiantes.delete({
      where: { id: estudianteId }
    });

    console.log(`✅ Estudiante eliminado exitosamente: ${estudiante.nombres} ${estudiante.apellidos}`);

    return NextResponse.json({
      success: true,
      message: 'Estudiante eliminado exitosamente',
      data: {
        estudiante: {
          id: estudiante.id,
          nombres: estudiante.nombres,
          apellidos: estudiante.apellidos,
          codigo_estudiantil: estudiante.codigo_estudiantil
        }
      }
    });

  } catch (error) {
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error al eliminar estudiante:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor al eliminar el estudiante',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userInstitutionId = await getAuthInstitutionId(request);
    if (userInstitutionId == null) {
      return NextResponse.json({ error: 'Se requiere autenticación' }, { status: 401 });
    }

    const { id } = await params;
    const estudianteId = parseInt(id);
    const body = await request.json();
    const { nombres, apellidos, codigo_estudiantil, nombre_acudiente, correo_acudiente, telefono_acudiente, grado_id, curso_id, activo } = body;

    if (isNaN(estudianteId)) {
      return NextResponse.json(
        { error: 'ID de estudiante inválido' },
        { status: 400 }
      );
    }

    // Verificar que el estudiante existe
    const estudianteExistente = await prisma.estudiantes.findUnique({
      where: { id: estudianteId }
    });

    if (!estudianteExistente) {
      return NextResponse.json(
        { error: 'Estudiante no encontrado' },
        { status: 404 }
      );
    }

    enforceTenant(userInstitutionId, estudianteExistente.institucion_id);

    console.log(`Actualizando estudiante: ${estudianteExistente.nombres} ${estudianteExistente.apellidos}`);

    // Actualizar datos del estudiante
    const estudianteActualizado = await prisma.estudiantes.update({
      where: { id: estudianteId },
      data: {
        nombres,
        apellidos,
        codigo_estudiantil,
        nombre_acudiente,
        correo_acudiente: correo_acudiente || null,
        telefono_acudiente,
        grado_id,
        curso_id,
        activo
      }
    });

    console.log(`✅ Estudiante actualizado exitosamente: ${estudianteActualizado.nombres} ${estudianteActualizado.apellidos}`);

    return NextResponse.json({
      success: true,
      message: 'Estudiante actualizado exitosamente',
      data: estudianteActualizado
    });

  } catch (error) {
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error al actualizar estudiante:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor al actualizar el estudiante',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userInstitutionId = await getAuthInstitutionId(request);
    if (userInstitutionId == null) {
      return NextResponse.json({ error: 'Se requiere autenticación' }, { status: 401 });
    }

    const { id } = await params;
    const estudianteId = parseInt(id);

    if (isNaN(estudianteId)) {
      return NextResponse.json(
        { error: 'ID de estudiante inválido' },
        { status: 400 }
      );
    }

    // Obtener información del estudiante
    const estudiante = await prisma.estudiantes.findUnique({
      where: { id: estudianteId },
      include: {
        grado: {
          select: {
            nombre: true,
            nivel: true
          }
        },
        curso: {
          select: {
            nombre: true,
            jornada: true
          }
        }
      }
    });

    if (!estudiante) {
      return NextResponse.json(
        { error: 'Estudiante no encontrado' },
        { status: 404 }
      );
    }

    enforceTenant(userInstitutionId, estudiante.institucion_id);

    return NextResponse.json({
      success: true,
      data: estudiante
    });

  } catch (error) {
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error al obtener estudiante:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor al obtener el estudiante',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
