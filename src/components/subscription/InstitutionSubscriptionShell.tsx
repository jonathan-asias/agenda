'use client';

import type { ReactNode } from 'react';
import { SubscriptionAccessProvider } from '@/contexts/SubscriptionAccessContext';
import SubscriptionAccessBanner from '@/components/subscription/SubscriptionAccessBanner';
import TrialBillingOnlyGate from '@/components/subscription/TrialBillingOnlyGate';

export default function InstitutionSubscriptionShell({
  institutionId,
  children,
}: {
  institutionId: number;
  children: ReactNode;
}) {
  return (
    <SubscriptionAccessProvider institutionId={institutionId}>
      <SubscriptionAccessBanner />
      <TrialBillingOnlyGate>{children}</TrialBillingOnlyGate>
    </SubscriptionAccessProvider>
  );
}
