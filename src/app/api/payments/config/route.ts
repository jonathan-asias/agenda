import { NextRequest, NextResponse } from 'next/server';
import { resolveWebhookUrl } from '@/lib/app-url';
import { isMercadoPagoConfigured } from '@/lib/mercadopago/client';
import {
  getMercadoPagoCredentialKind,
  isMercadoPagoDevMockCheckout,
  isMercadoPagoSandbox,
} from '@/lib/mercadopago/config';
import { getMercadoPagoSandboxUiHints } from '@/lib/mercadopago/sandbox-hints';
import { isWompiConfigured, isWompiSandbox, WOMPI_MIN_AMOUNT_COP } from '@/lib/wompi/config';
import { getWompiSandboxUiHints } from '@/lib/wompi/sandbox-hints';
import { getWompiSetupStatus } from '@/lib/wompi/setup';

/** GET /api/payments/config — flags públicos para la UI de checkout (sin secretos). */
export async function GET(request: NextRequest) {
  const mercadoPagoConfigured = isMercadoPagoConfigured();
  const wompiConfigured = isWompiConfigured();
  const wompiSetup = getWompiSetupStatus();
  const sandbox = mercadoPagoConfigured && isMercadoPagoSandbox();
  const credentialKind = mercadoPagoConfigured ? getMercadoPagoCredentialKind() : null;
  const webhookBase = resolveWebhookUrl(request);
  const wompiWebhookUrl =
    webhookBase && !webhookBase.includes('localhost')
      ? `${webhookBase}/api/wompi/webhook`
      : null;

  return NextResponse.json({
    configured: mercadoPagoConfigured || wompiConfigured,
    mercadoPagoConfigured,
    wompiConfigured,
    wompiSandbox: wompiConfigured && isWompiSandbox(),
    wompiMissing: wompiSetup.missing,
    wompiWarnings: wompiSetup.warnings,
    wompiWebhookUrl,
    sandbox,
    devMockCheckout: isMercadoPagoDevMockCheckout(),
    credentialKind,
    credentialWarning:
      sandbox && credentialKind === 'app_usr'
        ? 'Use el Access Token de Credenciales de prueba en el panel MP (no el de producción).'
        : null,
    testCardHint: sandbox ? getMercadoPagoSandboxUiHints() : null,
    wompiTestCardHint:
      wompiConfigured && isWompiSandbox() ? getWompiSandboxUiHints() : null,
    wompiMinAmountCop: WOMPI_MIN_AMOUNT_COP,
  });
}
