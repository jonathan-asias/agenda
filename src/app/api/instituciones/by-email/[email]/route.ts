import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await params;
    const decodedEmail = decodeURIComponent(email || '').trim().toLowerCase();

    if (!decodedEmail) {
      return NextResponse.json({ exists: false, error: 'Email requerido' }, { status: 200 });
    }

    const institucion = await prisma.instituciones.findFirst({
      where: { email: decodedEmail },
      select: { id: true }
    });

    return NextResponse.json(
      { exists: Boolean(institucion), id: institucion?.id ?? null },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al verificar email de institución:', error);
    return NextResponse.json({ exists: false, error: 'Error interno del servidor' }, { status: 200 });
  }
}
