import { NextResponse } from 'next/server';
import { getDevConfirmPurchaseStatus } from '@/lib/payments/dev-confirm-purchase';

/** GET /api/payments/dev-confirm-status — diagnóstico sin exponer secretos */
export async function GET() {
  return NextResponse.json(getDevConfirmPurchaseStatus());
}
