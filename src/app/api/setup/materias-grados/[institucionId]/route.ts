import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { institucionId: string } }
) {
  try {
    const institucionId = parseInt(params.institucionId);

    if (isNaN(institucionId)) {
      return NextResponse.json(
        { success: false, error: 'ID de institución inválido' },
        { status: 400 }
      );
    }

    // Buscar materias-grados de la institución
    const materiasGrados = await prisma.materiaGrados.findMany({
      where: { 
        materia: {
          institucion_id: institucionId
        }
      },
      include: {
        materia: {
          select: {
            id: true,
            nombre: true,
            area_id: true
          }
        },
        grado: {
          select: {
            id: true,
            nombre: true,
            nivel: true
          }
        }
      },
      orderBy: [
        { grado: { nombre: 'asc' } },
        { materia: { nombre: 'asc' } }
      ]
    });

    return NextResponse.json({
      success: true,
      materiasGrados: materiasGrados
    });

  } catch (error) {
    console.error('Error cargando materias-grados:', error);
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
