'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUnifiedAuth } from '../contexts/UnifiedAuthContext';

interface UnifiedAuthGuardProps {
  children: React.ReactNode;
  allowedUserTypes?: ('institucion' | 'administrador')[];
  redirectTo?: string;
}

export default function UnifiedAuthGuard({ 
  children, 
  allowedUserTypes = ['institucion', 'administrador'],
  redirectTo = '/login'
}: UnifiedAuthGuardProps) {
  const { user, loading, userType } = useUnifiedAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || loading) return;

    if (!user || !userType || !allowedUserTypes.includes(userType)) {
      router.push(redirectTo);
    }
  }, [isMounted, loading, user, userType, allowedUserTypes, redirectTo, router]);

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!user || !userType || !allowedUserTypes.includes(userType)) {
    return null;
  }

  return <>{children}</>;
}
