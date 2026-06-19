export function isWompiConfigured(): boolean {
  return Boolean(
    process.env.WOMPI_PUBLIC_KEY?.trim() &&
      process.env.WOMPI_PRIVATE_KEY?.trim() &&
      process.env.WOMPI_INTEGRITY_SECRET?.trim()
  );
}

export function isWompiSandbox(): boolean {
  const key = process.env.WOMPI_PRIVATE_KEY?.trim() ?? '';
  if (key.startsWith('prv_test_')) return true;
  if (key.startsWith('prv_prod_')) return false;
  return process.env.WOMPI_SANDBOX !== 'false';
}

export function getWompiApiBaseUrl(): string {
  return isWompiSandbox()
    ? 'https://sandbox.wompi.co/v1'
    : 'https://production.wompi.co/v1';
}

export function getWompiCheckoutBaseUrl(): string {
  return 'https://checkout.wompi.co/p/';
}

export function getWompiPublicKey(): string {
  return process.env.WOMPI_PUBLIC_KEY?.trim() ?? '';
}

export function getWompiPrivateKey(): string {
  return process.env.WOMPI_PRIVATE_KEY?.trim() ?? '';
}

export function getWompiIntegritySecret(): string {
  return process.env.WOMPI_INTEGRITY_SECRET?.trim() ?? '';
}

export function getWompiEventsSecret(): string {
  return process.env.WOMPI_EVENTS_SECRET?.trim() ?? '';
}

/** COP entero → centavos Wompi (×100). */
export function copToWompiCents(amountCop: number): number {
  return Math.round(amountCop) * 100;
}

/** Mínimo exigido por Wompi (150.000 centavos = $1.500 COP). */
export const WOMPI_MIN_AMOUNT_COP = 1_500;

export function isWompiAmountValid(amountCop: number): boolean {
  return Math.round(amountCop) >= WOMPI_MIN_AMOUNT_COP;
}

export function wompiMinAmountErrorMessage(amountCop: number): string {
  return `Wompi exige un monto mínimo de $${WOMPI_MIN_AMOUNT_COP.toLocaleString('es-CO')} COP. El total a pagar es $${Math.round(amountCop).toLocaleString('es-CO')} COP.`;
}
