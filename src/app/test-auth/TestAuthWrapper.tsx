'use client';

import dynamic from 'next/dynamic';

// Dynamic import para evitar problemas de hidratación
const TestAuthContent = dynamic(() => import('./TestAuthContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Cargando...</p>
      </div>
    </div>
  )
});

// Dynamic import para el AuthGuard
const AuthGuard = dynamic(() => import('./AuthGuard'), {
  ssr: false
});

export default function TestAuthWrapper() {
  return (
    <div suppressHydrationWarning={true}>
      <AuthGuard>
        <TestAuthContent />
      </AuthGuard>
    </div>
  );
}
