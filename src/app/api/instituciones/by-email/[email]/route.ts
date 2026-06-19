import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserEmail } from '@/lib/tenant';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';
import { withSystemDb } from '@/lib/db/with-tenant-request';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const rate = checkRateLimit(request, 'instituciones-by-email', { max: 30, windowSec: 60 });
    if (!rate.ok) {
      return rateLimitResponse(rate.retryAfterSec ?? 60);
    }

    const { email } = await params;
    const decodedEmail = decodeURIComponent(email || '').trim().toLowerCase();

    if (!decodedEmail) {
      return NextResponse.json({ exists: false, error: 'Email requerido' }, { status: 200 });
    }

    return await withSystemDb(async (tx) => {
      const sessionEmail = await getAuthUserEmail(request);

      // Solo la sesión autenticada con el mismo correo puede obtener el id (PT-27).
      if (!sessionEmail || sessionEmail !== decodedEmail) {
        return NextResponse.json({ exists: false }, { status: 200 });
      }

      const institucion = await tx.instituciones.findFirst({
        where: { email: decodedEmail },
        select: { id: true },
      });

      if (institucion) {
        return NextResponse.json({ exists: true, id: institucion.id }, { status: 200 });
      }

      return NextResponse.json({ exists: false }, { status: 200 });
    });
  } catch (error) {
    console.error('Error al verificar email de institución:', error);
    return NextResponse.json({ exists: false, error: 'Error interno del servidor' }, { status: 200 });
  }
}
