import { APP_URL } from '@/lib/env';
import { sendEmail } from '@/lib/notifications/email';
import {
  buildRegistroInstitucionUrl,
  createRegistroAccessToken,
  getRegistroAccessTtlHours,
} from '@/lib/security/registro-access-token';

export interface PaymentConfirmationPlan {
  nombre: string;
  precio: number;
  push: boolean;
  whatsapp: boolean;
  email: boolean;
}

function formatCop(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
}

function planFeatures(plan: PaymentConfirmationPlan): string[] {
  const features: string[] = ['Gestión académica completa', 'Panel administrativo'];
  if (plan.email) features.push('Recordatorios por correo electrónico');
  if (plan.whatsapp) features.push('Recordatorios por WhatsApp');
  if (plan.push) features.push('Notificaciones push');
  return features;
}

function isLocalhostBase(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
  } catch {
    return /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?/i.test(url);
  }
}

function resolveLocalhostRegistroBase(publicBase: string): string {
  const fromEnv = process.env.LOCAL_REGISTRATION_URL?.trim().replace(/\/$/, '');
  if (fromEnv && isLocalhostBase(fromEnv)) return fromEnv;
  const fromPublic = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '');
  if (fromPublic && isLocalhostBase(fromPublic)) return fromPublic;
  try {
    const port = new URL(publicBase).port || '3000';
    return `http://localhost:${port}`;
  } catch {
    return 'http://localhost:3000';
  }
}

function buildPaymentConfirmationHtml(params: {
  plan: PaymentConfirmationPlan;
  registroUrl: string;
  registroUrlLocalhost?: string;
  expiresInHours: number;
}): string {
  const { plan, registroUrl, registroUrlLocalhost, expiresInHours } = params;
  const features = planFeatures(plan)
    .map((f) => `<li style="margin:4px 0">${f}</li>`)
    .join('');

  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="color:#1e293b;margin:0 0 16px">¡Pago confirmado!</h2>
      <p style="color:#475569;line-height:1.6">
        Su suscripción a <strong>Agenda Virtual</strong> fue procesada correctamente.
      </p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin:20px 0">
        <p style="margin:0 0 8px;font-size:14px;color:#64748b">Plan contratado</p>
        <p style="margin:0 0 4px;font-size:20px;font-weight:700;color:#0f172a">${plan.nombre}</p>
        <p style="margin:0;font-size:16px;color:#334155">${formatCop(plan.precio)} COP / mes</p>
        <ul style="margin:12px 0 0;padding-left:20px;color:#475569;font-size:14px;line-height:1.5">
          ${features}
        </ul>
      </div>
      <p style="color:#475569;line-height:1.6">
        Use el botón siguiente para registrar su institución. El enlace es personal
        y <strong>caduca en ${expiresInHours} horas</strong> por seguridad. No lo comparta.
      </p>
      <p style="margin:24px 0">
        <a href="${registroUrl}"
           style="display:inline-block;background:#0f172a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          Completar registro de institución
        </a>
      </p>
      ${
        registroUrlLocalhost
          ? `
      <p style="color:#475569;line-height:1.6;font-size:14px">
        Si está desarrollando en su máquina local, use este enlace:
      </p>
      <p style="margin:16px 0 24px">
        <a href="${registroUrlLocalhost}"
           style="display:inline-block;background:#fff;color:#0f172a;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;border:2px solid #0f172a">
          Continuar con localhost
        </a>
      </p>
      `
          : ''
      }
      <p style="color:#64748b;font-size:13px;line-height:1.5">
        Si el enlace expiró, realice nuevamente el proceso de pago o contacte a soporte.
      </p>
    </div>
  `;
}

/**
 * Correo tras pago aprobado: resumen del plan y enlace firmado a registro.
 */
export async function sendPaymentConfirmationEmail(params: {
  email: string;
  referencia: string;
  plan: PaymentConfirmationPlan;
}): Promise<{ sent: boolean; error?: string }> {
  const normalized = params.email.trim().toLowerCase();
  const envBase = APP_URL?.trim().replace(/\/$/, '');
  const base =
    envBase && !isLocalhostBase(envBase)
      ? envBase
      : process.env.NODE_ENV === 'production'
        ? 'https://ahoritapp.com'
        : envBase || 'http://localhost:3000';
  const expiresInHours = getRegistroAccessTtlHours();
  const token = createRegistroAccessToken(normalized, params.referencia);
  const registroUrl = buildRegistroInstitucionUrl(base, token);
  const registroUrlLocalhost = !isLocalhostBase(base)
    ? buildRegistroInstitucionUrl(resolveLocalhostRegistroBase(base), token)
    : undefined;

  const result = await sendEmail({
    to: [normalized],
    subject: `Pago confirmado — ${params.plan.nombre} | Agenda Virtual`,
    html: buildPaymentConfirmationHtml({
      plan: params.plan,
      registroUrl,
      registroUrlLocalhost,
      expiresInHours,
    }),
  });

  if (!result.success) {
    const err =
      result.error instanceof Error ? result.error.message : 'Error al enviar correo';
    console.error('Correo de pago confirmado no enviado:', err);
    return { sent: false, error: err };
  }

  return { sent: true };
}
