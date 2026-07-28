import { NextRequest, NextResponse } from 'next/server';
import { withSystemDb } from '@/lib/db/with-tenant-request';
import {
  platformAdminErrorToResponse,
  requirePlatformAdmin,
} from '@/lib/security/platform-admin';
import { resendTrialInviteEmail } from '@/lib/trial/send-trial-invite-email';
import { TRIAL_LINK_TTL_HOURS } from '@/lib/trial/constants';
import { writeAuditLog } from '@/lib/security/audit-log';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { email: adminEmail } = await requirePlatformAdmin(request);
    const { id } = await params;
    const inviteId = Number.parseInt(id, 10);
    if (Number.isNaN(inviteId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const result = await withSystemDb(async (tx) => {
      const invite = await tx.invitacionPrueba.findUnique({
        where: { id: inviteId },
        include: { plan: true },
      });

      if (!invite) {
        return { notFound: true as const };
      }

      if (invite.estado !== 'PENDIENTE') {
        throw new Error('Solo se puede reenviar una invitación pendiente.');
      }

      const linkExpiresAt = new Date(Date.now() + TRIAL_LINK_TTL_HOURS * 60 * 60 * 1000);
      await tx.invitacionPrueba.update({
        where: { id: inviteId },
        data: { link_expires_at: linkExpiresAt, estado: 'PENDIENTE' },
      });

      const emailResult = await resendTrialInviteEmail({
        email: invite.email,
        referencia: invite.referencia,
        institucionNombre: invite.institucion_nombre,
        planNombre: invite.plan.nombre,
        trialDays: invite.trial_days,
      });

      return {
        notFound: false as const,
        registroUrl: emailResult.registroUrl,
        registroUrlLocalhost: emailResult.registroUrlLocalhost,
        emailSent: emailResult.sent,
        linkExpiresAt,
      };
    });

    if (result.notFound) {
      return NextResponse.json({ error: 'Invitación no encontrada' }, { status: 404 });
    }

    await writeAuditLog({
      usuario: adminEmail,
      accion: 'TRIAL_INVITE_RESENT',
      metadata: { inviteId },
      request,
    });

    return NextResponse.json({
      success: true,
      registroUrl: result.registroUrl,
      registroUrlLocalhost: result.registroUrlLocalhost,
      emailSent: result.emailSent,
      linkExpiresAt: result.linkExpiresAt.toISOString(),
    });
  } catch (error) {
    const resp = platformAdminErrorToResponse(error);
    if (resp) return resp;
    const message = error instanceof Error ? error.message : 'Error interno';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
