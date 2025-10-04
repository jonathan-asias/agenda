import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    console.log('=== INICIANDO CREACIÓN DE DOCENTES ===');
    
    // Verificar variables de entorno
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configurada' : 'NO CONFIGURADA');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configurada' : 'NO CONFIGURADA');
    
    const body = await request.json();
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
    
    const docentesCreados = [];
    const errores = [];
    
    // Crear cada docente
    console.log('Iniciando bucle de creación de docentes...');
    for (let i = 0; i < docentes.length; i++) {
      const docente = docentes[i];
      
      console.log(`=== PROCESANDO DOCENTE ${i + 1}/${docentes.length} ===`);
      console.log('Datos del docente:', JSON.stringify(docente, null, 2));
      
      try {
        console.log(`Creando docente ${i + 1}/${docentes.length}:`, docente.email);
        
               // 1. Crear usuario en Supabase Auth
               const { data: authData, error: authError } = await supabase.auth.admin.createUser({
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
          
          const asignacionesData = [];
          
          // Para cada grado seleccionado
          asignaciones.grados.forEach(gradoId => {
            const cursos = asignaciones.cursos[gradoId] || [];
            const materias = asignaciones.materias[gradoId] || [];
            
            console.log(`Procesando grado ${gradoId}:`);
            console.log('- Cursos:', cursos);
            console.log('- Materias (objetos):', materias);
            
            // Extraer IDs de materias (pueden ser objetos o números)
            const materiaIds = materias.map(materia => {
              if (typeof materia === 'object' && materia.id) {
                return materia.id;
              }
              return materia;
            }).filter(id => id != null);
            
            console.log('- Materias (IDs):', materiaIds);
            
            // Para cada curso del grado
            cursos.forEach(cursoId => {
              // Para cada materia del grado
              materiaIds.forEach(materiaId => {
                asignacionesData.push({
                  docente_id: docenteCreado.id,
                  grado_id: gradoId,
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
          const { error: emailError } = await supabase.auth.resend({
            type: 'signup',
            email: docente.email.toLowerCase().trim(),
            options: {
              emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login`
            }
          });

          if (emailError) {
            console.error('Error enviando correo de confirmación:', emailError);
            console.error('Detalles del error de correo:', JSON.stringify(emailError, null, 2));
            
            // Intentar método alternativo con generateLink
            console.log('Intentando método alternativo con generateLink...');
            const { error: linkError } = await supabase.auth.admin.generateLink({
              type: 'signup',
              email: docente.email.toLowerCase().trim(),
              password: docente.password,
              options: {
                redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login`
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
