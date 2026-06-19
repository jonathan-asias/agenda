import { NextRequest, NextResponse } from 'next/server';
import {
  isPlatformAdminConfigured,
  platformAdminErrorToResponse,
  requirePlatformAdmin,
} from '@/lib/security/platform-admin';

export async function GET(request: NextRequest) {
  try {
    if (!isPlatformAdminConfigured()) {
      return NextResponse.json(
        { authorized: false, configured: false, error: 'Panel no configurado' },
        { status: 503 }
      );
    }

    const { email } = await requirePlatformAdmin(request);
    return NextResponse.json({ authorized: true, configured: true, email });
  } catch (error) {
    const resp = platformAdminErrorToResponse(error);
    if (resp) return resp;
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
