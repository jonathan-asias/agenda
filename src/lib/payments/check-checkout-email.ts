import { withDbBypass } from '@/lib/db/rls-context';
import { supabaseAuthEmailExists } from '@/lib/auth/resolveSupabaseUserId';

export type CheckoutEmailBlockReason =
  | 'institucion_exists'
  | 'account_exists'
  | 'already_paid';

export interface CheckoutEmailAvailability {
  available: boolean;
  reason?: CheckoutEmailBlockReason;
}

/**
 * Verifica si el correo puede usarse en el checkout (nueva institución).
 * Permite correos con pago aprobado pendiente de registro (already_paid).
 */
export async function checkCheckoutEmailAvailability(
  email: string
): Promise<CheckoutEmailAvailability> {
  const normalized = email.trim().toLowerCase();

  return withDbBypass(async (tx) => {
    const institucion = await tx.instituciones.findFirst({
      where: { email: normalized },
      select: { id: true },
    });
    if (institucion) {
      return { available: false, reason: 'institucion_exists' };
    }

    const administrador = await tx.administradores.findUnique({
      where: { correo: normalized },
      select: { id: true },
    });
    if (administrador) {
      return { available: false, reason: 'account_exists' };
    }

    const pagoAprobado = await tx.pago.findFirst({
      where: {
        email: normalized,
        estado: 'APPROVED',
        procesado: true,
      },
      orderBy: { created_at: 'desc' },
    });

    if (pagoAprobado) {
      const suscripcion = await tx.suscripcion.findFirst({
        where: {
          email: normalized,
          estado: 'ACTIVA',
          institucion_id: null,
          plan_id: pagoAprobado.plan_id,
        },
      });
      if (suscripcion) {
        return { available: false, reason: 'already_paid' };
      }
    }

    const authExists = await supabaseAuthEmailExists(normalized);
    if (authExists) {
      return { available: false, reason: 'account_exists' };
    }

    return { available: true };
  });
}

export function checkoutEmailBlockMessage(reason: CheckoutEmailBlockReason): string {
  switch (reason) {
    case 'institucion_exists':
    case 'account_exists':
      return 'Ya existe una cuenta registrada con este correo. Inicie sesión o use recuperar contraseña.';
    case 'already_paid':
      return 'Este correo ya tiene un pago aprobado. Revise su correo para completar el registro de la institución.';
    default:
      return 'Este correo no está disponible para un nuevo registro.';
  }
}
