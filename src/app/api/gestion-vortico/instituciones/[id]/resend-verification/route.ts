import { NextRequest, NextResponse } from 'next/server';
import { withSystemDb } from '@/lib/db/with-tenant-request';
import { writeAuditLog } from '@/lib/security/audit-log';
import { checkRateLimit } from '@/lib/security/rate-limit';
import {
  platformAdminErrorToResponse,
  requirePlatformAdmin,
} from '@/lib/security/platform-admin';
import { resendSignupVerificationEmail } from '@/lib/platform-admin/resend-signup-verification';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { email: adminEmail } = await requirePlatformAdmin(request);

    const rate = checkRateLimit(request, 'platform-resend-verification', {
      max: 8,
      windowSec: 300,
    });
    if (!rate.ok) {
      return NextResponse.json(
        {
          error: `Demasiados reenvíos. Intente de nuevo en ${rate.retryAfterSec ?? 60}s.`,
        },
        { status: 429 }
      );
    }

    const { id } = await params;
    const institucionId = Number.parseInt(id, 10);
    if (Number.isNaN(institucionId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const institucion = await withSystemDb(async (tx) =>
      tx.instituciones.findUnique({
        where: { id: institucionId },
        select: { id: true, email: true, nombre: true },
      })
    );

    if (!institucion) {
      return NextResponse.json({ error: 'Institución no encontrada' }, { status: 404 });
    }

    const result = await resendSignupVerificationEmail(institucion.email);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    await writeAuditLog({
      usuario: adminEmail,
      accion: 'PLATFORM_ADMIN_RESEND_VERIFICATION',
      metadata: {
        institucionId: institucion.id,
        targetEmail: institucion.email,
        alreadyConfirmed: Boolean(result.alreadyConfirmed),
      },
      request,
    });

    return NextResponse.json({
      ok: true,
      alreadyConfirmed: Boolean(result.alreadyConfirmed),
      message: result.message,
      email: institucion.email,
    });
  } catch (error) {
    const resp = platformAdminErrorToResponse(error);
    if (resp) return resp;
    console.error('Error reenviar verificación:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
