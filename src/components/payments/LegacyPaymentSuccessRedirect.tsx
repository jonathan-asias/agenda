'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function LegacyRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('payment') !== 'success') return;
    const q = new URLSearchParams();
    const ref = searchParams.get('ref');
    const email = searchParams.get('email');
    if (ref) q.set('ref', ref);
    if (email) q.set('email', email);
    router.replace(`/pago-exitoso?${q.toString()}`);
  }, [searchParams, router]);

  return null;
}

/** Redirige URLs antiguas `/?payment=success` hacia /pago-exitoso. */
export default function LegacyPaymentSuccessRedirect() {
  return (
    <Suspense fallback={null}>
      <LegacyRedirect />
    </Suspense>
  );
}
