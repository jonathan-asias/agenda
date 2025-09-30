import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Token requerido' },
        { status: 400 }
      );
    }

    // Buscar el token en la base de datos
    const resetToken = await prisma.passwordResetTokens.findUnique({
      where: { token },
      select: {
        email: true,
        expiresAt: true,
        userType: true,
        used: true
      }
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Token no válido' },
        { status: 404 }
      );
    }

    // Verificar si el token ha expirado
    if (new Date() > resetToken.expiresAt) {
      // Eliminar el token expirado
      await prisma.passwordResetTokens.delete({
        where: { token }
      });
      return NextResponse.json(
        { error: 'Token expirado' },
        { status: 410 }
      );
    }

    // Verificar si el token ya fue usado
    if (resetToken.used) {
      return NextResponse.json(
        { error: 'Token ya utilizado' },
        { status: 410 }
      );
    }

    return NextResponse.json({
      valid: true,
      email: resetToken.email,
      userType: resetToken.userType
    });
  } catch (error) {
    console.error('Error validando token:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
