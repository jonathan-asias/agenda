import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const institucionId = parseInt(id);

    if (isNaN(institucionId)) {
      return NextResponse.json(
        { error: 'ID de institución inválido' },
        { status: 400 }
      );
    }

    console.log('Fetching dashboard data for institution:', institucionId);

    // Obtener estadísticas básicas primero
    const estadisticas = {
      areas: 0,
      materias: 0,
      grados: 0,
      cursos: 0,
      docentes: 0,
      estudiantes: 0
    };

    // Obtener conteos de forma individual para mejor manejo de errores
    try {
      estadisticas.areas = await prisma.areas.count({ where: { institucion_id: institucionId } });
    } catch (error) {
      console.error('Error counting areas:', error);
    }

    try {
      estadisticas.materias = await prisma.materias.count({ where: { institucion_id: institucionId } });
    } catch (error) {
      console.error('Error counting materias:', error);
    }

    try {
      estadisticas.grados = await prisma.grados.count({ where: { institucion_id: institucionId } });
    } catch (error) {
      console.error('Error counting grados:', error);
    }

    try {
      estadisticas.cursos = await prisma.cursos.count({ where: { institucion_id: institucionId } });
    } catch (error) {
      console.error('Error counting cursos:', error);
    }

    try {
      estadisticas.docentes = await prisma.docentes.count({ where: { institucion_id: institucionId, activo: true } });
    } catch (error) {
      console.error('Error counting docentes:', error);
    }

    try {
      estadisticas.estudiantes = await prisma.estudiantes.count({ where: { institucion_id: institucionId, activo: true } });
    } catch (error) {
      console.error('Error counting estudiantes:', error);
    }

    // Obtener datos detallados de forma individual
    let areas = [];
    let materias = [];
    let grados = [];
    let cursos = [];
    let docentes = [];
    let estudiantes = [];

    try {
      areas = await prisma.areas.findMany({
        where: { institucion_id: institucionId },
        include: {
          materias: {
            select: {
              id: true,
              nombre: true
            }
          }
        },
        orderBy: { orden: 'asc' }
      });
      console.log('Areas encontradas:', areas.length, areas);
    } catch (error) {
      console.error('Error fetching areas:', error);
    }

    try {
      materias = await prisma.materias.findMany({
        where: { institucion_id: institucionId },
        include: {
          area: {
            select: {
              nombre: true
            }
          },
          _count: {
            select: {
              materiaGrados: true
            }
          }
        },
        orderBy: { nombre: 'asc' }
      });
      console.log('Materias encontradas:', materias.length);
      console.log('Detalles de materias:', materias.map(m => ({
        id: m.id,
        nombre: m.nombre,
        area: m.area?.nombre,
        gradosCount: m._count?.materiaGrados
      })));
    } catch (error) {
      console.error('Error fetching materias:', error);
    }

    try {
      grados = await prisma.grados.findMany({
        where: { institucion_id: institucionId },
        include: {
          cursos: {
            select: {
              id: true,
              nombre: true,
              jornada: true
            }
          },
          _count: {
            select: {
              estudiantes: true
            }
          }
        },
        orderBy: { orden: 'asc' }
      });
      console.log('Grados encontrados:', grados.length, grados);
    } catch (error) {
      console.error('Error fetching grados:', error);
    }

    try {
      cursos = await prisma.cursos.findMany({
        where: { institucion_id: institucionId },
        include: {
          grado: {
            select: {
              nombre: true,
              nivel: true
            }
          },
          _count: {
            select: {
              estudiantes: true
            }
          }
        },
        orderBy: { nombre: 'asc' }
      });
    } catch (error) {
      console.error('Error fetching cursos:', error);
    }

    try {
      docentes = await prisma.docentes.findMany({
        where: { institucion_id: institucionId, activo: true },
        include: {
          sede: {
            select: {
              nombre: true
            }
          },
          docenteAsignaciones: {
            include: {
              grado: {
                select: {
                  nombre: true,
                  nivel: true
                }
              },
              curso: {
                select: {
                  nombre: true
                }
              },
              materia: {
                select: {
                  nombre: true
                }
              }
            }
          }
        },
        orderBy: { nombres: 'asc' }
      });
      console.log('Docentes encontrados:', docentes.length);
      console.log('Detalles de docentes con asignaciones:', docentes.map(d => ({
        id: d.id,
        nombre: `${d.nombres} ${d.apellidos}`,
        asignaciones: d.docenteAsignaciones.length,
        asignacionesDetalle: d.docenteAsignaciones.map(a => ({
          grado: a.grado.nombre,
          curso: a.curso.nombre,
          materia: a.materia.nombre
        }))
      })));
    } catch (error) {
      console.error('Error fetching docentes:', error);
    }

    try {
      estudiantes = await prisma.estudiantes.findMany({
        where: { institucion_id: institucionId, activo: true },
        include: {
          grado: {
            select: {
              nombre: true,
              nivel: true
            }
          },
          curso: {
            select: {
              nombre: true,
              jornada: true
            }
          }
        },
        orderBy: { nombres: 'asc' }
      });
    } catch (error) {
      console.error('Error fetching estudiantes:', error);
    }

    const response = {
      estadisticas,
      datos: {
        areas,
        materias,
        grados,
        cursos,
        docentes,
        estudiantes
      },
      resumen: {
        estudiantesPorGrado: grados,
        materiasPorArea: areas
      }
    };

    console.log('Respuesta completa del dashboard:', {
      estadisticas,
      gradosCount: grados.length,
      areasCount: areas.length,
      cursosCount: cursos.length,
      materiasCount: materias.length
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
