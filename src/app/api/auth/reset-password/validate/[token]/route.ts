import { NextRequest, NextResponse } from 'next/server';
import { withSystemDb } from '@/lib/db/with-tenant-request';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const rate = checkRateLimit(request, 'auth-reset-validate', { max: 30, windowSec: 60 });
    if (!rate.ok) {
      return rateLimitResponse(rate.retryAfterSec ?? 60);
    }

    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Token requerido' },
        { status: 400 }
      );
    }

    const resetToken = await withSystemDb(async (tx) =>
      tx.passwordResetTokens.findUnique({
        where: { token },
        select: {
          expiresAt: true,
          userType: true,
          used: true,
        },
      })
    );

    if (!resetToken) {
      return NextResponse.json({ error: 'Token no válido o expirado' }, { status: 400 });
    }

    if (new Date() > resetToken.expiresAt || resetToken.used) {
      if (new Date() > resetToken.expiresAt) {
        await withSystemDb(async (tx) => {
          await tx.passwordResetTokens.delete({ where: { token } });
        });
      }
      return NextResponse.json({ error: 'Token no válido o expirado' }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      userType: resetToken.userType,
    });
  } catch (error) {
    console.error('Error validando token:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
