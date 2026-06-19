import { NextRequest } from 'next/server';
import type { Prisma } from '@prisma/client';
import { requireAdminRole, requireInstitutionOwnerRole } from '@/lib/security/rbac';
import { withDbTenant } from '@/lib/db/rls-context';
import { resolveSedeScope, type SedeScope } from '@/lib/sede-scope';
import {
  enforceInstitutionReadAccess,
  enforceInstitutionWriteAccess,
} from '@/lib/security/subscription-guard';

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function isWriteMethod(method: string | undefined): boolean {
  return WRITE_METHODS.has(method?.toUpperCase() ?? '');
}

async function enforceSubscriptionForRequest(
  request: NextRequest,
  institutionId: number
): Promise<void> {
  if (isWriteMethod(request.method)) {
    await enforceInstitutionWriteAccess(institutionId, request);
  } else {
    await enforceInstitutionReadAccess(institutionId);
  }
}

export interface AdminDbContext {
  institutionId: number;
  scope: SedeScope;
}

/** Obtiene institutionId exigiendo rol admin o institución (superadmin). */
export async function requireAdminApiInstitutionId(
  request: NextRequest
): Promise<number> {
  const { institutionId } = await requireAdminRole(request);
  return institutionId;
}

/** Admin API con RLS scoped al tenant y contexto de sede del administrador. */
export async function withAdminSedeDb<T>(
  request: NextRequest,
  fn: (tx: Prisma.TransactionClient, ctx: AdminDbContext) => Promise<T>
): Promise<T> {
  const institutionId = await requireAdminApiInstitutionId(request);
  await enforceSubscriptionForRequest(request, institutionId);
  const scope = await resolveSedeScope(request, institutionId);
  return withDbTenant(institutionId, (tx) =>
    fn(tx, { institutionId, scope })
  );
}

/** Admin API con RLS scoped al tenant de la sesión. */
export async function withAdminTenantDb<T>(
  request: NextRequest,
  fn: (tx: Prisma.TransactionClient, institutionId: number) => Promise<T>
): Promise<T> {
  return withAdminSedeDb(request, (tx, ctx) => fn(tx, ctx.institutionId));
}

/** Solo rol institución (owner); operaciones como DELETE institución. */
export async function withOwnerTenantDb<T>(
  request: NextRequest,
  fn: (tx: Prisma.TransactionClient, institutionId: number) => Promise<T>
): Promise<T> {
  const { institutionId } = await requireInstitutionOwnerRole(request);
  await enforceSubscriptionForRequest(request, institutionId);
  return withDbTenant(institutionId, (tx) => fn(tx, institutionId));
}
