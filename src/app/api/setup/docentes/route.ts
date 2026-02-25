import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { APP_URL } from '@/lib/env';
import {
  getAuthInstitutionId,
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from '@/lib/supabase-admin';

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
    const userInstitutionId = await getAuthInstitutionId(request);
    if (userInstitutionId == null) {
      return NextResponse.json({ error: 'Se requiere autenticación' }, { status: 401 });
    }

    console.log('=== INICIANDO CREACIÓN DE DOCENTES ===');
    
    // Verificar variables de entorno
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configurada' : 'NO CONFIGURADA');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configurada' : 'NO CONFIGURADA');

    if (!isSupabaseAdminConfigured()) {
      console.error('Supabase admin no está configurado. No se pueden crear docentes.');
      return NextResponse.json(
        { success: false, error: 'El servicio de autenticación no está configurado. Contacta al administrador.' },
        { status: 500 }
      );
    }

    const supabaseAdminClient = getSupabaseAdminClient();
    
    const body = await request.json() as {
      institucionId: number;
      docentes: DocenteInput[];
      asignaciones?: AsignacionesPayload;
    };
    console.log('Datos recibidos:', JSON.stringify(body, null, 2));
    
    const { institucionId, docentes, asignaciones } = body;
    
    console.log('institucionId extraído:', institucionId);
    console.log('docentes extraídos:', docentes);
    console.log('Tipo de docentes:', typeof docentes);
    console.log('Es array:', Array.isArray(docentes));
    console.log('Longitud de docentes:', docentes?.length);
    
    // Validaciones básicas
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
    
    // Verificar que la institución existe
    const institucion = await prisma.instituciones.findUnique({
      where: { id: institucionId }
    });
    
    if (!institucion) {
      return NextResponse.json(
        { success: false, error: 'Institución no encontrada' },
        { status: 404 }
      );
    }

    enforceTenant(userInstitutionId, institucionId);
    
    // Obtener la sede principal o la sede del administrador
    let sedeId: number | null = null;
    
    // Buscar sedes de la institución
    const sedes = await prisma.sedes.findMany({
      where: { institucion_id: institucionId }
    });
    
    if (sedes.length > 0) {
      // Usar la primera sede (principal) o buscar la sede del administrador
      sedeId = sedes[0].id;
    }
    
    console.log('Sede asignada:', sedeId);
    
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
    console.log('Iniciando bucle de creación de docentes...');
    for (let i = 0; i < docentes.length; i++) {
      const docente = docentes[i];
      
      console.log(`=== PROCESANDO DOCENTE ${i + 1}/${docentes.length} ===`);
      console.log('Datos del docente:', JSON.stringify(docente, null, 2));
      
      try {
        console.log(`Creando docente ${i + 1}/${docentes.length}:`, docente.email);
        
               // 1. Crear usuario en Supabase Auth
               const { data: authData, error: authError } = await supabaseAdminClient.auth.admin.createUser({
                 email: docente.email,
                 password: docente.password,
                 email_confirm: false, // NO confirmar automáticamente para enviar correo
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
            mensajeError = `El email ${docente.email} ya está registrado en el sistema`;
          }
          
          errores.push({
            docente: docente.email,
            error: `Error en Auth: ${mensajeError}`,
            code: authError.code,
            details: authError
          });
          continue;
        }
        
        console.log('Usuario creado en Auth:', authData.user?.id);
        
        // 2. Crear docente en la base de datos
        console.log('Creando docente en BD con datos:', {
          nombres: docente.nombres,
          apellidos: docente.apellidos,
          telefono: docente.telefono,
          email: docente.email,
          sede_id: sedeId,
          institucion_id: institucionId,
          auth_user_id: authData.user?.id,
          activo: true
        });

        const docenteCreado = await prisma.docentes.create({
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
        
        console.log('Docente creado en BD:', docenteCreado.id);
        console.log('Docente creado completo:', JSON.stringify(docenteCreado, null, 2));
        
        // 3. Crear asignaciones si existen
        let asignacionesCreadas = 0;
        console.log('=== VERIFICANDO ASIGNACIONES ===');
        console.log('asignaciones existe:', !!asignaciones);
        console.log('asignaciones.grados existe:', !!(asignaciones && asignaciones.grados));
        console.log('asignaciones.grados.length:', asignaciones?.grados?.length || 0);
        
        if (asignaciones && asignaciones.grados && asignaciones.grados.length > 0) {
          console.log('Creando asignaciones para docente:', docenteCreado.id);
          console.log('Asignaciones recibidas:', JSON.stringify(asignaciones, null, 2));
          
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
            
            console.log(`Procesando grado ${gradoId}:`);
            console.log('- Cursos:', cursos);
            console.log('- Materias (objetos):', materias);
            
            // Extraer IDs de materias (pueden ser objetos o números)
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
            
            console.log('- Materias (IDs):', materiaIds);
            
            // Para cada curso del grado
            cursos.forEach((cursoIdRaw) => {
              const cursoId = Number(cursoIdRaw);
              if (!Number.isFinite(cursoId)) {
                return;
              }
              // Para cada materia del grado
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
          
          console.log('Asignaciones a crear:', JSON.stringify(asignacionesData, null, 2));
          
          if (asignacionesData.length > 0) {
            try {
              const asignacionesCreadasResult = await prisma.docenteAsignaciones.createMany({
                data: asignacionesData,
                skipDuplicates: true
              });
              
              asignacionesCreadas = asignacionesCreadasResult.count;
              console.log(`Asignaciones creadas para docente ${docenteCreado.id}: ${asignacionesCreadas}`);
              
              // Crear relaciones MateriaGrados para que las materias aparezcan asignadas a grados
              console.log('=== CREANDO RELACIONES MATERIA-GRADOS ===');
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
                console.log(`Procesando grado ${gradoId} con materias:`, materiasPorGrado);
                
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
              
              console.log('Relaciones MateriaGrados a crear:', JSON.stringify(materiaGradosData, null, 2));
              
              if (materiaGradosData.length > 0) {
                try {
                  const materiaGradosCreadas = await prisma.materiaGrados.createMany({
                    data: materiaGradosData,
                    skipDuplicates: true
                  });
                  
                  console.log(`Relaciones MateriaGrados creadas: ${materiaGradosCreadas.count}`);
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
          console.log('No se crearán asignaciones para este docente');
          console.log('Razón: asignaciones vacías o sin grados');
          console.log('asignaciones:', asignaciones);
        }
        
        docentesCreados.push({
          id: docenteCreado.id,
          nombres: docenteCreado.nombres,
          apellidos: docenteCreado.apellidos,
          email: docenteCreado.email,
          auth_user_id: authData.user?.id,
          asignaciones_creadas: asignacionesCreadas
        });
        
        // 4. Enviar correo de confirmación usando el cliente público (como los administradores)
        try {
          console.log(`Enviando correo de confirmación a: ${docente.email}`);
          const { error: emailError } = await supabaseAdminClient.auth.resend({
            type: 'signup',
            email: docente.email.toLowerCase().trim(),
            options: {
              emailRedirectTo: `${APP_URL}/login`
            }
          });

          if (emailError) {
            console.error('Error enviando correo de confirmación:', emailError);
            console.error('Detalles del error de correo:', JSON.stringify(emailError, null, 2));
            
            // Intentar método alternativo con generateLink
            console.log('Intentando método alternativo con generateLink...');
            const { error: linkError } = await supabaseAdminClient.auth.admin.generateLink({
              type: 'signup',
              email: docente.email.toLowerCase().trim(),
              password: docente.password,
              options: {
                  redirectTo: `${APP_URL}/login`
              }
            });

            if (linkError) {
              console.error('Error con método alternativo:', linkError);
            } else {
              console.log(`Correo enviado exitosamente a ${docente.email} (método alternativo)`);
            }
          } else {
            console.log(`Correo de confirmación enviado exitosamente a ${docente.email}`);
          }
        } catch (emailErr) {
          console.error('Error enviando correo de confirmación:', emailErr);
          console.error('Stack trace del error de correo:', emailErr instanceof Error ? emailErr.stack : 'No stack trace available');
        }
        
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
    
    console.log('=== RESULTADO FINAL ===');
    console.log('Docentes creados:', docentesCreados.length);
    console.log('Errores:', errores.length);
    
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
    
  } catch (error) {
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
