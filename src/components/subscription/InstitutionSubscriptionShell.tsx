'use client';

import type { ReactNode } from 'react';
import { SubscriptionAccessProvider } from '@/contexts/SubscriptionAccessContext';

export default function InstitutionSubscriptionShell({
  institutionId,
  children,
}: {
  institutionId: number;
  children: ReactNode;
}) {
  return (
    <SubscriptionAccessProvider institutionId={institutionId}>
      {children}
    </SubscriptionAccessProvider>
  );
}
