import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('=== INICIANDO CREACIÓN DE ESTUDIANTES ===');
    
    const body = await request.json();
    console.log('Datos recibidos:', JSON.stringify(body, null, 2));
    
    const { institucionId, estudiantes } = body;
    
    console.log('institucionId extraído:', institucionId);
    console.log('estudiantes extraídos:', estudiantes);
    console.log('Tipo de estudiantes:', typeof estudiantes);
    console.log('Es array:', Array.isArray(estudiantes));
    console.log('Longitud de estudiantes:', estudiantes?.length);
    
    // Validaciones básicas
    if (!institucionId) {
      return NextResponse.json(
        { success: false, error: 'institucionId es requerido' },
        { status: 400 }
      );
    }
    
    if (!estudiantes || !Array.isArray(estudiantes) || estudiantes.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Se requiere al menos un estudiante' },
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
    
    const estudiantesCreados = [];
    const errores = [];
    
    // Crear cada estudiante
    console.log('Iniciando bucle de creación de estudiantes...');
    for (let i = 0; i < estudiantes.length; i++) {
      const estudiante = estudiantes[i];
      
      console.log(`=== PROCESANDO ESTUDIANTE ${i + 1}/${estudiantes.length} ===`);
      console.log('Datos del estudiante:', JSON.stringify(estudiante, null, 2));
      
      try {
        console.log(`Creando estudiante ${i + 1}/${estudiantes.length}:`, estudiante.codigo_estudiantil);
        
        // Crear estudiante en la base de datos
        console.log('Creando estudiante en BD con datos:', {
          nombres: estudiante.nombres,
          apellidos: estudiante.apellidos,
          codigo_estudiantil: estudiante.codigo_estudiantil,
          nombre_acudiente: estudiante.nombre_acudiente,
          correo_acudiente: estudiante.correo_acudiente,
          telefono_acudiente: estudiante.telefono_acudiente,
          grado_id: estudiante.grado_id,
          curso_id: estudiante.curso_id,
          institucion_id: institucionId,
          activo: true
        });

        const estudianteCreado = await prisma.estudiantes.create({
          data: {
            nombres: estudiante.nombres,
            apellidos: estudiante.apellidos,
            codigo_estudiantil: estudiante.codigo_estudiantil,
            nombre_acudiente: estudiante.nombre_acudiente,
            correo_acudiente: estudiante.correo_acudiente,
            telefono_acudiente: estudiante.telefono_acudiente,
            grado_id: estudiante.grado_id,
            curso_id: estudiante.curso_id,
            institucion_id: institucionId,
            activo: true
          }
        });
        
        console.log('Estudiante creado en BD:', estudianteCreado.id);
        console.log('Estudiante creado completo:', JSON.stringify(estudianteCreado, null, 2));
        
        estudiantesCreados.push({
          id: estudianteCreado.id,
          nombres: estudianteCreado.nombres,
          apellidos: estudianteCreado.apellidos,
          codigo_estudiantil: estudianteCreado.codigo_estudiantil,
          nombre_acudiente: estudianteCreado.nombre_acudiente,
          correo_acudiente: estudianteCreado.correo_acudiente,
          telefono_acudiente: estudianteCreado.telefono_acudiente,
          grado_id: estudianteCreado.grado_id,
          curso_id: estudianteCreado.curso_id
        });
        
      } catch (error) {
        console.error(`Error creando estudiante ${estudiante.codigo_estudiantil}:`, error);
        console.error('Stack trace del error:', error instanceof Error ? error.stack : 'No stack trace');
        errores.push({
          estudiante: estudiante.codigo_estudiantil,
          error: error instanceof Error ? error.message : 'Error desconocido',
          stack: error instanceof Error ? error.stack : undefined
        });
      }
    }
    
    console.log('=== RESULTADO FINAL ===');
    console.log('Estudiantes creados:', estudiantesCreados.length);
    console.log('Errores:', errores.length);
    
    return NextResponse.json({
      success: true,
      message: `Se crearon ${estudiantesCreados.length} estudiante(s) exitosamente`,
      data: {
        estudiantesCreados,
        errores,
        total: estudiantes.length,
        exitosos: estudiantesCreados.length,
        fallidos: errores.length
      }
    });
    
  } catch (error) {
    console.error('Error en endpoint estudiantes:', error);
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
