import { TRIAL_LINK_TTL_HOURS } from '@/lib/trial/constants';
import { buildRegistroInstitucionUrlPair } from '@/lib/payments/registro-url';
import { sendEmail } from '@/lib/notifications/email';

function buildTrialInviteHtml(params: {
  institucionNombre: string;
  planNombre: string;
  registroUrl: string;
  registroUrlLocalhost?: string;
  linkExpiresInHours: number;
  trialDays: number;
}): string {
  const {
    institucionNombre,
    planNombre,
    registroUrl,
    registroUrlLocalhost,
    linkExpiresInHours,
    trialDays,
  } = params;

  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="color:#1e293b;margin:0 0 16px">Invitación a versión de prueba</h2>
      <p style="color:#475569;line-height:1.6">
        Le invitamos a activar la <strong>versión de prueba de ${trialDays} días</strong> de
        <strong>Agenda Virtual</strong> para <strong>${institucionNombre}</strong>.
      </p>
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px;margin:20px 0">
        <p style="margin:0 0 8px;font-size:14px;color:#1d4ed8">Plan de prueba</p>
        <p style="margin:0;font-size:18px;font-weight:700;color:#1e3a8a">${planNombre}</p>
      </div>
      <p style="color:#475569;line-height:1.6">
        Use el botón siguiente para completar el registro. El enlace es personal,
        válido por <strong>${linkExpiresInHours} horas</strong> y de un solo uso.
      </p>
      <p style="margin:24px 0">
        <a href="${registroUrl}"
           style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          Completar registro de prueba
        </a>
      </p>
      ${
        registroUrlLocalhost
          ? `
      <p style="color:#475569;line-height:1.6;font-size:14px">
        Si está probando en su máquina local, use este enlace:
      </p>
      <p style="margin:16px 0 24px">
        <a href="${registroUrlLocalhost}"
           style="display:inline-block;background:#fff;color:#2563eb;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;border:2px solid #2563eb">
          Continuar con localhost
        </a>
      </p>
      `
          : ''
      }
      <p style="color:#64748b;font-size:13px;line-height:1.5">
        Si el enlace expiró, contacte a su asesor para solicitar uno nuevo.
      </p>
    </div>
  `;
}

export async function sendTrialInviteEmail(params: {
  to: string;
  institucionNombre: string;
  planNombre: string;
  registroUrl: string;
  registroUrlLocalhost?: string;
  linkExpiresInHours?: number;
  trialDays: number;
}): Promise<boolean> {
  const normalized = params.to.trim().toLowerCase();
  const result = await sendEmail({
    to: [normalized],
    subject: `Invitación a prueba — ${params.institucionNombre} | Agenda Virtual`,
    html: buildTrialInviteHtml({
      institucionNombre: params.institucionNombre,
      planNombre: params.planNombre,
      registroUrl: params.registroUrl,
      registroUrlLocalhost: params.registroUrlLocalhost,
      linkExpiresInHours: params.linkExpiresInHours ?? TRIAL_LINK_TTL_HOURS,
      trialDays: params.trialDays,
    }),
  });

  if (!result.success) {
    console.error('Correo de invitación de prueba no enviado:', result.error);
    return false;
  }

  return true;
}

export async function resendTrialInviteEmail(params: {
  email: string;
  referencia: string;
  institucionNombre: string;
  planNombre: string;
  trialDays: number;
}): Promise<{ sent: boolean; registroUrl: string; registroUrlLocalhost?: string }> {
  const { registroUrl, registroUrlLocalhost } = buildRegistroInstitucionUrlPair(
    params.email,
    params.referencia,
    TRIAL_LINK_TTL_HOURS
  );
  const sent = await sendTrialInviteEmail({
    to: params.email,
    institucionNombre: params.institucionNombre,
    planNombre: params.planNombre,
    registroUrl,
    registroUrlLocalhost,
    trialDays: params.trialDays,
  });
  return { sent, registroUrl, registroUrlLocalhost };
}
