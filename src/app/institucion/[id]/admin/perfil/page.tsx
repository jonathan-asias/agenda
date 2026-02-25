'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import Footer from '../../Footer';
import Header from '../../Header';

import type { Administrador } from '@/types';

export default function AdminPerfilPage() {
  const params = useParams();
  const { user } = useAuth();
  const [administrador, setAdministrador] = useState<Administrador | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdministrador = async () => {
      if (!user?.email) {
        setError('Usuario no autenticado');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/administradores/by-email/${encodeURIComponent(user.email)}`);
        if (response.ok) {
          const data = await response.json();
          setAdministrador(data.administrador);
        } else {
          setError('Administrador no encontrado');
        }
      } catch (error) {
        console.error('Error al cargar el administrador:', error);
        setError('Error al cargar el administrador');
      } finally {
        setLoading(false);
      }
    };

    fetchAdministrador();
  }, [user]);

  if (loading) {
    return (
      <AdminAuthGuard>
        <div className="min-h-screen bg-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando perfil del administrador...</p>
          </div>
        </div>
      </AdminAuthGuard>
    );
  }

  if (error || !administrador) {
    return (
      <AdminAuthGuard>
        <div className="min-h-screen bg-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Perfil no encontrado</h1>
            <p className="text-slate-600 mb-6">{error}</p>
            <Link 
              href={`/institucion/${params.id}/admin`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </AdminAuthGuard>
    );
  }

  return (
    <AdminAuthGuard>
      <Header 
        title={`Perfil de ${administrador.nombre} ${administrador.apellido}`} 
        subtitle="Información del administrador"
        showBranding
      />
      <div className="min-h-screen bg-blue-50 flex flex-col">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          {/* Botones de acción */}
          <div className="mb-8 flex flex-wrap gap-3">
            <Link
              href={`/institucion/${params.id}/admin`}
              className="inline-flex items-center px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al Dashboard
            </Link>
          </div>

          {/* Información Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Información Personal */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Información Personal</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Nombre Completo</label>
                  <p className="text-slate-800 font-medium text-lg">
                    {administrador.nombre} {administrador.apellido}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Correo Electrónico</label>
                  <p className="text-slate-800 font-medium">{administrador.correo}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Cargo</label>
                  <p className="text-slate-800 font-medium">{administrador.cargo}</p>
                </div>
              </div>
            </div>

            {/* Información Institucional */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Información Institucional</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Institución</label>
                  <p className="text-slate-800 font-medium text-lg">{administrador.institucion.nombre}</p>
                </div>
                {administrador.sede ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Sede</label>
                    <p className="text-slate-800 font-medium">{administrador.sede.nombre}</p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Sede</label>
                    <p className="text-slate-500 italic">No asignada</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </AdminAuthGuard>
  );
}

