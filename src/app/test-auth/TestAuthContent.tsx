'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function TestAuthContent() {
  const { user, institutionId } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                🔐 Prueba de Autenticación
              </h1>
              <p className="text-slate-600">
                Página protegida - Solo usuarios autenticados pueden acceder
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </button>
          </div>
        </div>

        {/* Información del Usuario */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Datos del Usuario */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">👤 Información del Usuario</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                <p className="text-slate-800 font-medium">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">ID de Usuario</label>
                <p className="text-slate-800 font-medium font-mono text-sm">{user?.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Último Acceso</label>
                <p className="text-slate-800 font-medium">
                  {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Datos de la Institución */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">🏢 Información de la Institución</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">ID de Institución</label>
                <p className="text-slate-800 font-medium font-mono">{institutionId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Estado de Autenticación</label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✅ Autenticado
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Nivel de Acceso</label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  🔑 Administrador
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pruebas de Seguridad */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">🛡️ Pruebas de Seguridad</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-medium text-slate-800 mb-2">Protección de Ruta</h3>
              <p className="text-sm text-slate-600 mb-2">
                Esta página está protegida y solo es accesible para usuarios autenticados.
              </p>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ Protegida
              </span>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-medium text-slate-800 mb-2">Redirección Automática</h3>
              <p className="text-sm text-slate-600 mb-2">
                Los usuarios no autenticados son redirigidos automáticamente al login.
              </p>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ Activa
              </span>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-medium text-slate-800 mb-2">Verificación de Institución</h3>
              <p className="text-sm text-slate-600 mb-2">
                Se verifica que el usuario tenga una institución asociada.
              </p>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ Verificada
              </span>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-medium text-slate-800 mb-2">Acceso por URL</h3>
              <p className="text-sm text-slate-600 mb-2">
                Copiar esta URL en otra pestaña sin estar logueado resultará en redirección.
              </p>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ Bloqueado
              </span>
            </div>
          </div>
        </div>

        {/* Instrucciones de Prueba */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">🧪 Instrucciones de Prueba</h2>
          <div className="space-y-3 text-blue-700">
            <p><strong>1.</strong> Cierra sesión y trata de acceder a esta URL directamente</p>
            <p><strong>2.</strong> Copia esta URL en una pestaña privada/incógnito</p>
            <p><strong>3.</strong> Verifica que siempre redirija al login si no estás autenticado</p>
            <p><strong>4.</strong> Confirma que solo usuarios con institución asociada puedan acceder</p>
          </div>
        </div>
      </div>
    </div>
  );
}
