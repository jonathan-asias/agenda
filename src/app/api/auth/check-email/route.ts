import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Verificar si el correo existe en administradores
    const existingAdmin = await prisma.administradores.findFirst({
      where: {
        correo: email.toLowerCase().trim()
      },
      select: {
        id: true,
        correo: true
      }
    });

    if (existingAdmin) {
      return NextResponse.json({
        available: false,
        message: 'Este correo ya está registrado'
      });
    }

    return NextResponse.json({
      available: true,
      message: 'Correo disponible'
    });
  } catch (error) {
    console.error('Error verificando email:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
