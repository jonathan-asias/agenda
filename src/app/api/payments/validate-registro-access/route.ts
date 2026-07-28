import { NextRequest, NextResponse } from 'next/server';
import { withDbBypass } from '@/lib/db/rls-context';
import { isPaymentRequiredForRegistration } from '@/lib/env';
import { preRegistroFromJson } from '@/lib/payments/pre-registro-institucion';
import {
  getRegistroAccessTtlHours,
  verifyRegistroAccessToken,
} from '@/lib/security/registro-access-token';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';
import { isTrialReferencia } from '@/lib/trial/constants';
import { TRIAL_LINK_TTL_HOURS } from '@/lib/trial/constants';
import { validateTrialInviteByReferencia } from '@/lib/trial/validate-trial-invite';

/** GET /api/payments/validate-registro-access?token=... */
export async function GET(request: NextRequest) {
  const rate = checkRateLimit(request, 'validate-registro-access', {
    max: 30,
    windowSec: 60,
  });
  if (!rate.ok) {
    return rateLimitResponse(rate.retryAfterSec ?? 60);
  }

  const token = request.nextUrl.searchParams.get('token')?.trim();
  if (!token) {
    return NextResponse.json({ valid: false, reason: 'missing_token' }, { status: 400 });
  }

  let verified;
  try {
    verified = verifyRegistroAccessToken(token);
  } catch {
    return NextResponse.json({ valid: false, reason: 'misconfigured' }, { status: 503 });
  }

  if (!verified.ok) {
    return NextResponse.json({
      valid: false,
      reason: verified.reason,
      expiresInHours: getRegistroAccessTtlHours(),
    });
  }

  if (isTrialReferencia(verified.referencia)) {
    const trialResult = await withDbBypass(async (tx) =>
      validateTrialInviteByReferencia(tx, verified.referencia)
    );

    if (!trialResult.ok) {
      const reasonMap: Record<string, string> = {
        not_found: 'trial_not_found',
        expired: 'trial_expired',
        used: 'trial_used',
        revoked: 'trial_revoked',
        link_expired: 'trial_link_expired',
      };
      return NextResponse.json({
        valid: false,
        isTrial: true,
        reason: reasonMap[trialResult.reason] ?? 'trial_invalid',
        expiresInHours: TRIAL_LINK_TTL_HOURS,
      });
    }

    return NextResponse.json({
      valid: true,
      isTrial: true,
      email: trialResult.email,
      paymentRequired: false,
      trialDays: trialResult.trialDays,
      expiresInHours: TRIAL_LINK_TTL_HOURS,
      preRegistro: {
        nombre: trialResult.institucionNombre,
        nit: trialResult.nit,
        email: trialResult.email,
      },
    });
  }

  if (!isPaymentRequiredForRegistration()) {
    return NextResponse.json({
      valid: true,
      email: verified.email,
      paymentRequired: false,
    });
  }

  const result = await withDbBypass(async (tx) => {
    const pago = await tx.pago.findUnique({
      where: { referencia: verified.referencia },
    });

    if (
      !pago ||
      pago.email !== verified.email ||
      pago.estado !== 'APPROVED' ||
      !pago.procesado
    ) {
      return { eligible: false, preRegistro: null as ReturnType<typeof preRegistroFromJson> };
    }

    const suscripcion = await tx.suscripcion.findFirst({
      where: {
        email: verified.email,
        estado: 'ACTIVA',
        institucion_id: null,
        plan_id: pago.plan_id,
      },
    });

    return {
      eligible: Boolean(suscripcion),
      preRegistro: preRegistroFromJson(pago.datos_preregistro),
    };
  });

  return NextResponse.json({
    valid: result.eligible,
    email: verified.email,
    paymentRequired: true,
    preRegistro: result.preRegistro,
    reason: result.eligible ? null : 'payment_not_eligible',
    expiresInHours: getRegistroAccessTtlHours(),
  });
}
