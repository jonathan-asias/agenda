/** NIT colombiano: 9 dígitos sin dígito de verificación. */
export function isValidColombianNit(nit: string): boolean {
  return /^\d{9}$/.test(nit.trim());
}

export function sanitizeColombianNitInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, 9);
}

export function isValidEmailAddress(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function normalizeEmailAddress(email: string): string {
  return email.trim().toLowerCase();
}
