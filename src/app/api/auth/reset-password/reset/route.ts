import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { supabase } from '../../../../../lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Validar contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos' },
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

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Actualizar la contraseña según el tipo de usuario
    switch (resetToken.userType) {
      case 'institucion':
        await prisma.instituciones.update({
          where: { email: resetToken.email },
          data: { password: hashedPassword }
        });
        break;
      case 'administrador':
        await prisma.administradores.update({
          where: { correo: resetToken.email },
          data: { password: hashedPassword }
        });
        break;
      case 'docente':
        // TODO: Implementar cuando se agregue el modelo de docentes
        return NextResponse.json(
          { error: 'Funcionalidad de docentes no implementada aún' },
          { status: 501 }
        );
    }

    // Actualizar la contraseña en Supabase Auth
    try {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        resetToken.email,
        { password: password }
      );

      if (authError) {
        console.error('Error actualizando contraseña en Supabase:', authError);
        // No fallar si no se puede actualizar en Supabase, ya que se actualizó en la BD
      }
    } catch (error) {
      console.error('Error en actualización de Supabase:', error);
      // No fallar si no se puede actualizar en Supabase
    }

    // Marcar el token como usado
    await prisma.passwordResetTokens.update({
      where: { token },
      data: { used: true }
    });

    // Eliminar todos los tokens de recuperación para este email
    await prisma.passwordResetTokens.deleteMany({
      where: { 
        email: resetToken.email,
        userType: resetToken.userType
      }
    });

    return NextResponse.json({
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error reseteando contraseña:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
