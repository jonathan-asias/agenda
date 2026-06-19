import type { NextRequest } from 'next/server';
import {
  approvePayment,
  type ApprovePaymentResult,
} from '@/lib/payments/approve-payment';

export type { ApprovePaymentResult };

export async function approvePaymentFromMercadoPago(params: {
  referencia: string;
  mpPaymentId: string;
  transactionAmount: number;
  request?: NextRequest;
}): Promise<ApprovePaymentResult> {
  return approvePayment({
    referencia: params.referencia,
    gatewayPaymentId: params.mpPaymentId,
    transactionAmount: params.transactionAmount,
    gateway: 'MERCADOPAGO',
    request: params.request,
  });
}
