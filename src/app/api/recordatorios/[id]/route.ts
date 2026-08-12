import { NextRequest, NextResponse } from 'next/server';
import { tenantErrorToResponse } from '@/lib/tenant';
import { withTenantFromRequest } from '@/lib/db/with-tenant-request';
import {
  assertDocenteOwnsRecordatorio,
  rbacErrorToResponse,
  requireInstitutionAuth,
} from '@/lib/security/rbac';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    if (!nombre || !descripcion || !fecha) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos (nombre, descripcion, fecha)' },
        { status: 400 }
      );
    }

    return await withTenantFromRequest(request, async (tx, userInstitutionId) => {
      const ctx = await requireInstitutionAuth(request);

      const recordatorio = await tx.recordatorios.findFirst({
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

      await assertDocenteOwnsRecordatorio(request, ctx, recordatorio.docente_id);

      if (recordatorio.tipo === 'autorizacion') {
        const respuestas = await tx.recordatorioEstudiantes.count({
          where: {
            recordatorio_id: recordatorioId,
            autorizacion_respuesta: { in: ['autorizado', 'no_autorizado'] },
          },
        });
        if (respuestas > 0) {
          return NextResponse.json(
            {
              error:
                'No se puede editar la autorización: ya hay respuestas de acudientes. Por seguridad queda bloqueada.',
            },
            { status: 409 }
          );
        }
      }

      const recordatorioActualizado = await tx.recordatorios.update({
        where: { id: recordatorioId },
        data: {
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          fecha: new Date(fecha)
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
    });
  } catch (error) {
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
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
    const { id } = await params;
    const recordatorioId = parseInt(id);

    if (isNaN(recordatorioId)) {
      return NextResponse.json(
        { error: 'ID de recordatorio inválido' },
        { status: 400 }
      );
    }

    return await withTenantFromRequest(request, async (tx, userInstitutionId) => {
      const ctx = await requireInstitutionAuth(request);

      const recordatorio = await tx.recordatorios.findFirst({
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

      await assertDocenteOwnsRecordatorio(request, ctx, recordatorio.docente_id);

      if (recordatorio.tipo === 'autorizacion') {
        const respuestas = await tx.recordatorioEstudiantes.count({
          where: {
            recordatorio_id: recordatorioId,
            autorizacion_respuesta: { in: ['autorizado', 'no_autorizado'] },
          },
        });
        if (respuestas > 0) {
          return NextResponse.json(
            {
              error:
                'No se puede eliminar la autorización: ya hay respuestas de acudientes. Por seguridad queda bloqueada.',
            },
            { status: 409 }
          );
        }
      }

      await tx.recordatorioEstudiantes.deleteMany({
        where: { recordatorio_id: recordatorioId }
      });
      await tx.recordatorios.delete({
        where: { id: recordatorioId }
      });

      return NextResponse.json({
        success: true,
        message: 'Recordatorio eliminado exitosamente'
      });
    });
  } catch (error) {
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error eliminando recordatorio:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
