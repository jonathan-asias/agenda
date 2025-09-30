'use client';

import { useUnifiedAuth } from '../../../../contexts/UnifiedAuthContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboardContent() {
  const { administrador, signOut } = useUnifiedAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (!administrador) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando información del administrador...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Panel de Administrador
              </h1>
              <p className="text-slate-600">
                {administrador.institucion.nombre}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">
                  {administrador.nombre} {administrador.apellido}
                </p>
                <p className="text-sm text-slate-600">{administrador.cargo}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información Personal */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Información Personal
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">Nombre completo</p>
                <p className="font-medium text-slate-900">
                  {administrador.nombre} {administrador.apellido}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Correo electrónico</p>
                <p className="font-medium text-slate-900">{administrador.correo}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Cargo</p>
                <p className="font-medium text-slate-900">{administrador.cargo}</p>
              </div>
            </div>
          </div>

          {/* Información de la Institución */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Institución
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">Nombre</p>
                <p className="font-medium text-slate-900">
                  {administrador.institucion.nombre}
                </p>
              </div>
              {administrador.sede && (
                <div>
                  <p className="text-sm text-slate-600">Sede</p>
                  <p className="font-medium text-slate-900">
                    {administrador.sede.nombre}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
