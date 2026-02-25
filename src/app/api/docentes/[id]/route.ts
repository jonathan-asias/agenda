import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getAuthInstitutionId,
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';
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
    const docenteId = parseInt(id);

    if (isNaN(docenteId)) {
      return NextResponse.json(
        { error: 'ID de docente inválido' },
        { status: 400 }
      );
    }

    // Verificar que el docente existe
    const docente = await prisma.docentes.findUnique({
      where: { id: docenteId },
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

    enforceTenant(userInstitutionId, docente.institucion_id);

    console.log(`Iniciando eliminación del docente ${docente.nombres} ${docente.apellidos} (ID: ${docenteId})`);

    // Iniciar transacción para eliminar todas las relaciones
    const result = await prisma.$transaction(async (tx) => {
      // 1. Eliminar asignaciones de docente (DocenteAsignaciones)
      const deletedAsignaciones = await tx.docenteAsignaciones.deleteMany({
        where: { docente_id: docenteId }
      });
      console.log(`Eliminadas ${deletedAsignaciones.count} asignaciones de docente`);

      // 2. Eliminar relaciones MateriaGrados si existen
      // Primero obtenemos las materias asignadas al docente
      const materiasAsignadas = await tx.docenteAsignaciones.findMany({
        where: { docente_id: docenteId },
        select: { materia_id: true }
      });

      const materiaIds = materiasAsignadas.map(a => a.materia_id);
      
      if (materiaIds.length > 0) {
        // Eliminar relaciones MateriaGrados para las materias asignadas
        const deletedMateriaGrados = await tx.materiaGrados.deleteMany({
          where: {
            materia_id: { in: materiaIds }
          }
        });
        console.log(`Eliminadas ${deletedMateriaGrados.count} relaciones MateriaGrados`);
      }

      // 3. Eliminar el docente de la tabla docentes
      const deletedDocente = await tx.docentes.delete({
        where: { id: docenteId }
      });
      console.log(`Docente eliminado: ${deletedDocente.nombres} ${deletedDocente.apellidos}`);

      return {
        docente: deletedDocente,
        asignacionesEliminadas: deletedAsignaciones.count,
        materiaGradosEliminados: materiaIds.length > 0 ? (await tx.materiaGrados.count({
          where: { materia_id: { in: materiaIds } }
        })) : 0
      };
    });

    // 4. Eliminar usuario de Supabase Auth si tiene auth_user_id
    if (docente.auth_user_id) {
      console.log('Eliminando usuario de Supabase Auth con ID:', docente.auth_user_id);
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
          } else {
            console.log('Usuario eliminado exitosamente de Supabase Auth');
          }
        } catch (authError) {
          console.error('Error al eliminar usuario de Supabase Auth:', authError);
          console.error('Stack trace:', authError instanceof Error ? authError.stack : 'No stack trace available');
          // Continuamos con la eliminación de la base de datos aunque falle Supabase
        }
      }
    } else {
      console.log('No se encontró auth_user_id para el docente:', docente.id);
      console.log('Datos del docente:', {
        id: docente.id,
        nombres: docente.nombres,
        apellidos: docente.apellidos,
        email: docente.email,
        auth_user_id: docente.auth_user_id
      });
    }

    const supabaseAuthDeleted = !!docente.auth_user_id;
    
    console.log(`✅ Eliminación completada para el docente ${docente.nombres} ${docente.apellidos}`);
    console.log(`📊 Resumen de eliminaciones:`);
    console.log(`   - Asignaciones eliminadas: ${result.asignacionesEliminadas}`);
    console.log(`   - Relaciones MateriaGrados eliminadas: ${result.materiaGradosEliminados}`);
    console.log(`   - Docente eliminado de base de datos: ✅`);
    console.log(`   - Usuario eliminado de Supabase Auth: ${supabaseAuthDeleted ? '✅' : '❌ (No tenía auth_user_id)'}`);

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

  } catch (error) {
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
    const userInstitutionId = await getAuthInstitutionId(request);
    if (userInstitutionId == null) {
      return NextResponse.json({ error: 'Se requiere autenticación' }, { status: 401 });
    }

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

    // Verificar que el docente existe
    const docenteExistente = await prisma.docentes.findUnique({
      where: { id: docenteId }
    });

    if (!docenteExistente) {
      return NextResponse.json(
        { error: 'Docente no encontrado' },
        { status: 404 }
      );
    }

    enforceTenant(userInstitutionId, docenteExistente.institucion_id);

    // Actualizar datos del docente
    const docenteActualizado = await prisma.docentes.update({
      where: { id: docenteId },
      data: {
        nombres,
        apellidos,
        telefono
      }
    });

    // Si hay asignaciones, actualizarlas
    if (asignaciones) {
      // Eliminar asignaciones existentes
      await prisma.docenteAsignaciones.deleteMany({
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
        await prisma.docenteAsignaciones.createMany({
          data: nuevasAsignaciones
        });

        // Crear relaciones MateriaGrados para las materias asignadas
        const materiasUnicas = [...new Set(nuevasAsignaciones.map(a => a.materia_id))];
        const gradosUnicos = [...new Set(nuevasAsignaciones.map(a => a.grado_id))];

        for (const materiaId of materiasUnicas) {
          for (const gradoId of gradosUnicos) {
            // Verificar si la relación ya existe
            const existeRelacion = await prisma.materiaGrados.findFirst({
              where: {
                materia_id: materiaId,
                grado_id: gradoId
              }
            });

            if (!existeRelacion) {
              await prisma.materiaGrados.create({
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

  } catch (error) {
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