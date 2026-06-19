import { NextRequest, NextResponse } from 'next/server';
import {
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';
import { withAdminSedeDb } from '@/lib/security/require-admin-api';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from '@/lib/supabase-admin';
import { sendSignupConfirmationEmail } from '@/lib/auth/send-signup-confirmation';
import {
  assertRecordBelongsToSede,
  sedeDataForCreate,
  sedeErrorToResponse,
} from '@/lib/sede-scope';

type DocenteInput = {
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  password: string;
};

type AsignacionMateriaInput = number | { id: number };

type AsignacionesPayload = {
  grados: Array<number | string>;
  cursos: Record<number | string, Array<number | string>>;
  materias: Record<number | string, Array<AsignacionMateriaInput | string>>;
};

export async function POST(request: NextRequest) {
  try {
    // Verificar variables de entorno

    if (!isSupabaseAdminConfigured()) {
      console.error('Supabase admin no estÃ¡ configurado. No se pueden crear docentes.');
      return NextResponse.json(
        { success: false, error: 'El servicio de autenticaciÃ³n no estÃ¡ configurado. Contacta al administrador.' },
        { status: 500 }
      );
    }

    const supabaseAdminClient = getSupabaseAdminClient();
    
    const body = await request.json() as {
      institucionId: number;
      docentes: DocenteInput[];
      asignaciones?: AsignacionesPayload;
    };
    
    const { institucionId, docentes, asignaciones } = body;
    
    
    // Validaciones bÃ¡sicas
    if (!institucionId) {
      return NextResponse.json(
        { success: false, error: 'institucionId es requerido' },
        { status: 400 }
      );
    }
    
    if (!docentes || !Array.isArray(docentes) || docentes.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Se requiere al menos un docente' },
        { status: 400 }
      );
    }
    
    // Verificar que la instituciÃ³n existe
        return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
const institucion = await tx.instituciones.findUnique({
      where: { id: institucionId }
    });
    
    if (!institucion) {
      return NextResponse.json(
        { success: false, error: 'Institución no encontrada' },
        { status: 404 }
      );
    }

    enforceTenant(institutionId, institucionId);
    
    const sedeData = sedeDataForCreate(scope);
    const sedeId = sedeData.sede_id;
    
    type DocenteCreadoResponse = {
      id: number;
      nombres: string;
      apellidos: string;
      email: string;
      auth_user_id?: string;
      asignaciones_creadas: number;
    };

    type ErrorRegistro = {
      docente: string;
      error: string;
      code?: string;
      details?: unknown;
      stack?: string;
    };

    const docentesCreados: DocenteCreadoResponse[] = [];
    const errores: ErrorRegistro[] = [];
    
    // Crear cada docente
    for (let i = 0; i < docentes.length; i++) {
      const docente = docentes[i];
      
      
      try {
        
               // 1. Crear usuario en Supabase Auth
               const { data: authData, error: authError } = await supabaseAdminClient.auth.admin.createUser({
                 email: docente.email,
                 password: docente.password,
                 email_confirm: true,
                 user_metadata: {
                   nombres: docente.nombres,
                   apellidos: docente.apellidos,
                   telefono: docente.telefono,
                   tipo: 'docente'
                 }
               });
        
        if (authError) {
          console.error('Error creando usuario en Auth:', authError);
          console.error('Detalles del error Auth:', JSON.stringify(authError, null, 2));
          
          let mensajeError = authError.message;
          if (authError.code === 'email_exists') {
            mensajeError = `El email ${docente.email} ya estÃ¡ registrado en el sistema`;
          }
          
          errores.push({
            docente: docente.email,
            error: `Error en Auth: ${mensajeError}`,
            code: authError.code,
            details: authError
          });
          continue;
        }
        
        
        // 2. Crear docente en la base de datos
        const docenteCreado = await tx.docentes.create({
          data: {
            nombres: docente.nombres,
            apellidos: docente.apellidos,
            telefono: docente.telefono,
            email: docente.email,
            sede_id: sedeId,
            institucion_id: institucionId,
            auth_user_id: authData.user?.id,
            activo: true
          }
        });
        
        
        // 3. Crear asignaciones si existen
        let asignacionesCreadas = 0;
        
        if (asignaciones && asignaciones.grados && asignaciones.grados.length > 0) {
          
          const asignacionesData: Array<{
            docente_id: number;
            grado_id: number;
            curso_id: number;
            materia_id: number;
          }> = [];
          
          // Para cada grado seleccionado
          asignaciones.grados.forEach((gradoId) => {
            const gradoKey = String(gradoId);
            const gradoNumber = Number(gradoId);
            if (!Number.isFinite(gradoNumber)) {
              return;
            }

            const cursos = asignaciones.cursos[gradoKey] ?? [];
            const materias = asignaciones.materias[gradoKey] ?? [];
            
            
            // Extraer IDs de materias (pueden ser objetos o nÃºmeros)
            const materiaIds = materias
              .map((materia): number | null => {
                if (typeof materia === 'object' && materia !== null && 'id' in materia) {
                  return Number((materia as { id: number }).id);
                }
                if (typeof materia === 'number') {
                  return materia;
                }
                return null;
              })
              .filter((id): id is number => id !== null && Number.isFinite(id));
            
            
            // Para cada curso del grado
            cursos.forEach((cursoIdRaw) => {
              const cursoId = Number(cursoIdRaw);
              if (!Number.isFinite(cursoId)) {
                return;
              }
              materiaIds.forEach((materiaId) => {
                asignacionesData.push({
                  docente_id: docenteCreado.id,
                  grado_id: gradoNumber,
                  curso_id: cursoId,
                  materia_id: materiaId
                });
              });
            });
          });

          if (asignacionesData.length > 0) {
            for (const asignacion of asignacionesData) {
              const [grado, curso, materia] = await Promise.all([
                tx.grados.findFirst({ where: { id: asignacion.grado_id, institucion_id: institucionId } }),
                tx.cursos.findFirst({ where: { id: asignacion.curso_id, institucion_id: institucionId } }),
                tx.materias.findFirst({ where: { id: asignacion.materia_id, institucion_id: institucionId } }),
              ]);
              if (!grado || !curso || !materia) continue;
              assertRecordBelongsToSede(grado.sede_id, scope);
              assertRecordBelongsToSede(curso.sede_id, scope);
              assertRecordBelongsToSede(materia.sede_id, scope);
            }

            try {
              const asignacionesCreadasResult = await tx.docenteAsignaciones.createMany({
                data: asignacionesData,
                skipDuplicates: true
              });
              
              asignacionesCreadas = asignacionesCreadasResult.count;
              
              // Crear relaciones MateriaGrados para que las materias aparezcan asignadas a grados
              const materiaGradosData: Array<{
                materia_id: number;
                grado_id: number;
              }> = [];
              
              // Para cada grado seleccionado
              asignaciones.grados.forEach((gradoId) => {
                const gradoKey = String(gradoId);
                const gradoNumber = Number(gradoId);
                if (!Number.isFinite(gradoNumber)) {
                  return;
                }

                const materiasPorGrado = asignaciones.materias[gradoKey] ?? [];
                
                materiasPorGrado.forEach((materia) => {
                  const materiaId = typeof materia === 'object' && materia !== null && 'id' in materia
                    ? Number((materia as { id: number }).id)
                    : typeof materia === 'number'
                      ? materia
                      : null;

                  if (materiaId !== null && Number.isFinite(materiaId)) {
                    materiaGradosData.push({
                      materia_id: materiaId,
                      grado_id: gradoNumber
                    });
                  }
                });
              });
              
              
              if (materiaGradosData.length > 0) {
                try {
                  const materiaGradosCreadas = await tx.materiaGrados.createMany({
                    data: materiaGradosData,
                    skipDuplicates: true
                  });
                  
                } catch (materiaGradosError) {
                  console.error('Error creando relaciones MateriaGrados:', materiaGradosError);
                  console.error('Stack trace del error de MateriaGrados:', materiaGradosError instanceof Error ? materiaGradosError.stack : 'No stack trace');
                  // No fallar por error en MateriaGrados, pero registrar el error
                }
              }
            } catch (asignError) {
              console.error('Error creando asignaciones:', asignError);
              console.error('Stack trace del error de asignaciones:', asignError instanceof Error ? asignError.stack : 'No stack trace');
              // No fallar por error en asignaciones, pero registrar el error
            }
          }
        } else {
        }
        
        docentesCreados.push({
          id: docenteCreado.id,
          nombres: docenteCreado.nombres,
          apellidos: docenteCreado.apellidos,
          email: docenteCreado.email,
          auth_user_id: authData.user?.id,
          asignaciones_creadas: asignacionesCreadas
        });
        
        await sendSignupConfirmationEmail(docente.email);
        
      } catch (error) {
        console.error(`Error creando docente ${docente.email}:`, error);
        console.error('Stack trace del error:', error instanceof Error ? error.stack : 'No stack trace');
        errores.push({
          docente: docente.email,
          error: error instanceof Error ? error.message : 'Error desconocido',
          stack: error instanceof Error ? error.stack : undefined
        });
      }
    }
    
    
    return NextResponse.json({
      success: true,
      message: `Se crearon ${docentesCreados.length} docente(s) exitosamente`,
      data: {
        docentesCreados,
        errores,
        total: docentes.length,
        exitosos: docentesCreados.length,
        fallidos: errores.length
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
    console.error('Error en endpoint docentes:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
