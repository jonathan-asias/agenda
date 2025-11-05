import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return NextResponse.json({ institutionId: null }, { status: 200 });
    }

    const normalizedEmail = email.trim();

    // Try admin first
    const admin = await prisma.administradores.findUnique({
      where: { correo: normalizedEmail },
      select: { institucion_id: true },
    });

    if (admin?.institucion_id) {
      return NextResponse.json({ institutionId: admin.institucion_id }, { status: 200 });
    }

    // Try docente
    const docente = await prisma.docentes.findUnique({
      where: { email: normalizedEmail },
      select: { institucion_id: true },
    });

    if (docente?.institucion_id) {
      return NextResponse.json({ institutionId: docente.institucion_id }, { status: 200 });
    }

    // Then institution by email
    const institucion = await prisma.instituciones.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (institucion?.id) {
      return NextResponse.json({ institutionId: institucion.id }, { status: 200 });
    }

    // Not found - but return 200 with null to avoid noisy 404 in client
    return NextResponse.json({ institutionId: null }, { status: 200 });
  } catch (error) {
    console.error('Error determining user institution:', error);
    // Even on server error, avoid 5xx leaking to client logs during login
    return NextResponse.json({ institutionId: null }, { status: 200 });
  }
}


