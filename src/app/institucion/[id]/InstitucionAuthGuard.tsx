'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';

interface InstitucionAuthGuardProps {
  children: React.ReactNode;
  institucionId: number;
}

export default function InstitucionAuthGuard({ children, institucionId }: InstitucionAuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Marcar como montado en el cliente
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Solo verificar autenticación después de que el componente esté montado
    if (isMounted && !loading) {
      if (!user) {
        router.push('/login');
        return;
      }
      
      // Simplemente autorizar si hay usuario (el login ya verificó todo)
      setIsAuthorized(true);
    }
  }, [isMounted, user, loading, router]);

  // Mostrar loading durante la hidratación y verificación
  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando acceso a la institución...</p>
        </div>
      </div>
    );
  }

  // Si no está autorizado, no mostrar nada
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
