'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { verifyInstitutionAccess } from '@/lib/security';
import type { UserRole } from '@/types/auth';
import InstitutionSubscriptionShell from '@/components/subscription/InstitutionSubscriptionShell';

const ADMIN_PANEL_ROLES: UserRole[] = ['admin', 'institucion'];

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { user, loading, institutionId, role, signOut } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (institutionId == null || role == null) {
      router.push('/login');
      return;
    }

    if (!ADMIN_PANEL_ROLES.includes(role)) {
      if (role === 'docente') {
        router.replace(`/institucion/${institutionId}/docente`);
      } else {
        router.push('/login');
      }
      return;
    }

    const routeId = params?.id as string | undefined;
    if (!routeId) {
      router.push('/login');
      return;
    }

    if (institutionId !== Number(routeId) || !verifyInstitutionAccess(institutionId, routeId)) {
      router.replace(`/institucion/${institutionId}/admin`);
      return;
    }

    let cancelled = false;

    const verifySubscription = async () => {
      try {
        const res = await fetch(`/api/instituciones/${routeId}/subscription-access`);
        if (!res.ok) {
          if (!cancelled) setIsAuthorized(true);
          return;
        }
        const data = await res.json();
        if (!data.canLogin) {
          await signOut();
          router.push(
            `/login?subscription=blocked&message=${encodeURIComponent(data.message ?? '')}`
          );
          return;
        }
        if (!cancelled) setIsAuthorized(true);
      } catch {
        if (!cancelled) setIsAuthorized(true);
      }
    };

    verifySubscription();

    return () => {
      cancelled = true;
    };
  }, [isMounted, user, loading, institutionId, role, params?.id, router, signOut]);

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized || institutionId == null) return null;

  return (
    <InstitutionSubscriptionShell institutionId={institutionId}>
      {children}
    </InstitutionSubscriptionShell>
  );
}
