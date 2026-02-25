'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import Header from '../../Header';
import Footer from '../../Footer';
import AddCursoModal from '../modals/AddCursoModal';
import Skeleton from '@/components/ui/Skeleton';

interface CursoResumen {
  id: number;
  nombre: string;
  jornada?: string | null;
  grado?: { nombre: string; nivel: string };
  _count?: { estudiantes: number };
}

export default function AdminCursosPage() {
  const params = useParams();
  const institucionId = params?.id as string;
  const [cursos, setCursos] = useState<CursoResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchCursos = async () => {
      if (!institucionId) return;
      try {
        const response = await fetch(`/api/instituciones/${institucionId}/dashboard`);
        if (!response.ok) {
          setError('No se pudieron cargar los cursos');
          return;
        }
        const data = await response.json();
        setCursos(data?.datos?.cursos || []);
      } catch (err) {
        console.error('Error cargando cursos:', err);
        setError('Error al cargar los cursos');
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, [institucionId]);

  const handleRefetch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/instituciones/${institucionId}/dashboard`);
      if (!response.ok) {
        setError('No se pudieron cargar los cursos');
        return;
      }
      const data = await response.json();
      setCursos(data?.datos?.cursos || []);
    } catch (err) {
      console.error('Error cargando cursos:', err);
      setError('Error al cargar los cursos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-blue-50">
        <Header title="Cursos" subtitle="Panel de administración" />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">Gestión de cursos</h2>
                <p className="text-slate-600">Listado de cursos por grado.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Agregar curso
              </button>
            </div>

            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))}
              </div>
            )}
            {error && !loading && <div className="text-red-600">{error}</div>}
            {!loading && !error && cursos.length === 0 && (
              <div className="text-slate-600">No hay cursos registrados.</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cursos.map((curso) => (
                <div key={curso.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{curso.nombre}</h3>
                      <p className="text-sm text-slate-500">
                        {curso.grado?.nombre} · {curso.grado?.nivel}
                      </p>
                    </div>
                    <div className="text-sm text-slate-600">
                      {curso._count?.estudiantes ?? 0} estudiante(s)
                    </div>
                  </div>
                  {curso.jornada && (
                    <p className="mt-2 text-xs text-slate-500">Jornada: {curso.jornada}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
        <AddCursoModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          institucionId={Number(institucionId)}
          onSuccess={handleRefetch}
        />
        <Footer />
      </div>
    </AdminAuthGuard>
  );
}
