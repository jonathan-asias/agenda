import { NextRequest, NextResponse } from 'next/server';
import {
  getSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from '@/lib/supabase-admin';
import { resolveSupabaseUserIdForReset } from '@/lib/auth/resolveSupabaseUserId';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';
import { withSystemDb } from '@/lib/db/with-tenant-request';
import bcrypt from 'bcryptjs';

type ResetUserType = 'institucion' | 'administrador' | 'docente';

export async function POST(request: NextRequest) {
  try {
    const rate = checkRateLimit(request, 'auth-reset-password', { max: 10, windowSec: 300 });
    if (!rate.ok) {
      return rateLimitResponse(rate.retryAfterSec ?? 300);
    }

    const body = (await request.json()) as { token?: string; password?: string };
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error:
            'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos',
        },
        { status: 400 }
      );
    }

    const resetToken = await withSystemDb(async (tx) =>
      tx.passwordResetTokens.findUnique({
        where: { token },
        select: {
          email: true,
          expiresAt: true,
          userType: true,
          used: true,
        },
      })
    );

    if (!resetToken) {
      return NextResponse.json({ error: 'Token no válido o expirado' }, { status: 400 });
    }

    if (new Date() > resetToken.expiresAt) {
      await withSystemDb(async (tx) => {
        await tx.passwordResetTokens.delete({ where: { token } });
      });
      return NextResponse.json({ error: 'Token no válido o expirado' }, { status: 400 });
    }

    if (resetToken.used) {
      return NextResponse.json({ error: 'Token no válido o expirado' }, { status: 400 });
    }

    const claimed = await withSystemDb(async (tx) =>
      tx.passwordResetTokens.updateMany({
        where: { token, used: false, expiresAt: { gt: new Date() } },
        data: { used: true },
      })
    );

    if (claimed.count === 0) {
      return NextResponse.json({ error: 'Token no válido o expirado' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userType = resetToken.userType as ResetUserType;

    await withSystemDb(async (tx) => {
      switch (userType) {
        case 'institucion':
          await tx.instituciones.update({
            where: { email: resetToken.email },
            data: { password: hashedPassword },
          });
          break;
        case 'administrador':
          await tx.administradores.update({
            where: { correo: resetToken.email },
            data: { password: hashedPassword },
          });
          break;
        case 'docente':
          break;
        default:
          throw new Error('INVALID_USER_TYPE');
      }
    });

    const needsSupabaseAuth = userType === 'docente' || userType === 'administrador';

    if (needsSupabaseAuth || isSupabaseAdminConfigured()) {
      if (!isSupabaseAdminConfigured()) {
        return NextResponse.json(
          {
            error:
              'No se puede restablecer la contraseña: falta configuración de Supabase Admin (SERVICE_ROLE_KEY).',
          },
          { status: 500 }
        );
      }

      const supabaseUserId = await resolveSupabaseUserIdForReset(
        resetToken.email,
        userType
      );

      if (!supabaseUserId) {
        console.error('No se encontró usuario Supabase para reset:', resetToken.email, userType);
        return NextResponse.json(
          {
            error:
              'No hay cuenta de autenticación para este correo. Contacta al administrador de la institución.',
          },
          { status: 500 }
        );
      }

      const supabaseAdmin = getSupabaseAdminClient();
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        supabaseUserId,
        { password, email_confirm: true }
      );

      if (authError) {
        console.error('Error actualizando contraseña en Supabase:', authError.message);
        return NextResponse.json(
          { error: 'No se pudo actualizar la contraseña en el sistema de autenticación' },
          { status: 500 }
        );
      }
    }

    await withSystemDb(async (tx) => {
      await tx.passwordResetTokens.deleteMany({
        where: {
          email: resetToken.email,
          userType: resetToken.userType,
        },
      });
    });

    return NextResponse.json({
      message: 'Contraseña actualizada exitosamente',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_USER_TYPE') {
      return NextResponse.json({ error: 'Tipo de usuario no válido' }, { status: 400 });
    }
    console.error('Error reseteando contraseña:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
