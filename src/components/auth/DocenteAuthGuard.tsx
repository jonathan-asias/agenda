'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { verifyInstitutionAccess } from '@/lib/security';

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
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || loading) return;

    const verifyDocente = async () => {
      if (!user?.email) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`/api/docentes/by-email/${encodeURIComponent(user.email)}`);
        if (!response.ok) {
          router.push('/login');
          return;
        }

        const data = await response.json();
        // docente.institucionId (API devuelve institucion.id)
        const docenteInstitucionId = (data.docente?.institucion_id ?? data.docente?.institucion?.id) as number | undefined;
        const routeId = params?.id as string | undefined;

        // CRÍTICO SaaS: docente solo puede acceder a la ruta de su institución (docente.institucionId === params.id).
        if (docenteInstitucionId !== Number(routeId) || !verifyInstitutionAccess(docenteInstitucionId, routeId)) {
          if (docenteInstitucionId != null) {
            router.replace(`/institucion/${docenteInstitucionId}/docente`);
          } else {
            router.push('/login');
          }
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Error verificando docente:', error);
        router.push('/login');
      } finally {
        setVerifying(false);
      }
    };

    verifyDocente();
  }, [isMounted, user, loading, params?.id, router]);

  if (!isMounted || loading || verifying) {
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
