/**
 * Seguridad multi-tenant para backend.
 * Previene acceso cruzado entre instituciones.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserRole as getAuthUserRoleFromAuth } from '@/lib/auth';
import { resolveInstitutionIdFromUser } from '@/lib/auth/resolveTenantFromUser';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { subscriptionErrorToResponse } from '@/lib/security/subscription-guard';
import type { UserRole } from '@/types/auth';

/** Error lanzado cuando el usuario intenta acceder a recursos de otra institución */
export class TenantAccessDeniedError extends Error {
  constructor(
    public userInstitutionId: number,
    public resourceInstitutionId: number
  ) {
    super(
      `Acceso denegado: el recurso pertenece a la institución ${resourceInstitutionId}, no a la del usuario (${userInstitutionId})`
    );
    this.name = 'TenantAccessDeniedError';
  }
}

/**
 * Verifica que el usuario tenga acceso al recurso de la institución indicada.
 * Lanza TenantAccessDeniedError si no coinciden.
 */
export function enforceTenant(
  userInstitutionId: number,
  resourceInstitutionId: number
): void {
  if (userInstitutionId !== resourceInstitutionId) {
    throw new TenantAccessDeniedError(userInstitutionId, resourceInstitutionId);
  }
}

/**
 * Obtiene el rol del usuario autenticado a partir de la sesión Supabase.
 * Integración con lib/auth para detección de rol.
 */
export async function getAuthUserRole(_request?: NextRequest): Promise<UserRole | null> {
  return getAuthUserRoleFromAuth();
}

/**
 * Email del usuario autenticado (sesión Supabase).
 */
export async function getAuthUserEmail(_request?: NextRequest): Promise<string | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.email?.trim().toLowerCase() ?? null;
  } catch {
    return null;
  }
}

/**
 * Obtiene el institutionId del usuario autenticado a partir de la sesión (cookies).
 * Retorna null si no hay sesión o no se pudo determinar la institución.
 */
export async function getAuthInstitutionId(
  _request?: NextRequest
): Promise<number | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return resolveInstitutionIdFromUser(user);
  } catch {
    return null;
  }
}

/**
 * Obtiene userInstitutionId y retorna 401 si no hay sesión.
 * Útil para rutas que requieren autenticación.
 */
export async function requireAuthInstitutionId(
  request?: NextRequest
): Promise<number> {
  const id = await getAuthInstitutionId(request);
  if (id == null) {
    throw new TenantAuthRequiredError();
  }
  return id;
}

/** Error cuando la ruta requiere autenticación y no hay sesión válida */
export class TenantAuthRequiredError extends Error {
  constructor() {
    super('Se requiere autenticación para acceder a este recurso');
    this.name = 'TenantAuthRequiredError';
  }
}

/** Mapea errores de tenant a respuestas HTTP. Uso: throw dentro de try, capturar y retornar. */
export function tenantErrorToResponse(error: unknown): NextResponse | null {
  const subscriptionResp = subscriptionErrorToResponse(error);
  if (subscriptionResp) return subscriptionResp;

  if (error instanceof TenantAuthRequiredError) {
    return NextResponse.json({ error: 'Se requiere autenticación' }, { status: 401 });
  }
  if (error instanceof TenantAccessDeniedError) {
    return NextResponse.json({ error: 'Acceso denegado a este recurso' }, { status: 403 });
  }
  return null;
}
