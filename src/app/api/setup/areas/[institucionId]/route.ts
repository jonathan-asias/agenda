import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ institucionId: string }> }
) {
  try {
    const { institucionId } = await params;
    const id = parseInt(institucionId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de institución inválido' },
        { status: 400 }
      );
    }

    const areas = await prisma.areas.findMany({
      where: { institucion_id: id },
      orderBy: { orden: 'asc' }
    });

    return NextResponse.json({ areas });

  } catch (error) {
    console.error('Error fetching areas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}