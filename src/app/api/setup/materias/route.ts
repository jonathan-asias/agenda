import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type MateriaInput = {
  nombre: string;
  area_id: number | string;
};

export async function POST(request: NextRequest) {
  try {
    const { institucionId, materias } = await request.json() as {
      institucionId: number;
      materias: MateriaInput[];
    };

    if (!institucionId || !materias || !Array.isArray(materias)) {
      return NextResponse.json(
        { error: 'institucionId y materias son requeridos' },
        { status: 400 }
      );
    }

    // Validar que todas las materias tengan los campos requeridos
    for (const materia of materias) {
      if (!materia.nombre || !materia.area_id) {
        return NextResponse.json(
          { error: 'Cada materia debe tener nombre y area_id' },
          { status: 400 }
        );
      }
    }

    // Verificar que la institución existe
    const institucion = await prisma.instituciones.findUnique({
      where: { id: institucionId }
    });

    if (!institucion) {
      return NextResponse.json(
        { error: 'Institución no encontrada' },
        { status: 404 }
      );
    }

    // Áreas predeterminadas (exactamente iguales que en SetupWizard)
    const areasPredeterminadas = [
      { id: 1, nombre: 'Ciencias naturales y educación ambiental', es_opcional: false, orden: 1 },
      { id: 2, nombre: 'Ciencias sociales, historia, geografía, constitución política y democracia', es_opcional: false, orden: 2 },
      { id: 3, nombre: 'Educación artística y cultural', es_opcional: false, orden: 3 },
      { id: 4, nombre: 'Educación ética y en valores humanos', es_opcional: false, orden: 4 },
      { id: 5, nombre: 'Educación física, recreación y deportes', es_opcional: false, orden: 5 },
      { id: 6, nombre: 'Educación religiosa', es_opcional: false, orden: 6 },
      { id: 7, nombre: 'Humanidades, lengua castellana e idiomas extranjeros', es_opcional: false, orden: 7 },
      { id: 8, nombre: 'Matemáticas', es_opcional: false, orden: 8 },
      { id: 9, nombre: 'Tecnología e informática', es_opcional: false, orden: 9 },
      { id: 10, nombre: 'Filosofía', es_opcional: true, orden: 10 },
      { id: 11, nombre: 'Educación sexual', es_opcional: true, orden: 11 },
      { id: 12, nombre: 'Cátedras y emprendimiento', es_opcional: true, orden: 12 },
      { id: 13, nombre: 'Comportamiento y disciplina', es_opcional: true, orden: 13 }
    ];

    type MateriaRecord = Awaited<ReturnType<typeof prisma.materias.create>>;
    const materiasCreadas: MateriaRecord[] = [];

    for (const materiaData of materias) {
      const areaId = Number(materiaData.area_id);

      if (!Number.isFinite(areaId)) {
        return NextResponse.json(
          { error: `Área con identificador ${materiaData.area_id} no es válida` },
          { status: 400 }
        );
      }

      // Buscar el área en las predeterminadas
      const areaPredeterminada = areasPredeterminadas.find(a => a.id === areaId);
      if (!areaPredeterminada) {
        return NextResponse.json(
          { error: `Área con ID ${areaId} no es válida` },
          { status: 400 }
        );
      }

      // Buscar el área existente en la base de datos por nombre e institución
      let area = await prisma.areas.findFirst({
        where: {
          nombre: areaPredeterminada.nombre,
          institucion_id: institucionId
        }
      });

      // Si no existe, crearla con un ID auto-generado
      if (!area) {
        console.log(`Creando nueva área: ${areaPredeterminada.nombre}`);
        area = await prisma.areas.create({
          data: {
            nombre: areaPredeterminada.nombre,
            es_opcional: areaPredeterminada.es_opcional,
            orden: areaPredeterminada.orden,
            institucion_id: institucionId,
            activa: true
          }
        });
        console.log(`Área creada con ID: ${area.id}`);
      } else {
        console.log(`Usando área existente: ${area.nombre} (ID: ${area.id})`);
      }

      console.log(`Creando materia: ${materiaData.nombre} para área: ${area.nombre} (ID: ${area.id})`);

      const materia = await prisma.materias.create({
        data: {
          nombre: materiaData.nombre,
          area_id: area.id, // Usar el ID real del área (existente o recién creada)
          institucion_id: institucionId
        }
      });

      console.log(`✅ Materia ${materia.nombre} creada exitosamente`);
      console.log(`📝 Nota: La materia debe ser asignada manualmente a grados desde el modal correspondiente`);

      materiasCreadas.push(materia);
    }

    return NextResponse.json({
      success: true,
      message: `${materiasCreadas.length} materia(s) creada(s) exitosamente`,
      materias: materiasCreadas
    });

  } catch (error) {
    console.error('Error creating materias:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
