const HEX6 = /^#[0-9A-Fa-f]{6}$/;

export function validateBrandingColor(
  value: string
): { ok: true; value: string } | { ok: false; error: string } {
  const trimmed = value.trim();
  if (!HEX6.test(trimmed)) {
    return {
      ok: false,
      error: 'Color inválido: use formato hexadecimal #RRGGBB',
    };
  }
  return { ok: true, value: trimmed };
}
