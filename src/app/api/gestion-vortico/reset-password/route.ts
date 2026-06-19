import { NextRequest, NextResponse } from 'next/server';
import { withSystemDb } from '@/lib/db/with-tenant-request';
import { writeAuditLog } from '@/lib/security/audit-log';
import {
  platformAdminErrorToResponse,
  requirePlatformAdmin,
} from '@/lib/security/platform-admin';
import {
  resetUserPasswordByPlatformAdmin,
  type PlatformResetUserType,
} from '@/lib/platform-admin/reset-user-password';

interface ResetBody {
  userType?: PlatformResetUserType;
  email?: string;
  password?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email: adminEmail } = await requirePlatformAdmin(request);
    const body = (await request.json()) as ResetBody;

    const userType = body.userType;
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? '';

    if (!userType || !email || !password) {
      return NextResponse.json(
        { error: 'userType, email y password son requeridos' },
        { status: 400 }
      );
    }

    if (!['institucion', 'administrador', 'docente'].includes(userType)) {
      return NextResponse.json({ error: 'userType inválido' }, { status: 400 });
    }

    try {
      await withSystemDb(async (tx) =>
        resetUserPasswordByPlatformAdmin(tx, { userType, email, password })
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al restablecer contraseña';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    await writeAuditLog({
      usuario: adminEmail,
      accion: 'PLATFORM_ADMIN_RESET_PASSWORD',
      metadata: { targetEmail: email, userType },
      request,
    });

    return NextResponse.json({
      ok: true,
      message: 'Contraseña actualizada correctamente',
    });
  } catch (error) {
    const resp = platformAdminErrorToResponse(error);
    if (resp) return resp;
    console.error('Error reset password platform:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
