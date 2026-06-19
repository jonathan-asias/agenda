import { NextRequest, NextResponse } from 'next/server';
import {
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';
import { withAdminSedeDb } from '@/lib/security/require-admin-api';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import {
  assertRecordBelongsToSede,
  institutionSedeWhere,
  sedeErrorToResponse,
} from '@/lib/sede-scope';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const estudianteId = parseInt(id);

    if (isNaN(estudianteId)) {
      return NextResponse.json(
        { error: 'ID de estudiante inválido' },
        { status: 400 }
      );
    }

    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
      const estudiante = await tx.estudiantes.findFirst({
        where: { id: estudianteId, ...institutionSedeWhere(institutionId, scope) }
      });

      if (!estudiante) {
        return NextResponse.json(
          { error: 'Estudiante no encontrado' },
          { status: 404 }
        );
      }

      enforceTenant(institutionId, estudiante.institucion_id);
      assertRecordBelongsToSede(estudiante.sede_id, scope);

      await tx.estudiantes.delete({
        where: { id: estudianteId, institucion_id: institutionId }
      });

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
    });
  } catch (error) {
    const sedeResp = sedeErrorToResponse(error);
    if (sedeResp) return sedeResp;
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
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
    const { id } = await params;
    const estudianteId = parseInt(id);
    const body = await request.json();
    const {
      nombres,
      apellidos,
      codigo_estudiantil,
      nombre_acudiente,
      correo_acudiente,
      telefono_acudiente,
      grado_id,
      curso_id,
      activo
    } = body;

    if (isNaN(estudianteId)) {
      return NextResponse.json(
        { error: 'ID de estudiante inválido' },
        { status: 400 }
      );
    }

    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
      const estudianteExistente = await tx.estudiantes.findFirst({
        where: { id: estudianteId, ...institutionSedeWhere(institutionId, scope) }
      });

      if (!estudianteExistente) {
        return NextResponse.json(
          { error: 'Estudiante no encontrado' },
          { status: 404 }
        );
      }

      assertRecordBelongsToSede(estudianteExistente.sede_id, scope);

      if (curso_id) {
        const curso = await tx.cursos.findFirst({
          where: { id: curso_id, institucion_id: institutionId },
        });
        if (curso) assertRecordBelongsToSede(curso.sede_id, scope);
      }
      if (grado_id) {
        const grado = await tx.grados.findFirst({
          where: { id: grado_id, institucion_id: institutionId },
        });
        if (grado) assertRecordBelongsToSede(grado.sede_id, scope);
      }

      const estudianteActualizado = await tx.estudiantes.update({
        where: { id: estudianteId, institucion_id: institutionId },
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

      return NextResponse.json({
        success: true,
        message: 'Estudiante actualizado exitosamente',
        data: estudianteActualizado
      });
    });
  } catch (error) {
    const sedeResp = sedeErrorToResponse(error);
    if (sedeResp) return sedeResp;
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
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
    const { id } = await params;
    const estudianteId = parseInt(id);

    if (isNaN(estudianteId)) {
      return NextResponse.json(
        { error: 'ID de estudiante inválido' },
        { status: 400 }
      );
    }

    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
      const estudiante = await tx.estudiantes.findFirst({
        where: { id: estudianteId, ...institutionSedeWhere(institutionId, scope) },
        include: {
          grado: { select: { nombre: true, nivel: true } },
          curso: { select: { nombre: true, jornada: true } }
        }
      });

      if (!estudiante) {
        return NextResponse.json(
          { error: 'Estudiante no encontrado' },
          { status: 404 }
        );
      }

      enforceTenant(institutionId, estudiante.institucion_id);
      assertRecordBelongsToSede(estudiante.sede_id, scope);

      return NextResponse.json({
        success: true,
        data: estudiante
      });
    });
  } catch (error) {
    const sedeResp = sedeErrorToResponse(error);
    if (sedeResp) return sedeResp;
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
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
