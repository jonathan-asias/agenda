'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { verifyInstitutionAccess } from '@/lib/security';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { user, loading, institutionId } = useAuth();
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

    if (institutionId == null) {
      router.push('/login');
      return;
    }

    const routeId = params?.id as string | undefined;
    if (!routeId) {
      router.push('/login');
      return;
    }

    // CRÍTICO SaaS: params.id debe coincidir con la institución del admin. Nunca acceso cruzado.
    if (institutionId !== Number(routeId) || !verifyInstitutionAccess(institutionId, routeId)) {
      router.replace(`/institucion/${institutionId}/admin`);
      return;
    }

    setIsAuthorized(true);
  }, [isMounted, user, loading, institutionId, params?.id, router]);

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

  if (!isAuthorized) return null;

  return <>{children}</>;
}
