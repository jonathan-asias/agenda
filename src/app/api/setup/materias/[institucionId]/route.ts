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

    // Buscar materias de la institución
    const materias = await prisma.materias.findMany({
      where: { institucion_id: institucionId },
      orderBy: { nombre: 'asc' }
    });

    return NextResponse.json({
      success: true,
      materias: materias
    });

  } catch (error) {
    console.error('Error cargando materias:', error);
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
