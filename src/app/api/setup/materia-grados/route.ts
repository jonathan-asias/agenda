import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('=== INICIO ENDPOINT MATERIA-GRADOS ===');
    
    const body = await request.json();
    console.log('Body recibido:', JSON.stringify(body, null, 2));
    
    const { institucionId, asignaciones } = body;

    if (!institucionId) {
      throw new Error('institucionId es requerido');
    }

    if (!asignaciones || !Array.isArray(asignaciones)) {
      throw new Error('asignaciones debe ser un array');
    }

    console.log('Datos validados:', { 
      institucionId, 
      asignacionesCount: asignaciones.length 
    });

    // Verificar que la institución existe
    const institucion = await prisma.instituciones.findUnique({
      where: { id: institucionId }
    });

    if (!institucion) {
      throw new Error(`Institución con ID ${institucionId} no encontrada`);
    }

    console.log('Institución encontrada:', institucion.nombre);

    // Eliminar asignaciones existentes para esta institución
    const asignacionesExistentes = await prisma.materiaGrados.findMany({
      where: {
        materia: {
          institucion_id: institucionId
        }
      }
    });

    if (asignacionesExistentes.length > 0) {
      console.log('Eliminando asignaciones existentes...');
      await prisma.materiaGrados.deleteMany({
        where: {
          materia: {
            institucion_id: institucionId
          }
        }
      });
    }

    // Validar que las materias y grados existen
    console.log('Validando materias y grados...');
    for (const asignacion of asignaciones) {
      // Verificar que la materia existe
      const materia = await prisma.materias.findUnique({
        where: { id: asignacion.materiaId }
      });
      
      if (!materia) {
        throw new Error(`Materia con ID ${asignacion.materiaId} no encontrada`);
      }
      
      // Verificar que el grado existe
      const grado = await prisma.grados.findUnique({
        where: { id: asignacion.gradoId }
      });
      
      if (!grado) {
        throw new Error(`Grado con ID ${asignacion.gradoId} no encontrado`);
      }
      
      console.log(`Validado: Materia "${materia.nombre}" (ID: ${asignacion.materiaId}) -> Grado "${grado.nombre}" (ID: ${asignacion.gradoId})`);
    }

    // Crear nuevas asignaciones
    console.log('Creando asignaciones materia-grado...');
    const asignacionesCreadas = await Promise.all(
      asignaciones.map(async (asignacion: any) => {
        console.log(`Asignando materia ${asignacion.materiaId} al grado ${asignacion.gradoId}`);
        
        try {
          return await prisma.materiaGrados.create({
            data: {
              materia_id: asignacion.materiaId,
              grado_id: asignacion.gradoId
            }
          });
        } catch (createError) {
          console.error('Error creando asignación específica:', createError);
          console.error('Datos que causaron el error:', asignacion);
          throw createError;
        }
      })
    );

    console.log('Asignaciones creadas exitosamente:', asignacionesCreadas.length);

    const response = {
      success: true,
      asignaciones: asignacionesCreadas.length,
      data: { asignacionesCreadas }
    };

    console.log('=== FIN ENDPOINT MATERIA-GRADOS ===');
    return NextResponse.json(response);

  } catch (error) {
    console.error('=== ERROR EN ENDPOINT MATERIA-GRADOS ===');
    console.error('Error completo:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al asignar materias a grados',
        details: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
