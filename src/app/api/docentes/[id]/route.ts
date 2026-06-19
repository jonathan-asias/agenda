import { NextRequest, NextResponse } from 'next/server';
import {
  tenantErrorToResponse
} from '@/lib/tenant';
import { withTenantFromRequest } from '@/lib/db/with-tenant-request';
import { withAdminSedeDb } from '@/lib/security/require-admin-api';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import {
  assertRecordBelongsToSede,
  institutionSedeWhere,
  sedeErrorToResponse,
} from '@/lib/sede-scope';
import {
  getSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from '@/lib/supabase-admin';

type AsignacionMateriaInput = number | { id: number };

type AsignacionesPayload = {
  grados: Array<number | string>;
  cursos: Record<number | string, Array<number | string>>;
  materias: Record<number | string, Array<AsignacionMateriaInput | string>>;
};

/** GET: devuelve un docente completo por ID (para edición). */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docenteId = parseInt(id, 10);
    if (!Number.isFinite(docenteId)) {
      return NextResponse.json({ error: 'ID de docente inválido' }, { status: 400 });
    }

    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
    const docente = await tx.docentes.findFirst({
      where: { id: docenteId, ...institutionSedeWhere(institutionId, scope) },
      include: {
        sede: { select: { id: true, nombre: true } },
        docenteAsignaciones: {
          include: {
            grado: { select: { id: true, nombre: true, nivel: true } },
            curso: { select: { id: true, nombre: true, jornada: true } },
            materia: {
              select: {
                id: true,
                nombre: true,
                area: { select: { id: true, nombre: true } }
              }
            }
          }
        }
      }
    });

    if (!docente) {
      return NextResponse.json({ error: 'Docente no encontrado' }, { status: 404 });
    }

    const payload = {
      id: docente.id,
      nombres: docente.nombres,
      apellidos: docente.apellidos,
      email: docente.email,
      telefono: docente.telefono,
      sede_id: docente.sede_id,
      activo: docente.activo,
      sede: docente.sede
        ? { id: docente.sede.id, nombre: docente.sede.nombre }
        : null,
      docenteAsignaciones: docente.docenteAsignaciones.map((a) => ({
        id: a.id,
        grado: {
          id: a.grado.id,
          nombre: a.grado.nombre,
          nivel: a.grado.nivel
        },
        curso: {
          id: a.curso.id,
          nombre: a.curso.nombre,
          jornada: a.curso.jornada
        },
        materia: {
          id: a.materia.id,
          nombre: a.materia.nombre,
          area: a.materia.area ? { id: a.materia.area.id, nombre: a.materia.area.nombre } : undefined
        }
      }))
    };

    return NextResponse.json(payload);
    });
  } catch (error) {
    const sedeResp = sedeErrorToResponse(error);
    if (sedeResp) return sedeResp;
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error al obtener docente:', error);
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
    const docenteId = parseInt(id);

    if (isNaN(docenteId)) {
      return NextResponse.json(
        { error: 'ID de docente inválido' },
        { status: 400 }
      );
    }

    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
    const docente = await tx.docentes.findFirst({
      where: { id: docenteId, ...institutionSedeWhere(institutionId, scope) },
      include: {
        docenteAsignaciones: true
      }
    });

    if (!docente) {
      return NextResponse.json(
        { error: 'Docente no encontrado' },
        { status: 404 }
      );
    }

    assertRecordBelongsToSede(docente.sede_id, scope);

    // Eliminar relaciones y docente
    const deletedAsignaciones = await tx.docenteAsignaciones.deleteMany({
      where: { docente_id: docenteId }
    });

    const materiasAsignadas = await tx.docenteAsignaciones.findMany({
      where: { docente_id: docenteId },
      select: { materia_id: true }
    });
    const materiaIds = materiasAsignadas.map((a) => a.materia_id);

    let materiaGradosEliminados = 0;
    if (materiaIds.length > 0) {
      const deletedMateriaGrados = await tx.materiaGrados.deleteMany({
        where: { materia_id: { in: materiaIds } }
      });
      materiaGradosEliminados = deletedMateriaGrados.count;
    }

    const deletedDocente = await tx.docentes.delete({
      where: { id: docenteId, institucion_id: institutionId }
    });

    const result = {
      docente: deletedDocente,
      asignacionesEliminadas: deletedAsignaciones.count,
      materiaGradosEliminados
    };

    // 4. Eliminar usuario de Supabase Auth si tiene auth_user_id
    if (docente.auth_user_id) {
      if (!isSupabaseAdminConfigured()) {
        console.error('Supabase admin no está configurado. No se eliminará el usuario en Auth.');
      } else {
        const supabaseAdminClient = getSupabaseAdminClient();
        try {
          const { error: authError } = await supabaseAdminClient.auth.admin.deleteUser(
            docente.auth_user_id
          );
          
          if (authError) {
            console.error('Error al eliminar usuario de Supabase Auth:', authError);
            console.error('Detalles del error:', JSON.stringify(authError, null, 2));
            // Continuamos con la eliminación de la base de datos aunque falle Supabase
          }
        } catch (authError) {
          console.error('Error al eliminar usuario de Supabase Auth:', authError);
          console.error('Stack trace:', authError instanceof Error ? authError.stack : 'No stack trace available');
          // Continuamos con la eliminación de la base de datos aunque falle Supabase
        }
      }
    }

    const supabaseAuthDeleted = !!docente.auth_user_id;

    return NextResponse.json({
      success: true,
      message: 'Docente eliminado exitosamente',
      data: {
        docente: {
          id: result.docente.id,
          nombres: result.docente.nombres,
          apellidos: result.docente.apellidos,
          email: result.docente.email
        },
        eliminaciones: {
          asignaciones: result.asignacionesEliminadas,
          materiaGrados: result.materiaGradosEliminados,
          supabaseAuth: supabaseAuthDeleted
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
    console.error('Error al eliminar docente:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor al eliminar el docente',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// Método PUT para actualizar docente (ya existente)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docenteId = parseInt(id);
    const body = await request.json() as {
      nombres: string;
      apellidos: string;
      telefono: string;
      asignaciones?: AsignacionesPayload;
    };
    const { nombres, apellidos, telefono, asignaciones } = body;

    if (isNaN(docenteId)) {
      return NextResponse.json(
        { error: 'ID de docente inválido' },
        { status: 400 }
      );
    }

    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
    const docenteExistente = await tx.docentes.findFirst({
      where: { id: docenteId, ...institutionSedeWhere(institutionId, scope) }
    });

    if (!docenteExistente) {
      return NextResponse.json(
        { error: 'Docente no encontrado' },
        { status: 404 }
      );
    }

    assertRecordBelongsToSede(docenteExistente.sede_id, scope);

    const docenteActualizado = await tx.docentes.update({
      where: { id: docenteId, institucion_id: institutionId },
      data: {
        nombres,
        apellidos,
        telefono
      }
    });

    // Si hay asignaciones, actualizarlas
    if (asignaciones) {
      // Eliminar asignaciones existentes
      await tx.docenteAsignaciones.deleteMany({
        where: { docente_id: docenteId }
      });

      // Crear nuevas asignaciones
      const nuevasAsignaciones: Array<{
        docente_id: number;
        grado_id: number;
        curso_id: number;
        materia_id: number;
      }> = [];

      for (const gradoId of asignaciones.grados) {
        const gradoKey = String(gradoId);
        const gradoNumber = Number(gradoId);
        if (!Number.isFinite(gradoNumber)) {
          continue;
        }

        const cursosDelGrado = asignaciones.cursos[gradoKey] ?? [];
        const materiasDelGradoRaw = asignaciones.materias[gradoKey] ?? [];

        const materiasDelGrado = materiasDelGradoRaw
          .map((materia): number | null => {
            if (typeof materia === 'object' && materia !== null && 'id' in materia) {
              return Number((materia as { id: number }).id);
            }
            if (typeof materia === 'number') {
              return materia;
            }
            return null;
          })
          .filter((materiaId): materiaId is number => materiaId !== null && Number.isFinite(materiaId));

        for (const cursoIdRaw of cursosDelGrado) {
          const cursoId = Number(cursoIdRaw);
          if (!Number.isFinite(cursoId)) {
            continue;
          }

          for (const materiaId of materiasDelGrado) {
            nuevasAsignaciones.push({
              docente_id: docenteId,
              grado_id: gradoNumber,
              curso_id: cursoId,
              materia_id: materiaId
            });
          }
        }
      }

      if (nuevasAsignaciones.length > 0) {
        for (const asignacion of nuevasAsignaciones) {
          const [grado, curso, materia] = await Promise.all([
            tx.grados.findFirst({ where: { id: asignacion.grado_id, institucion_id: institutionId } }),
            tx.cursos.findFirst({ where: { id: asignacion.curso_id, institucion_id: institutionId } }),
            tx.materias.findFirst({ where: { id: asignacion.materia_id, institucion_id: institutionId } }),
          ]);
          if (!grado || !curso || !materia) continue;
          assertRecordBelongsToSede(grado.sede_id, scope);
          assertRecordBelongsToSede(curso.sede_id, scope);
          assertRecordBelongsToSede(materia.sede_id, scope);
        }

        await tx.docenteAsignaciones.createMany({
          data: nuevasAsignaciones
        });

        // Crear relaciones MateriaGrados para las materias asignadas
        const materiasUnicas = [...new Set(nuevasAsignaciones.map(a => a.materia_id))];
        const gradosUnicos = [...new Set(nuevasAsignaciones.map(a => a.grado_id))];

        for (const materiaId of materiasUnicas) {
          for (const gradoId of gradosUnicos) {
            // Verificar si la relación ya existe
            const existeRelacion = await tx.materiaGrados.findFirst({
              where: {
                materia_id: materiaId,
                grado_id: gradoId
              }
            });

            if (!existeRelacion) {
              await tx.materiaGrados.create({
                data: {
                  materia_id: materiaId,
                  grado_id: gradoId
                }
              });
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Docente actualizado exitosamente',
      data: docenteActualizado
    });
    });

  } catch (error) {
    const sedeResp = sedeErrorToResponse(error);
    if (sedeResp) return sedeResp;
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error al actualizar docente:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor al actualizar el docente',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}