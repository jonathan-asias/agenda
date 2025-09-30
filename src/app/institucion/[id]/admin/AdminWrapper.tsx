'use client';

import dynamic from 'next/dynamic';

// Dynamic import para evitar problemas de hidratación
const AdminContent = dynamic(() => import('./AdminContent'), {
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

// Dynamic import para el AuthGuard local
const AdminAuthGuard = dynamic(() => import('./AdminAuthGuard'), {
  ssr: false
});

export default function AdminWrapper() {
  return (
    <div suppressHydrationWarning={true}>
      <AdminAuthGuard>
        <AdminContent />
      </AdminAuthGuard>
    </div>
  );
}
