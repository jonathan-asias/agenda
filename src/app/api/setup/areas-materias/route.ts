import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('=== INICIO ENDPOINT AREAS-MATERIAS ===');
    console.log('Request URL:', request.url);
    console.log('Request method:', request.method);
    
    let body;
    try {
      body = await request.json();
      console.log('Body recibido:', JSON.stringify(body, null, 2));
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error parsing JSON',
          details: jsonError instanceof Error ? jsonError.message : 'Error desconocido'
        },
        { status: 400 }
      );
    }
    
    const { institucionId, areas, materias } = body;

    if (!institucionId) {
      throw new Error('institucionId es requerido');
    }

    if (!areas || !Array.isArray(areas)) {
      throw new Error('areas debe ser un array');
    }

    if (!materias || !Array.isArray(materias)) {
      throw new Error('materias debe ser un array');
    }

    console.log('Datos validados:', { 
      institucionId, 
      areasCount: areas.length, 
      materiasCount: materias.length 
    });

    // Verificar que la institución existe
    const institucion = await prisma.instituciones.findUnique({
      where: { id: institucionId }
    });

    if (!institucion) {
      throw new Error(`Institución con ID ${institucionId} no encontrada`);
    }

    console.log('Institución encontrada:', institucion.nombre);

    // Verificar si ya existen áreas para esta institución
    const areasExistentes = await prisma.areas.findMany({
      where: { institucion_id: institucionId }
    });

    if (areasExistentes.length > 0) {
      console.log('Ya existen áreas para esta institución, eliminando...');
      // Primero eliminar materias asociadas
      await prisma.materias.deleteMany({
        where: { institucion_id: institucionId }
      });
      // Luego eliminar áreas
      await prisma.areas.deleteMany({
        where: { institucion_id: institucionId }
      });
    }

    // Guardar áreas
    console.log('Creando áreas...');
    const areasCreadas = await Promise.all(
      areas.map(async (area: any) => {
        console.log('Creando área:', area.nombre);
        return await prisma.areas.create({
          data: {
            nombre: area.nombre,
            es_opcional: area.es_opcional,
            orden: area.orden,
            institucion_id: institucionId,
            activa: true
          }
        });
      })
    );

    console.log('Áreas creadas exitosamente:', areasCreadas.length);

    // Crear un mapa de areaId (del frontend) a id (de la base de datos)
    const areaIdMap = new Map();
    areasCreadas.forEach(area => {
      areaIdMap.set(area.orden, area.id);
    });

    console.log('Mapa de áreas:', Object.fromEntries(areaIdMap));

    // Guardar materias
    console.log('Creando materias...');
    console.log('Datos de materias a crear:', JSON.stringify(materias, null, 2));
    console.log('Mapa de áreas:', Object.fromEntries(areaIdMap));
    
    // Crear materias una por una para evitar problemas de conexión
    const materiasCreadas = [];
    for (let i = 0; i < materias.length; i++) {
      const materia = materias[i];
      const areaId = areaIdMap.get(materia.areaId);
      
      if (!areaId) {
        throw new Error(`No se encontró el área con orden ${materia.areaId}`);
      }
      
      console.log(`Creando materia ${i + 1}/${materias.length}: ${materia.nombre} para área ID: ${areaId}`);
      console.log('Datos de la materia:', {
        nombre: materia.nombre,
        area_id: areaId,
        institucion_id: institucionId
      });
      
      try {
        const materiaCreada = await prisma.materias.create({
          data: {
            nombre: materia.nombre,
            area_id: areaId,
            institucion_id: institucionId
          }
        });
        materiasCreadas.push(materiaCreada);
        console.log(`Materia creada exitosamente: ${materiaCreada.nombre} (ID: ${materiaCreada.id})`);
        
        // Pequeño delay para evitar sobrecargar la conexión
        if (i < materias.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error('Error creando materia específica:', error);
        console.error('Datos que causaron el error:', {
          nombre: materia.nombre,
          area_id: areaId,
          institucion_id: institucionId
        });
        
        // Si es un error de conexión, intentar reconectar
        if (error instanceof Error && error.message.includes('prepared statement')) {
          console.log('Error de conexión detectado, intentando reconectar...');
          await prisma.$disconnect();
          await prisma.$connect();
          console.log('Reconectado, reintentando...');
          
          // Reintentar una vez
          try {
            const materiaCreada = await prisma.materias.create({
              data: {
                nombre: materia.nombre,
                area_id: areaId,
                institucion_id: institucionId
              }
            });
            materiasCreadas.push(materiaCreada);
            console.log(`Materia creada exitosamente en reintento: ${materiaCreada.nombre} (ID: ${materiaCreada.id})`);
          } catch (retryError) {
            console.error('Error en reintento:', retryError);
            throw retryError;
          }
        } else {
          throw error;
        }
      }
    }

    console.log('Materias creadas exitosamente:', materiasCreadas.length);

    const response = {
      success: true,
      areas: areasCreadas.length,
      materias: materiasCreadas.length,
      data: { areasCreadas, materiasCreadas }
    };

    console.log('=== FIN ENDPOINT AREAS-MATERIAS ===');
    return NextResponse.json(response);

  } catch (error) {
    console.error('=== ERROR EN ENDPOINT AREAS-MATERIAS ===');
    console.error('Error completo:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al guardar áreas y materias',
        details: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
