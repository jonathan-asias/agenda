'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import Header from '../../Header';
import Footer from '../../Footer';
import AddCursoModal from '../modals/AddCursoModal';
import Skeleton from '@/components/ui/Skeleton';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

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
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState<CursoResumen | null>(null);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

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

  const handleEliminarCurso = async (curso: CursoResumen) => {
    if (!confirm(`¿Eliminar el curso "${curso.nombre}"? Esta acción no se puede deshacer.`)) return;
    setEliminandoId(curso.id);
    try {
      const res = await fetch(`/api/cursos/${curso.id}`, { method: 'DELETE' });
      if (res.ok) await handleRefetch();
      else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'No se pudo eliminar el curso');
      }
    } catch (err) {
      setError('Error al eliminar el curso');
    } finally {
      setEliminandoId(null);
    }
  };

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
                  <div className="flex flex-wrap gap-2 mt-3 justify-end">
                    <button
                      type="button"
                      onClick={() => { setSelectedCurso(curso); setShowViewModal(true); }}
                      className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      Ver
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEliminarCurso(curso)}
                      disabled={eliminandoId === curso.id}
                      className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      {eliminandoId === curso.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
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
        {showViewModal && selectedCurso && (
          <Modal
            open={showViewModal}
            onClose={() => { setShowViewModal(false); setSelectedCurso(null); }}
            title="Detalle del curso"
            size="md"
          >
            <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <p><span className="font-medium text-[var(--color-text-primary)]">Nombre:</span> {selectedCurso.nombre}</p>
              <p><span className="font-medium text-[var(--color-text-primary)]">Grado:</span> {selectedCurso.grado?.nombre} ({selectedCurso.grado?.nivel})</p>
              <p><span className="font-medium text-[var(--color-text-primary)]">Jornada:</span> {selectedCurso.jornada || 'No especificada'}</p>
              <p><span className="font-medium text-[var(--color-text-primary)]">Estudiantes:</span> {selectedCurso._count?.estudiantes ?? 0}</p>
            </div>
            <div className="pt-4 mt-4 border-t border-[var(--color-border-light)]">
              <Button type="button" variant="primary" fullWidth onClick={() => { setShowViewModal(false); setSelectedCurso(null); }}>
                Cerrar
              </Button>
            </div>
          </Modal>
        )}
        <Footer />
      </div>
    </AdminAuthGuard>
  );
}
