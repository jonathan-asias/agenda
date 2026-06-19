import { NextRequest, NextResponse } from 'next/server';
import { resolveWebhookUrl } from '@/lib/app-url';
import { getWompiSandboxUiHints } from '@/lib/wompi/sandbox-hints';
import { getWompiSetupStatus } from '@/lib/wompi/setup';

/** GET /api/wompi/config — estado de configuración Wompi (sin secretos completos). */
export async function GET(request: NextRequest) {
  const status = getWompiSetupStatus();
  const webhookBase = resolveWebhookUrl(request);
  const webhookUrl =
    webhookBase && !webhookBase.includes('localhost')
      ? `${webhookBase}/api/wompi/webhook`
      : null;

  return NextResponse.json({
    ...status,
    webhookUrl,
    webhookHint: webhookUrl
      ? 'Registre esta URL en Wompi Dashboard → Desarrolladores → URL de eventos (sandbox).'
      : 'Configure APP_URL con HTTPS público (túnel o dominio) para recibir webhooks de Wompi.',
    testCardHint: status.sandbox && status.configured ? getWompiSandboxUiHints() : null,
  });
}
