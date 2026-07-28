'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useSubscriptionAccess } from '@/contexts/SubscriptionAccessContext';

export default function TrialBillingOnlyGate({ children }: { children: ReactNode }) {
  const { mode, loading } = useSubscriptionAccess();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  useEffect(() => {
    if (loading || mode !== 'trial_billing_only' || !id) return;
    const perfilPath = `/institucion/${id}/perfil`;
    if (!pathname.startsWith(perfilPath)) {
      router.replace(`${perfilPath}?trial_expired=1`);
    }
  }, [loading, mode, pathname, id, router]);

  if (loading) return null;

  if (mode === 'trial_billing_only' && id) {
    const perfilPath = `/institucion/${id}/perfil`;
    if (!pathname.startsWith(perfilPath)) {
      return null;
    }
  }

  return <>{children}</>;
}
