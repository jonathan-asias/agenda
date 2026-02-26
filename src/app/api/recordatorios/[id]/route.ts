import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getAuthInstitutionId,
  tenantErrorToResponse
} from '@/lib/tenant';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userInstitutionId = await getAuthInstitutionId(request);
    if (userInstitutionId == null) {
      return NextResponse.json({ error: 'Se requiere autenticación' }, { status: 401 });
    }

    const { id } = await params;
    const recordatorioId = parseInt(id);

    if (isNaN(recordatorioId)) {
      return NextResponse.json(
        { error: 'ID de recordatorio inválido' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { nombre, descripcion, fecha } = body;

    // Validaciones
    if (!nombre || !descripcion || !fecha) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos (nombre, descripcion, fecha)' },
        { status: 400 }
      );
    }

    // Verificar que el recordatorio existe y pertenece a la institución del usuario (vía docente)
    const recordatorio = await prisma.recordatorios.findFirst({
      where: {
        id: recordatorioId,
        docente: { institucion_id: userInstitutionId }
      }
    });

    if (!recordatorio) {
      return NextResponse.json(
        { error: 'Recordatorio no encontrado' },
        { status: 404 }
      );
    }

    // Convertir la fecha a DateTime
    const fechaDateTime = new Date(fecha);

    // Actualizar solo los campos permitidos (recordatorio ya validado por tenant)
    const recordatorioActualizado = await prisma.recordatorios.update({
      where: { id: recordatorioId },
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        fecha: fechaDateTime
      }
    });

    return NextResponse.json({
      success: true,
      recordatorio: {
        id: recordatorioActualizado.id,
        nombre: recordatorioActualizado.nombre,
        descripcion: recordatorioActualizado.descripcion,
        fecha: recordatorioActualizado.fecha,
        updated_at: recordatorioActualizado.updated_at
      }
    });
  } catch (error) {
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error actualizando recordatorio:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

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
    const recordatorioId = parseInt(id);

    if (isNaN(recordatorioId)) {
      return NextResponse.json(
        { error: 'ID de recordatorio inválido' },
        { status: 400 }
      );
    }

    // Verificar que el recordatorio existe y pertenece a la institución del usuario (vía docente)
    const recordatorio = await prisma.recordatorios.findFirst({
      where: {
        id: recordatorioId,
        docente: { institucion_id: userInstitutionId }
      }
    });

    if (!recordatorio) {
      return NextResponse.json(
        { error: 'Recordatorio no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar el recordatorio y sus relaciones en una transacción
    await prisma.$transaction(async (tx) => {
      // Eliminar las relaciones con estudiantes primero
      await tx.recordatorioEstudiantes.deleteMany({
        where: { recordatorio_id: recordatorioId }
      });

      // Eliminar el recordatorio (ya validado por tenant)
      await tx.recordatorios.delete({
        where: { id: recordatorioId }
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Recordatorio eliminado exitosamente'
    });
  } catch (error) {
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error eliminando recordatorio:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

