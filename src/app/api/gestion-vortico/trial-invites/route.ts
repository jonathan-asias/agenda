import { NextRequest, NextResponse } from 'next/server';
import { withSystemDb } from '@/lib/db/with-tenant-request';
import {
  platformAdminErrorToResponse,
  requirePlatformAdmin,
} from '@/lib/security/platform-admin';
import { createTrialInvite } from '@/lib/trial/create-trial-invite';
import { writeAuditLog } from '@/lib/security/audit-log';
import {
  isValidColombianNit,
  isValidEmailAddress,
  normalizeEmailAddress,
} from '@/lib/validation/institucion-fields';

export async function GET(request: NextRequest) {
  try {
    await requirePlatformAdmin(request);

    const invites = await withSystemDb(async (tx) =>
      tx.invitacionPrueba.findMany({
        orderBy: { created_at: 'desc' },
        take: 100,
        include: {
          plan: { select: { id: true, nombre: true } },
        },
      })
    );

    return NextResponse.json({
      invites: invites.map((invite) => ({
        id: invite.id,
        referencia: invite.referencia,
        institucion_nombre: invite.institucion_nombre,
        nit: invite.nit,
        email: invite.email,
        estado: invite.estado,
        link_expires_at: invite.link_expires_at.toISOString(),
        trial_days: invite.trial_days,
        created_by: invite.created_by,
        used_at: invite.used_at?.toISOString() ?? null,
        created_at: invite.created_at.toISOString(),
        plan: invite.plan,
      })),
    });
  } catch (error) {
    const resp = platformAdminErrorToResponse(error);
    if (resp) return resp;
    console.error('Error listando invitaciones de prueba:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email: adminEmail } = await requirePlatformAdmin(request);
    const body = (await request.json()) as {
      institucionNombre?: string;
      nit?: string;
      email?: string;
      planId?: number;
      trialDays?: number;
    };

    const institucionNombre = body.institucionNombre?.trim() ?? '';
    const nit = body.nit?.trim() ?? '';
    const email = normalizeEmailAddress(body.email ?? '');
    const planId = Number(body.planId);

    if (!institucionNombre || !nit || !email || !Number.isFinite(planId)) {
      return NextResponse.json(
        { error: 'institucionNombre, nit, email y planId son obligatorios.' },
        { status: 400 }
      );
    }

    if (!isValidColombianNit(nit)) {
      return NextResponse.json(
        {
          error:
            'El NIT debe contener exactamente 9 dígitos numéricos (sin dígito de verificación).',
        },
        { status: 400 }
      );
    }

    if (!isValidEmailAddress(email)) {
      return NextResponse.json(
        { error: 'Ingrese un correo electrónico válido.' },
        { status: 400 }
      );
    }

    const result = await withSystemDb(async (tx) =>
      createTrialInvite(tx, {
        institucionNombre,
        nit,
        email,
        planId,
        createdBy: adminEmail,
        trialDays: body.trialDays,
      })
    );

    await writeAuditLog({
      usuario: adminEmail,
      accion: 'TRIAL_INVITE_CREATED',
      metadata: {
        inviteId: result.inviteId,
        email,
        nit,
        referencia: result.referencia,
      },
      request,
    });

    return NextResponse.json({
      success: true,
      inviteId: result.inviteId,
      registroUrl: result.registroUrl,
      registroUrlLocalhost: result.registroUrlLocalhost,
      linkExpiresAt: result.linkExpiresAt.toISOString(),
      trialDays: result.trialDays,
      emailSent: result.emailSent,
    });
  } catch (error) {
    const resp = platformAdminErrorToResponse(error);
    if (resp) return resp;
    const message = error instanceof Error ? error.message : 'Error interno';
    console.error('Error creando invitación de prueba:', error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
