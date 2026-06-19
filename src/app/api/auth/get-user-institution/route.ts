import { NextRequest, NextResponse } from 'next/server';
import { getUserRoleAndInstitutionByEmail } from '@/lib/auth';
import { getAuthUserEmail } from '@/lib/tenant';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';

/**
 * POST /api/auth/get-user-institution
 * Solo sesión autenticada: devuelve rol e institutionId del usuario actual.
 */
export async function POST(request: NextRequest) {
  try {
    const rate = checkRateLimit(request, 'auth-get-user-institution', { max: 30, windowSec: 60 });
    if (!rate.ok) {
      return rateLimitResponse(rate.retryAfterSec ?? 60);
    }

    const sessionEmail = await getAuthUserEmail(request);

    if (!sessionEmail) {
      return NextResponse.json(
        { error: 'Se requiere autenticación' },
        { status: 401 }
      );
    }

    const info = await getUserRoleAndInstitutionByEmail(sessionEmail);

    if (info) {
      return NextResponse.json(
        { institutionId: info.institutionId, role: info.role },
        { status: 200 }
      );
    }

    return NextResponse.json({ institutionId: null, role: null }, { status: 200 });
  } catch (error) {
    console.error('Error determining user institution:', error);
    return NextResponse.json({ institutionId: null, role: null }, { status: 200 });
  }
}
