'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';

interface DocenteAuthGuardProps {
  children: React.ReactNode;
}

export default function DocenteAuthGuard({ children }: DocenteAuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Marcar como montado en el cliente
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Solo verificar autenticación después de que el componente esté montado
    if (isMounted && !loading) {
      const verifyDocente = async () => {
        if (!user) {
          router.push('/login');
          return;
        }
        
        if (!user.email) {
          router.push('/login');
          return;
        }

        try {
          // Verificar que el docente existe y pertenece a esta institución
          const response = await fetch(`/api/docentes/by-email/${encodeURIComponent(user.email)}`);
          if (response.ok) {
            const data = await response.json();
            const docenteInstitucionId = data.docente?.institucion?.id;
            const routeInstitucionId = parseInt(params.id as string);

            // Verificar que el docente pertenece a la institución de la ruta
            if (docenteInstitucionId && docenteInstitucionId === routeInstitucionId) {
              setIsAuthorized(true);
            } else {
              router.push('/login');
            }
          } else {
            router.push('/login');
          }
        } catch (error) {
          console.error('Error verificando docente:', error);
          router.push('/login');
        } finally {
          setVerifying(false);
        }
      };

      verifyDocente();
    }
  }, [isMounted, user, loading, params.id, router]);

  // Mostrar loading durante la hidratación y verificación
  if (!isMounted || loading || verifying) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando autenticación...</p>
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

