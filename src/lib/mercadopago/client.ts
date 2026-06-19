const MP_API_BASE = 'https://api.mercadopago.com';

export interface MercadoPagoPreferenceItem {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
}

export interface CreatePreferenceInput {
  items: MercadoPagoPreferenceItem[];
  payerEmail: string;
  payerName?: string;
  externalReference: string;
  notificationUrl?: string;
  successUrl: string;
  failureUrl: string;
  pendingUrl: string;
  autoReturn?: boolean;
}

export interface MercadoPagoPreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
}

export interface MercadoPagoPaymentResponse {
  id: number;
  status: string;
  status_detail: string;
  transaction_amount: number;
  external_reference: string;
  payer?: { email?: string };
}

function getAccessToken(): string {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
  if (!token) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN no configurado');
  }
  return token;
}

export function isMercadoPagoConfigured(): boolean {
  return Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN?.trim());
}

export async function createCheckoutPreference(
  input: CreatePreferenceInput
): Promise<MercadoPagoPreferenceResponse> {
  const body: Record<string, unknown> = {
    items: input.items,
    payer: {
      email: input.payerEmail,
      ...(input.payerName ? { name: input.payerName } : {}),
    },
    external_reference: input.externalReference,
    back_urls: {
      success: input.successUrl,
      failure: input.failureUrl,
      pending: input.pendingUrl,
    },
  };

  if (input.notificationUrl) {
    body.notification_url = input.notificationUrl;
  }

  if (input.autoReturn) {
    body.auto_return = 'approved';
  }

  const res = await fetch(`${MP_API_BASE}/checkout/preferences`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('Mercado Pago create preference error:', res.status, errText);
    throw new Error('Error al crear preferencia de pago');
  }

  return (await res.json()) as MercadoPagoPreferenceResponse;
}

export async function getPaymentById(paymentId: string): Promise<MercadoPagoPaymentResponse> {
  const res = await fetch(`${MP_API_BASE}/v1/payments/${paymentId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('Mercado Pago get payment error:', res.status, errText);
    throw new Error('Error al consultar pago en Mercado Pago');
  }

  return (await res.json()) as MercadoPagoPaymentResponse;
}

interface MercadoPagoSearchResponse {
  results?: MercadoPagoPaymentResponse[];
}

/** Busca pagos MP por external_reference (útil en sandbox sin webhook). */
export async function searchPaymentsByReference(
  externalReference: string
): Promise<MercadoPagoPaymentResponse[]> {
  const params = new URLSearchParams({
    external_reference: externalReference,
    sort: 'date_created',
    criteria: 'desc',
  });

  const res = await fetch(`${MP_API_BASE}/v1/payments/search?${params}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('Mercado Pago search payment error:', res.status, errText);
    throw new Error('Error al buscar pago en Mercado Pago');
  }

  const data = (await res.json()) as MercadoPagoSearchResponse;
  return data.results ?? [];
}

export interface MercadoPagoMerchantOrder {
  id: number;
  external_reference?: string;
  payments?: Array<{ id: number; status?: string }>;
}

export async function getMerchantOrderById(
  orderId: string
): Promise<MercadoPagoMerchantOrder> {
  const res = await fetch(`${MP_API_BASE}/merchant_orders/${orderId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('Mercado Pago get merchant_order error:', res.status, errText);
    throw new Error('Error al consultar orden en Mercado Pago');
  }

  return (await res.json()) as MercadoPagoMerchantOrder;
}
