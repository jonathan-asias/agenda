'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import Header from '../../Header';
import Footer from '../../Footer';
import Skeleton from '@/components/ui/Skeleton';

interface AreaResumen {
  id: number;
  nombre: string;
  materias?: Array<{ id: number; nombre: string }>;
}

export default function AdminAreasPage() {
  const params = useParams();
  const institucionId = params?.id as string;
  const [areas, setAreas] = useState<AreaResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAreas = async () => {
      if (!institucionId) return;
      try {
        const response = await fetch(`/api/instituciones/${institucionId}/dashboard`);
        if (!response.ok) {
          setError('No se pudieron cargar las áreas');
          return;
        }
        const data = await response.json();
        setAreas(data?.datos?.areas || []);
      } catch (err) {
        console.error('Error cargando áreas:', err);
        setError('Error al cargar las áreas');
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, [institucionId]);

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-blue-50">
        <Header title="Áreas" subtitle="Panel de administración" />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Gestión de áreas</h2>
            <p className="text-slate-600 mb-4">Listado de áreas con sus materias.</p>

            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
                    <Skeleton className="h-4 w-48" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {error && !loading && <div className="text-red-600">{error}</div>}
            {!loading && !error && areas.length === 0 && (
              <div className="text-slate-600">No hay áreas registradas.</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {areas.map((area) => (
                <div key={area.id} className="border border-slate-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900">{area.nombre}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {area.materias?.length ? (
                      area.materias.map((materia) => (
                        <span
                          key={materia.id}
                          className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-700"
                        >
                          {materia.nombre}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">Sin materias</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </AdminAuthGuard>
  );
}
