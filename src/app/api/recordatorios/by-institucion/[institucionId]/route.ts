import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ institucionId: string }> }
) {
  try {
    const { institucionId: institucionIdParam } = await params;
    const institucionId = parseInt(institucionIdParam);

    if (!institucionId || isNaN(institucionId)) {
      return NextResponse.json({ error: 'ID de institución inválido' }, { status: 400 });
    }

    // Obtener todos los recordatorios de los docentes de la institución
    const recordatorios = await prisma.recordatorios.findMany({
      where: {
        docente: {
          institucion_id: institucionId
        }
      },
      include: {
        docente: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true
          }
        },
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
            nombre: true,
            jornada: true
          }
        },
        area: {
          select: {
            id: true,
            nombre: true
          }
        },
        materia: {
          select: {
            id: true,
            nombre: true
          }
        },
        estudiantes: {
          include: {
            estudiante: {
              select: {
                id: true,
                nombres: true,
                apellidos: true,
                codigo_estudiantil: true
              }
            }
          }
        }
      },
      orderBy: {
        fecha: 'asc'
      }
    });

    return NextResponse.json({ recordatorios });
  } catch (error) {
    console.error('Error buscando recordatorios:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

