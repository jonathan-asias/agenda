import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export class PlatformAdminAccessDeniedError extends Error {
  constructor(message = 'Acceso denegado al panel de gestión') {
    super(message);
    this.name = 'PlatformAdminAccessDeniedError';
  }
}

export function getPlatformAdminEmails(): string[] {
  const raw = process.env.PLATFORM_ADMIN_EMAILS?.trim();
  if (!raw) return [];
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isPlatformAdminConfigured(): boolean {
  return getPlatformAdminEmails().length > 0;
}

export function isPlatformAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return getPlatformAdminEmails().includes(normalized);
}

export async function requirePlatformAdmin(
  _request?: NextRequest
): Promise<{ email: string }> {
  if (!isPlatformAdminConfigured()) {
    throw new PlatformAdminAccessDeniedError(
      'Panel no configurado. Defina PLATFORM_ADMIN_EMAILS.'
    );
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email) {
    throw new PlatformAdminAccessDeniedError('Sesión requerida');
  }

  if (!isPlatformAdminEmail(user.email)) {
    throw new PlatformAdminAccessDeniedError(
      'Su cuenta no tiene permisos de gestión interna'
    );
  }

  return { email: user.email.trim().toLowerCase() };
}

export function platformAdminErrorToResponse(error: unknown): NextResponse | null {
  if (error instanceof PlatformAdminAccessDeniedError) {
    return NextResponse.json({ error: error.message, code: 'PLATFORM_ADMIN_DENIED' }, { status: 403 });
  }
  return null;
}
