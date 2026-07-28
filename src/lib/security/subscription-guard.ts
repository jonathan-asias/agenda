import { NextRequest, NextResponse } from 'next/server';
import {
  resolveInstitutionSubscriptionAccess,
  type InstitutionSubscriptionAccess,
} from '@/lib/subscription/institution-access';

export class SubscriptionAccessError extends Error {
  constructor(public access: InstitutionSubscriptionAccess) {
    super(access.message);
    this.name = 'SubscriptionAccessError';
  }
}

export class SubscriptionWriteDeniedError extends Error {
  constructor(public access: InstitutionSubscriptionAccess) {
    super(access.message);
    this.name = 'SubscriptionWriteDeniedError';
  }
}

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function isWriteMethod(method: string | undefined): boolean {
  return WRITE_METHODS.has(method?.toUpperCase() ?? '');
}

/** Rutas permitidas en periodo de gracia o prueba vencida (solo renovación / cierre). */
function isSubscriptionWriteExempt(pathname: string): boolean {
  return (
    /\/api\/instituciones\/\d+\/plan\/change-checkout$/i.test(pathname) ||
    /\/api\/instituciones\/\d+\/plan\/cancel$/i.test(pathname) ||
    /\/api\/instituciones\/\d+\/delete-account$/i.test(pathname)
  );
}

export async function enforceInstitutionReadAccess(
  institutionId: number,
  role?: import('@/types/auth').UserRole | null
): Promise<InstitutionSubscriptionAccess> {
  const access = await resolveInstitutionSubscriptionAccess(institutionId, role);
  if (access.mode === 'blocked') {
    throw new SubscriptionAccessError(access);
  }
  return access;
}

export async function enforceInstitutionWriteAccess(
  institutionId: number,
  request?: NextRequest,
  role?: import('@/types/auth').UserRole | null
): Promise<InstitutionSubscriptionAccess> {
  const access = await enforceInstitutionReadAccess(institutionId, role);

  if (access.mode === 'full') {
    return access;
  }

  const pathname = request?.nextUrl.pathname ?? '';
  if (request && isWriteMethod(request.method) && isSubscriptionWriteExempt(pathname)) {
    return access;
  }

  throw new SubscriptionWriteDeniedError(access);
}

export function subscriptionErrorToResponse(error: unknown): NextResponse | null {
  if (error instanceof SubscriptionAccessError) {
    return NextResponse.json(
      {
        error: error.access.message,
        code: 'SUBSCRIPTION_BLOCKED',
        subscriptionAccess: error.access,
      },
      { status: 403 }
    );
  }

  if (error instanceof SubscriptionWriteDeniedError) {
    return NextResponse.json(
      {
        error: error.access.message,
        code: 'SUBSCRIPTION_READ_ONLY',
        subscriptionAccess: error.access,
      },
      { status: 403 }
    );
  }

  return null;
}
