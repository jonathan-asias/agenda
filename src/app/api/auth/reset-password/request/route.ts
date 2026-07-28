import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmail } from '@/lib/auth/send-password-reset-email';
import { resolveAppUrl } from '@/lib/app-url';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  extractCaptchaToken,
  requireTurnstileOrError,
} from '@/lib/security/turnstile';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';
import { withSystemDb } from '@/lib/db/with-tenant-request';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const rate = checkRateLimit(request, 'auth-reset-request', { max: 5, windowSec: 300 });
    if (!rate.ok) {
      return rateLimitResponse(rate.retryAfterSec ?? 300);
    }

    const body = await request.json();
    const { email, userType } = body;

    const captchaError = await requireTurnstileOrError(extractCaptchaToken(body));
    if (captchaError) return captchaError;

    if (!email || !userType) {
      return NextResponse.json(
        { error: 'Email y tipo de usuario son requeridos' },
        { status: 400 }
      );
    }

    if (!['institucion', 'administrador', 'docente'].includes(userType)) {
      return NextResponse.json(
        { error: 'Tipo de usuario inválido' },
        { status: 400 }
      );
    }

    const emailNormalized = email.toLowerCase().trim();

    const userExists = await withSystemDb(async (tx) => {
      switch (userType) {
        case 'institucion': {
          const row = await tx.instituciones.findUnique({
            where: { email: emailNormalized },
            select: { id: true },
          });
          return row != null;
        }
        case 'administrador': {
          const row = await tx.administradores.findUnique({
            where: { correo: emailNormalized },
            select: { id: true },
          });
          return row != null;
        }
        case 'docente': {
          const row = await tx.docentes.findUnique({
            where: { email: emailNormalized },
            select: { id: true, activo: true },
          });
          return row != null && row.activo;
        }
        default:
          return false;
      }
    });

    if (!userExists) {
      return NextResponse.json(
        { message: 'Si el email existe, recibirás un enlace de recuperación' },
        { status: 200 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await withSystemDb(async (tx) => {
      await tx.passwordResetTokens.deleteMany({
        where: { email: emailNormalized, userType },
      });
      await tx.passwordResetTokens.create({
        data: {
          email: emailNormalized,
          token: resetToken,
          expiresAt,
          userType,
        },
      });
    });

    const resetLink = `${resolveAppUrl(request)}/resetear-contrasena/${resetToken}`;

    const hasEmailChannel =
      Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM) ||
      isSupabaseConfigured();

    if (!hasEmailChannel) {
      await withSystemDb(async (tx) => {
        await tx.passwordResetTokens.deleteMany({ where: { token: resetToken } });
      });
      return NextResponse.json(
        {
          error:
            'El servicio de correo no está configurado. Defina RESEND_API_KEY y EMAIL_FROM, o Supabase Auth.',
        },
        { status: 500 }
      );
    }

    const emailResult = await sendPasswordResetEmail(emailNormalized, resetLink);

    if (!emailResult.sent) {
      await withSystemDb(async (tx) => {
        await tx.passwordResetTokens.deleteMany({ where: { token: resetToken } });
      });
      console.error('Error enviando recuperación:', emailResult.error);
      return NextResponse.json(
        {
          error:
            'No se pudo enviar el correo de recuperación. Verifique que el usuario exista en Supabase Auth y que la URL de redirección esté permitida en el panel de Supabase.',
          details:
            process.env.NODE_ENV === 'development' ? emailResult.error : undefined,
        },
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
