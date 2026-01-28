'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminAuthGuard from '../AdminAuthGuard';
import Header from '../../Header';
import Footer from '../../Footer';
import Skeleton from '../../../../../components/ui/Skeleton';

interface CursoResumen {
  id: number;
  nombre: string;
  jornada?: string | null;
}

interface GradoResumen {
  id: number;
  nombre: string;
  nivel: string;
  cursos: CursoResumen[];
  _count?: { estudiantes: number };
}

export default function AdminGradosPage() {
  const params = useParams();
  const institucionId = params?.id as string;
  const [grados, setGrados] = useState<GradoResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGrados = async () => {
      if (!institucionId) return;
      try {
        const response = await fetch(`/api/instituciones/${institucionId}/dashboard`);
        if (!response.ok) {
          setError('No se pudieron cargar los grados');
          return;
        }
        const data = await response.json();
        setGrados(data?.datos?.grados || []);
      } catch (err) {
        console.error('Error cargando grados:', err);
        setError('Error al cargar los grados');
      } finally {
        setLoading(false);
      }
    };

    fetchGrados();
  }, [institucionId]);

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-blue-50">
        <Header title="Grados" subtitle="Panel de administración" />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Gestión de grados</h2>
            <p className="text-slate-600 mb-4">Listado de grados y sus cursos asociados.</p>

            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-14" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {error && !loading && (
              <div className="text-red-600">{error}</div>
            )}
            {!loading && !error && grados.length === 0 && (
              <div className="text-slate-600">No hay grados registrados.</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grados.map((grado) => (
                <div key={grado.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{grado.nombre}</h3>
                      <p className="text-sm text-slate-500">{grado.nivel}</p>
                    </div>
                    <div className="text-sm text-slate-600">
                      {grado._count?.estudiantes ?? 0} estudiante(s)
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {grado.cursos?.length ? (
                      grado.cursos.map((curso) => (
                        <span
                          key={curso.id}
                          className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-700"
                        >
                          {curso.nombre}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">Sin cursos</span>
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
