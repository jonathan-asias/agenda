import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('=== INICIO ENDPOINT GRADOS-CURSOS ===');
    
    const body = await request.json();
    console.log('Body recibido:', JSON.stringify(body, null, 2));
    console.log('Tipo de body:', typeof body);
    console.log('Keys del body:', Object.keys(body));
    
    const { institucionId, grados, cursos } = body;
    console.log('Datos extraídos:', { 
      institucionId, 
      grados: grados?.length, 
      cursos: cursos?.length 
    });

    if (!institucionId) {
      throw new Error('institucionId es requerido');
    }

    if (!grados || !Array.isArray(grados)) {
      throw new Error('grados debe ser un array');
    }

    if (!cursos || !Array.isArray(cursos)) {
      throw new Error('cursos debe ser un array');
    }

    console.log('Datos validados:', { 
      institucionId, 
      gradosCount: grados.length, 
      cursosCount: cursos.length 
    });

    // Verificar que la institución existe
    const institucion = await prisma.instituciones.findUnique({
      where: { id: institucionId }
    });

    if (!institucion) {
      throw new Error(`Institución con ID ${institucionId} no encontrada`);
    }

    console.log('Institución encontrada:', institucion.nombre);

    // Verificar si ya existen grados para esta institución
    const gradosExistentes = await prisma.grados.findMany({
      where: { institucion_id: institucionId }
    });

    if (gradosExistentes.length > 0) {
      console.log('Ya existen grados para esta institución, eliminando...');
      // Primero eliminar cursos asociados
      await prisma.cursos.deleteMany({
        where: { institucion_id: institucionId }
      });
      // Luego eliminar grados
      await prisma.grados.deleteMany({
        where: { institucion_id: institucionId }
      });
    }

    // Validar que todos los grados tienen cursos
    const gradosSinCursos = grados.filter(grado => 
      !cursos.some(curso => curso.gradoId === grado.id)
    );
    
    if (gradosSinCursos.length > 0) {
      console.warn('Grados sin cursos detectados:', gradosSinCursos.map(g => g.nombre));
    }

    // Guardar solo los grados que tienen cursos
    console.log('Creando grados (solo los que tienen cursos)...');
    const gradosCreados = await Promise.all(
      grados.map(async (grado: any) => {
        console.log('Creando grado:', grado.nombre);
        return await prisma.grados.create({
          data: {
            nombre: grado.nombre,
            nivel: grado.nivel,
            orden: grado.orden,
            institucion_id: institucionId
          }
        });
      })
    );

    console.log('Grados creados exitosamente:', gradosCreados.length);

    // Crear un mapa de gradoId (del frontend) a id (de la base de datos)
    const gradoIdMap = new Map();
    gradosCreados.forEach(grado => {
      gradoIdMap.set(grado.orden, grado.id);
    });

    console.log('Mapa de grados:', Object.fromEntries(gradoIdMap));

    // Guardar cursos
    console.log('Creando cursos...');
    const cursosCreados = await Promise.all(
      cursos.map(async (curso: any) => {
        const gradoId = gradoIdMap.get(curso.gradoId);
        if (!gradoId) {
          throw new Error(`No se encontró el grado con orden ${curso.gradoId}`);
        }
        
        console.log(`Creando curso: ${curso.nombre} para grado ID: ${gradoId}`);
        return await prisma.cursos.create({
          data: {
            nombre: curso.nombre,
            grado_id: gradoId,
            institucion_id: institucionId
          }
        });
      })
    );

    console.log('Cursos creados exitosamente:', cursosCreados.length);

    const response = {
      success: true,
      grados: gradosCreados.length,
      cursos: cursosCreados.length,
      data: { gradosCreados, cursosCreados }
    };

    console.log('=== FIN ENDPOINT GRADOS-CURSOS ===');
    return NextResponse.json(response);

  } catch (error) {
    console.error('=== ERROR EN ENDPOINT GRADOS-CURSOS ===');
    console.error('Error completo:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al guardar',
        details: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

