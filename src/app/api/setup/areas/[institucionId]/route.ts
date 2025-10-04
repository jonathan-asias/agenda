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

    // Buscar áreas de la institución
    const areas = await prisma.areas.findMany({
      where: { institucion_id: institucionId },
      orderBy: { nombre: 'asc' }
    });

    return NextResponse.json({
      success: true,
      areas: areas
    });

  } catch (error) {
    console.error('Error cargando áreas:', error);
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
