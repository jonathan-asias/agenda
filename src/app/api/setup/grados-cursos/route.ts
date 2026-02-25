import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getAuthInstitutionId,
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';

type CursoInput = {
  nombre: string;
};

type GradoCursoInput = {
  grado_id: number;
  cursos: CursoInput[];
};

export async function POST(request: NextRequest) {
  try {
    const userInstitutionId = await getAuthInstitutionId(request);
    if (userInstitutionId == null) {
      return NextResponse.json({ error: 'Se requiere autenticación' }, { status: 401 });
    }

    const { institucionId, gradosCursos } = await request.json() as {
      institucionId: number;
      gradosCursos: GradoCursoInput[];
    };

    if (!institucionId || !gradosCursos || !Array.isArray(gradosCursos)) {
      return NextResponse.json(
        { error: 'institucionId y gradosCursos son requeridos' },
        { status: 400 }
      );
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

    enforceTenant(userInstitutionId, institucionId);

    const nombresCursos = gradosCursos
      .flatMap(gradoCurso => gradoCurso.cursos.map(curso => curso.nombre?.trim()))
      .filter((nombre): nombre is string => Boolean(nombre));

    const nombresNormalizados = nombresCursos.map(nombre => nombre.toLowerCase());
    const duplicadosEnPayload = nombresCursos.filter((nombre, index) => {
      return nombresNormalizados.indexOf(nombre.toLowerCase()) !== index;
    });

    if (duplicadosEnPayload.length > 0) {
      return NextResponse.json(
        {
          error: 'Ya existen cursos duplicados en la lista enviada',
          duplicateNames: Array.from(new Set(duplicadosEnPayload))
        },
        { status: 409 }
      );
    }

    if (nombresCursos.length > 0) {
      const cursosExistentes = await prisma.cursos.findMany({
        where: {
          institucion_id: institucionId,
          OR: nombresCursos.map(nombre => ({
            nombre: { equals: nombre, mode: 'insensitive' }
          }))
        },
        select: { nombre: true }
      });

      if (cursosExistentes.length > 0) {
        const duplicateNames = Array.from(
          new Set(cursosExistentes.map(curso => curso.nombre))
        );
        return NextResponse.json(
          {
            error: 'Ya existen cursos con el mismo nombre en la institución',
            duplicateNames
          },
          { status: 409 }
        );
      }
    }

    // Grados predeterminados (mismos que en el modal)
    const gradosPredeterminados = [
      { id: 1, nombre: 'PÁRVULOS', nivel: 'Educación Inicial', orden: 1 },
      { id: 2, nombre: 'PRE-JARDÍN', nivel: 'Educación Inicial', orden: 2 },
      { id: 3, nombre: 'JARDÍN', nivel: 'Educación Inicial', orden: 3 },
      { id: 4, nombre: 'TRANSICIÓN', nivel: 'Educación Inicial', orden: 4 },
      { id: 5, nombre: '1°', nivel: 'Primaria', orden: 5 },
      { id: 6, nombre: '2°', nivel: 'Primaria', orden: 6 },
      { id: 7, nombre: '3°', nivel: 'Primaria', orden: 7 },
      { id: 8, nombre: '4°', nivel: 'Primaria', orden: 8 },
      { id: 9, nombre: '5°', nivel: 'Primaria', orden: 9 },
      { id: 10, nombre: '6°', nivel: 'Secundaria', orden: 10 },
      { id: 11, nombre: '7°', nivel: 'Secundaria', orden: 11 },
      { id: 12, nombre: '8°', nivel: 'Secundaria', orden: 12 },
      { id: 13, nombre: '9°', nivel: 'Secundaria', orden: 13 },
      { id: 14, nombre: '10°', nivel: 'Media', orden: 14 },
      { id: 15, nombre: '11°', nivel: 'Media', orden: 15 }
    ];

    type CursoRecord = Awaited<ReturnType<typeof prisma.cursos.create>>;
    type GradoRecord = Awaited<ReturnType<typeof prisma.grados.create>>;

    const cursosCreados: CursoRecord[] = [];
    const gradosCreados: GradoRecord[] = [];

    for (const gradoCurso of gradosCursos) {
      const gradoId = gradoCurso.grado_id;

      // Buscar el grado en los predeterminados
      const gradoPredeterminado = gradosPredeterminados.find(g => g.id === gradoId);
      if (!gradoPredeterminado) {
        return NextResponse.json(
          { error: `Grado con ID ${gradoId} no es válido` },
          { status: 400 }
        );
      }

      // Verificar si el grado ya existe en la base de datos
      let grado = await prisma.grados.findFirst({
        where: {
          nombre: gradoPredeterminado.nombre,
          institucion_id: institucionId
        }
      });

      // Si no existe, crearlo
      if (!grado) {
        console.log(`Creando grado: ${gradoPredeterminado.nombre} (${gradoPredeterminado.nivel})`);
        grado = await prisma.grados.create({
          data: {
            nombre: gradoPredeterminado.nombre,
            nivel: gradoPredeterminado.nivel,
            orden: gradoPredeterminado.orden,
            institucion_id: institucionId
          }
        });
        console.log(`Grado creado con ID: ${grado.id}`);
        gradosCreados.push(grado);
      } else {
        console.log(`Usando grado existente: ${grado.nombre} (ID: ${grado.id})`);
      }

      // Crear los cursos para este grado
      for (const cursoData of gradoCurso.cursos) {
        console.log(`Creando curso: ${cursoData.nombre} para grado: ${grado.nombre}`);

        const curso = await prisma.cursos.create({
          data: {
            nombre: cursoData.nombre,
            grado_id: grado.id,
            institucion_id: institucionId
          }
        });

        cursosCreados.push(curso);
        console.log(`✅ Curso ${curso.nombre} creado exitosamente`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${cursosCreados.length} curso(s) creado(s) exitosamente`,
      data: {
        gradosCreados: gradosCreados || [],
        cursosCreados: cursosCreados
      }
    });

  } catch (error) {
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error creating cursos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}