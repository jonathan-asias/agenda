import type { PreRegistroInstitucion } from '@/types/pre-registro-institucion';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidNIT(nit: string): boolean {
  return /^\d{9}$/.test(nit);
}

export function parsePreRegistroInstitucion(
  raw: unknown
): { ok: true; data: PreRegistroInstitucion } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Datos de institución inválidos' };
  }

  const o = raw as Record<string, unknown>;
  const nombre = String(o.nombre ?? '').trim();
  const email = String(o.email ?? '')
    .trim()
    .toLowerCase();
  const direccion_principal = String(o.direccion_principal ?? '').trim();
  const nit = String(o.nit ?? '').trim();
  const nombre_contacto = String(o.nombre_contacto ?? '').trim();
  const telefono_contacto = String(o.telefono_contacto ?? '').trim();

  if (!nombre) return { ok: false, error: 'El nombre de la institución es requerido' };
  if (!email || !isValidEmail(email)) return { ok: false, error: 'Correo electrónico inválido' };
  if (!direccion_principal) return { ok: false, error: 'La dirección es requerida' };
  if (!isValidNIT(nit)) return { ok: false, error: 'El NIT debe tener 9 dígitos' };
  if (!nombre_contacto) return { ok: false, error: 'El nombre de contacto es requerido' };
  if (!telefono_contacto) return { ok: false, error: 'El teléfono de contacto es requerido' };

  return {
    ok: true,
    data: {
      nombre,
      email,
      direccion_principal,
      nit,
      nombre_contacto,
      telefono_contacto,
    },
  };
}

export function preRegistroFromJson(value: unknown): PreRegistroInstitucion | null {
  if (!value || typeof value !== 'object') return null;
  const parsed = parsePreRegistroInstitucion(value);
  return parsed.ok ? parsed.data : null;
}
