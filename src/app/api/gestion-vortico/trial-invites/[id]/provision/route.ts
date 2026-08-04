import { NextRequest, NextResponse } from 'next/server';
import { withSystemDb } from '@/lib/db/with-tenant-request';
import {
  platformAdminErrorToResponse,
  requirePlatformAdmin,
} from '@/lib/security/platform-admin';
import { writeAuditLog } from '@/lib/security/audit-log';
import {
  provisionTrialInstitution,
  type ProvisionSedeInput,
} from '@/lib/trial/provision-trial-institution';

/**
 * Aprovisiona institución desde invitación trial (operador GV).
 * Evita Turnstile del registro público; solo PLATFORM_ADMIN.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { email: adminEmail } = await requirePlatformAdmin(request);
    const { id } = await params;
    const inviteId = Number.parseInt(id, 10);
    if (!Number.isFinite(inviteId)) {
      return NextResponse.json({ error: 'ID de invitación inválido' }, { status: 400 });
    }

    const body = (await request.json()) as {
      password?: string;
      direccionPrincipal?: string;
      nombreContacto?: string;
      telefonoContacto?: string;
      sedes?: ProvisionSedeInput[];
    };

    const password = body.password?.trim() ?? '';
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'password debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    const result = await withSystemDb((tx) =>
      provisionTrialInstitution(tx, {
        inviteId,
        password,
        direccionPrincipal: body.direccionPrincipal?.trim() || 'Calle E2E 123',
        nombreContacto: body.nombreContacto?.trim() || 'Contacto E2E',
        telefonoContacto: body.telefonoContacto?.trim() || '3001234567',
        sedes: body.sedes,
      })
    );

    await writeAuditLog({
      usuario: adminEmail,
      accion: 'TRIAL_INSTITUTION_PROVISIONED',
      metadata: {
        inviteId,
        institucionId: result.institucionId,
        email: result.email,
        sedes: result.sedeIds.length,
      },
      request,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const resp = platformAdminErrorToResponse(error);
    if (resp) return resp;
    const message = error instanceof Error ? error.message : 'Error interno';
    console.error('Error aprovisionando trial:', error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
