import { NextRequest, NextResponse } from 'next/server';
import { supabaseAuthEmailExists } from '@/lib/auth/resolveSupabaseUserId';
import { requireAdminRole, rbacErrorToResponse } from '@/lib/security/rbac';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const rate = checkRateLimit(request, 'auth-check-email', { max: 30, windowSec: 60 });
    if (!rate.ok) {
      return rateLimitResponse(rate.retryAfterSec ?? 60);
    }

    await requireAdminRole(request);

    const { email } = (await request.json()) as { email?: string };

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email es requerido' },
        { status: 400 }
      );
    }

    const normalized = email.trim().toLowerCase();
    const usuarioExiste = await supabaseAuthEmailExists(normalized);

    return NextResponse.json({
      success: true,
      exists: usuarioExiste,
    });
  } catch (error) {
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;

    console.error('Error en check-email:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
