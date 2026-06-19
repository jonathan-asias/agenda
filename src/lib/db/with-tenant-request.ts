import type { NextRequest } from 'next/server';
import type { Prisma } from '@prisma/client';
import { requireAuthInstitutionId } from '@/lib/tenant';
import { withDbBypass, withDbTenant } from '@/lib/db/rls-context';
import {
  enforceInstitutionReadAccess,
  enforceInstitutionWriteAccess,
} from '@/lib/security/subscription-guard';

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function isWriteMethod(method: string | undefined): boolean {
  return WRITE_METHODS.has(method?.toUpperCase() ?? '');
}

/**
 * Ejecuta queries con RLS scoped al tenant de la sesión actual.
 */
export async function withTenantFromRequest<T>(
  request: NextRequest | undefined,
  fn: (tx: Prisma.TransactionClient, institutionId: number) => Promise<T>
): Promise<T> {
  const institutionId = await requireAuthInstitutionId(request);

  if (request && isWriteMethod(request.method)) {
    await enforceInstitutionWriteAccess(institutionId, request);
  } else {
    await enforceInstitutionReadAccess(institutionId);
  }

  return withDbTenant(institutionId, (tx) => fn(tx, institutionId));
}

/** Rutas públicas/sistema (pagos, reset, webhooks). */
export async function withSystemDb<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return withDbBypass(fn);
}
