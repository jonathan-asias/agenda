import { getWompiApiBaseUrl, getWompiPrivateKey, isWompiConfigured } from '@/lib/wompi/config';

/** Desactiva un payment link en Wompi (evita nuevos cobros). */
export async function deactivateWompiPaymentLink(
  linkId: string
): Promise<{ ok: boolean; detail?: string }> {
  if (!isWompiConfigured()) {
    return { ok: false, detail: 'Wompi no configurado' };
  }

  const res = await fetch(
    `${getWompiApiBaseUrl()}/payment_links/${encodeURIComponent(linkId)}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getWompiPrivateKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ active: false }),
    }
  );

  if (!res.ok) {
    const detail = await res.text();
    return { ok: false, detail: detail.slice(0, 200) };
  }

  return { ok: true };
}
