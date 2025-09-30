import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { supabase } from '../../../../../lib/supabase';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, userType } = body;

    if (!email || !userType) {
      return NextResponse.json(
        { error: 'Email y tipo de usuario son requeridos' },
        { status: 400 }
      );
    }

    // Validar tipo de usuario
    if (!['institucion', 'administrador', 'docente'].includes(userType)) {
      return NextResponse.json(
        { error: 'Tipo de usuario inválido' },
        { status: 400 }
      );
    }

    let user = null;
    let userData = null;

    // Buscar el usuario según el tipo
    switch (userType) {
      case 'institucion':
        userData = await prisma.instituciones.findUnique({
          where: { email: email.toLowerCase().trim() }
        });
        break;
      case 'administrador':
        userData = await prisma.administradores.findUnique({
          where: { correo: email.toLowerCase().trim() },
          include: {
            institucion: {
              select: { nombre: true }
            }
          }
        });
        break;
      case 'docente':
        // TODO: Implementar cuando se agregue el modelo de docentes
        return NextResponse.json(
          { error: 'Funcionalidad de docentes no implementada aún' },
          { status: 501 }
        );
    }

    if (!userData) {
      // Por seguridad, no revelamos si el email existe o no
      return NextResponse.json(
        { message: 'Si el email existe, recibirás un enlace de recuperación' },
        { status: 200 }
      );
    }

    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Guardar el token en la base de datos
    await prisma.passwordResetTokens.create({
      data: {
        email: email.toLowerCase().trim(),
        token: resetToken,
        expiresAt,
        userType
      }
    });

    // Crear enlace de recuperación
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/resetear-contrasena/${resetToken}`;

    // Enviar email usando Supabase Auth
    try {
      const { error: emailError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetLink,
      });

      if (emailError) {
        console.error('Error enviando email:', emailError);
        // Limpiar el token si falla el envío
        await prisma.passwordResetTokens.deleteMany({
          where: { token: resetToken }
        });
        return NextResponse.json(
          { error: 'Error al enviar el email de recuperación' },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error('Error en envío de email:', error);
      // Limpiar el token si falla el envío
      await prisma.passwordResetTokens.deleteMany({
        where: { token: resetToken }
      });
      return NextResponse.json(
        { error: 'Error al enviar el email de recuperación' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Si el email existe, recibirás un enlace de recuperación' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en solicitud de recuperación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
