/**
 * Seguridad multi-tenant para backend.
 * Previene acceso cruzado entre instituciones.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getAuthUserRole as getAuthUserRoleFromAuth } from '@/lib/auth';
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
      error
    } = await supabase.auth.getUser();

    if (error || !user?.email) {
      console.log('AUTH USER:', user?.email ?? '(none)', error?.message ?? '');
      console.log('AUTH INSTITUTION ID:', null);
      return null;
    }

    const email = user.email.trim();

    // Admin
    const admin = await prisma.administradores.findUnique({
      where: { correo: email },
      select: { institucion_id: true, supabase_user_id: true }
    });
    if (admin?.institucion_id != null) {
      const institutionId = admin.institucion_id;
      console.log('AUTH USER:', user?.email);
      console.log('AUTH INSTITUTION ID:', institutionId);
      return institutionId;
    }

    // Docente
    const docente = await prisma.docentes.findUnique({
      where: { email },
      select: { institucion_id: true }
    });
    if (docente?.institucion_id != null) {
      const institutionId = docente.institucion_id;
      console.log('AUTH USER:', user?.email);
      console.log('AUTH INSTITUTION ID:', institutionId);
      return institutionId;
    }

    // Institución
    const inst = await prisma.instituciones.findUnique({
      where: { email },
      select: { id: true }
    });
    if (inst?.id != null) {
      const institutionId = inst.id;
      console.log('AUTH USER:', user?.email);
      console.log('AUTH INSTITUTION ID:', institutionId);
      return institutionId;
    }

    console.log('AUTH USER:', user?.email);
    console.log('AUTH INSTITUTION ID:', null);
    return null;
  } catch (e) {
    console.log('AUTH USER:', '(exception)');
    console.log('AUTH INSTITUTION ID:', null);
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
  if (error instanceof TenantAuthRequiredError) {
    return NextResponse.json({ error: 'Se requiere autenticación' }, { status: 401 });
  }
  if (error instanceof TenantAccessDeniedError) {
    return NextResponse.json({ error: 'Acceso denegado a este recurso' }, { status: 403 });
  }
  return null;
}
