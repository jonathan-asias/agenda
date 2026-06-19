import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthInstitutionId,
  getAuthUserRole,
  TenantAuthRequiredError,
  tenantErrorToResponse,
} from '@/lib/tenant';
import { subscriptionErrorToResponse } from '@/lib/security/subscription-guard';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { prismaBypass } from '@/lib/prisma-bypass';
import type { UserRole } from '@/types/auth';

/** Roles con acceso al panel y operaciones administrativas */
export const ADMIN_ROLES: UserRole[] = ['admin', 'institucion'];

/** Roles que pueden operar en el área académica (incluye docentes) */
export const STAFF_ROLES: UserRole[] = ['admin', 'institucion', 'docente'];

export class RoleAccessDeniedError extends Error {
  constructor(
    public readonly required: UserRole[],
    public readonly actual: UserRole | null
  ) {
    super('Acceso denegado: permisos insuficientes');
    this.name = 'RoleAccessDeniedError';
  }
}

export interface AuthContext {
  institutionId: number;
  role: UserRole;
}

export async function requireInstitutionAuth(
  request?: NextRequest
): Promise<AuthContext> {
  const institutionId = await getAuthInstitutionId(request);
  const role = await getAuthUserRole(request);

  if (institutionId == null || role == null) {
    throw new TenantAuthRequiredError();
  }

  return { institutionId, role };
}

export function assertRole(role: UserRole | null, allowed: UserRole[]): void {
  if (!role || !allowed.includes(role)) {
    throw new RoleAccessDeniedError(allowed, role);
  }
}

export async function requireRole(
  request: NextRequest | undefined,
  allowedRoles: UserRole[]
): Promise<AuthContext> {
  const ctx = await requireInstitutionAuth(request);
  assertRole(ctx.role, allowedRoles);
  return ctx;
}

export async function requireAdminRole(
  request?: NextRequest
): Promise<AuthContext> {
  return requireRole(request, ADMIN_ROLES);
}

export async function requireInstitutionOwnerRole(
  request?: NextRequest
): Promise<AuthContext> {
  return requireRole(request, ['institucion']);
}

/** ID del docente vinculado a la sesión Supabase actual (null si no es docente). */
export async function resolveSessionDocenteId(
  request?: NextRequest
): Promise<number | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const docente = await prismaBypass.docentes.findFirst({
    where: { auth_user_id: user.id },
    select: { id: true },
  });
  return docente?.id ?? null;
}

/** Docentes solo pueden actuar sobre su propio perfil; staff admin puede actuar en el tenant. */
export function assertDocenteSelfOrStaff(
  ctx: AuthContext,
  targetDocenteId: number,
  sessionDocenteId: number | null
): void {
  if (ctx.role === 'docente') {
    if (sessionDocenteId == null || sessionDocenteId !== targetDocenteId) {
      throw new RoleAccessDeniedError(['docente'], ctx.role);
    }
    return;
  }
  assertRole(ctx.role, ADMIN_ROLES);
}

/** Docentes solo pueden modificar recordatorios que les pertenecen. */
export async function assertDocenteOwnsRecordatorio(
  request: NextRequest | undefined,
  ctx: AuthContext,
  recordatorioDocenteId: number
): Promise<void> {
  if (ctx.role !== 'docente') return;
  const sessionDocenteId = await resolveSessionDocenteId(request);
  if (sessionDocenteId == null || sessionDocenteId !== recordatorioDocenteId) {
    throw new RoleAccessDeniedError(['docente'], ctx.role);
  }
}

export function rbacErrorToResponse(error: unknown): NextResponse | null {
  if (error instanceof RoleAccessDeniedError) {
    return NextResponse.json(
      { error: 'Acceso denegado: permisos insuficientes' },
      { status: 403 }
    );
  }
  const subscriptionResp = subscriptionErrorToResponse(error);
  if (subscriptionResp) return subscriptionResp;
  return tenantErrorToResponse(error);
}
