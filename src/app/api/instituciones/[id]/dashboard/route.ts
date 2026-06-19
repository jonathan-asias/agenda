import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import {
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import { withAdminSedeDb } from '@/lib/security/require-admin-api';
import {
  institutionSedeWhere,
  cursosSedeWhere,
  sedeErrorToResponse,
  sedeFilter,
} from '@/lib/sede-scope';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const institucionIdFromUrl = parseInt(id);

    if (isNaN(institucionIdFromUrl)) {
      return NextResponse.json(
        { error: 'ID de institución inválido' },
        { status: 400 }
      );
    }

    return await withAdminSedeDb(request, async (prisma, { institutionId: userInstitutionId, scope }) => {
    enforceTenant(userInstitutionId, institucionIdFromUrl);

    const baseWhere = institutionSedeWhere(userInstitutionId, scope);
    const cursoWhere = cursosSedeWhere(userInstitutionId, scope);
    const cursoNestedFilter = scope.allSedes ? undefined : { where: sedeFilter(scope) };

    // Obtener estadísticas básicas primero (solo institución/sede del usuario autenticado)
    const estadisticas = {
      areas: 0,
      materias: 0,
      grados: 0,
      cursos: 0,
      docentes: 0,
      estudiantes: 0
    };

    try {
      estadisticas.areas = await prisma.areas.count({ where: baseWhere });
    } catch (error) {
      console.error('Error counting areas:', error);
    }

    try {
      estadisticas.materias = await prisma.materias.count({ where: baseWhere });
    } catch (error) {
      console.error('Error counting materias:', error);
    }

    try {
      estadisticas.grados = await prisma.grados.count({ where: baseWhere });
    } catch (error) {
      console.error('Error counting grados:', error);
    }

    try {
      estadisticas.cursos = await prisma.cursos.count({ where: cursoWhere });
    } catch (error) {
      console.error('Error counting cursos:', error);
    }

    try {
      estadisticas.docentes = await prisma.docentes.count({
        where: { ...baseWhere, activo: true },
      });
    } catch (error) {
      console.error('Error counting docentes:', error);
    }

    try {
      estadisticas.estudiantes = await prisma.estudiantes.count({
        where: { ...baseWhere, activo: true },
      });
    } catch (error) {
      console.error('Error counting estudiantes:', error);
    }

    type AreasWithMaterias = Awaited<ReturnType<typeof prisma.areas.findMany>>;
    const materiasQuery = prisma.materias.findMany({
      where: baseWhere,
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
    type MateriasWithRelations = Awaited<typeof materiasQuery>;
    type GradosWithRelations = Awaited<ReturnType<typeof prisma.grados.findMany>>;
    type CursosWithRelations = Awaited<ReturnType<typeof prisma.cursos.findMany>>;
    type DocentesWithRelations = Prisma.DocentesGetPayload<{
      include: {
        sede: { select: { nombre: true } };
        docenteAsignaciones: {
          include: {
            grado: { select: { id: true; nombre: true; nivel: true } };
            curso: { select: { id: true; nombre: true } };
            materia: {
              select: {
                id: true;
                nombre: true;
                area: { select: { id: true; nombre: true } };
              };
            };
          };
        };
      };
    }>;
    type EstudiantesWithRelations = Awaited<ReturnType<typeof prisma.estudiantes.findMany>>;

    // Obtener datos detallados de forma individual
    let areas: AreasWithMaterias = [];
    let materias: MateriasWithRelations = [];
    let grados: GradosWithRelations = [];
    let cursos: CursosWithRelations = [];
    let docentes: DocentesWithRelations[] = [];
    let estudiantes: EstudiantesWithRelations = [];

    try {
      areas = await prisma.areas.findMany({
        where: baseWhere,
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
    } catch (error) {
      console.error('Error fetching areas:', error);
    }

    try {
      materias = await materiasQuery;
    } catch (error) {
      console.error('Error fetching materias:', error);
    }

    try {
      grados = await prisma.grados.findMany({
        where: baseWhere,
        include: {
          cursos: {
            ...(cursoNestedFilter ?? {}),
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
    } catch (error) {
      console.error('Error fetching grados:', error);
    }

    try {
      cursos = await prisma.cursos.findMany({
        where: cursoWhere,
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
        where: { ...baseWhere, activo: true },
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
                  id: true,
                  nombre: true,
                  nivel: true
                }
              },
              curso: {
                select: {
                  id: true,
                  nombre: true
                }
              },
              materia: {
                select: {
                  id: true,
                  nombre: true,
                  area: {
                    select: {
                      id: true,
                      nombre: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { nombres: 'asc' }
      });
    } catch (error) {
      console.error('Error fetching docentes:', error);
    }

    try {
      estudiantes = await prisma.estudiantes.findMany({
        where: { ...baseWhere, activo: true },
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
      sedeScope: scope.allSedes ? 'all' : scope.sedeId,
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

    return NextResponse.json(response);
    });

  } catch (error) {
    const sedeResp = sedeErrorToResponse(error);
    if (sedeResp) return sedeResp;
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
