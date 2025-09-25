import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email: emailParam } = await params;
    const email = decodeURIComponent(emailParam);

    if (!email || email.trim().length === 0) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    const institucion = await prisma.instituciones.findUnique({
      where: {
        email: email.trim()
      },
      include: {
        sedes: true,
        administradores: true
      }
    });

    if (!institucion) {
      return NextResponse.json(
        { error: 'Institución no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(institucion);
  } catch (error) {
    console.error('Error al buscar institución por email:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
