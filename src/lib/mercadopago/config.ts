import type { MercadoPagoPreferenceResponse } from '@/lib/mercadopago/client';

/**
 * Modo sandbox/prueba de Mercado Pago.
 * Las credenciales de prueba pueden ser TEST- o APP_USR- (panel "Credenciales de prueba").
 * Sin MERCADOPAGO_SANDBOX=false en producción, en dev se asume sandbox.
 */
export function isMercadoPagoSandbox(): boolean {
  const flag = process.env.MERCADOPAGO_SANDBOX?.trim().toLowerCase();
  if (flag === 'true' || flag === '1') return true;
  if (flag === 'false' || flag === '0') return false;

  const token = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim() || '';
  if (token.startsWith('TEST-')) return true;

  return process.env.NODE_ENV !== 'production';
}

export function resolveMercadoPagoCheckoutUrl(
  preference: MercadoPagoPreferenceResponse
): string {
  if (isMercadoPagoSandbox()) {
    if (preference.sandbox_init_point) {
      return preference.sandbox_init_point;
    }
    console.warn(
      '[Mercado Pago] Modo sandbox pero la preferencia no trae sandbox_init_point. ' +
        'Verifica que MERCADOPAGO_ACCESS_TOKEN sea de Credenciales de prueba.'
    );
  }

  return preference.init_point;
}

/** Indica si el token parece de credenciales de prueba (panel MP). */
export function getMercadoPagoCredentialKind(): 'test' | 'app_usr' | 'unknown' {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim() || '';
  if (token.startsWith('TEST-')) return 'test';
  if (token.startsWith('APP_USR-')) return 'app_usr';
  return 'unknown';
}

/**
 * Solo desarrollo: omite checkout sandbox MP y aprueba el pago en local.
 * Requiere MERCADOPAGO_DEV_MOCK_CHECKOUT=true y MERCADOPAGO_SANDBOX=true.
 */
export function isMercadoPagoDevMockCheckout(): boolean {
  if (process.env.NODE_ENV === 'production') return false;
  const flag = process.env.MERCADOPAGO_DEV_MOCK_CHECKOUT?.trim().toLowerCase();
  if (flag !== 'true' && flag !== '1') return false;
  return isMercadoPagoSandbox();
}
