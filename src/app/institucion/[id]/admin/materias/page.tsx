'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import Header from '../../Header';
import Footer from '../../Footer';
import AddMateriaModal from '../modals/AddMateriaModal';
import Skeleton from '@/components/ui/Skeleton';

interface MateriaResumen {
  id: number;
  nombre: string;
  area?: { nombre: string };
  _count?: { materiaGrados: number };
}

export default function AdminMateriasPage() {
  const params = useParams();
  const institucionId = params?.id as string;
  const [materias, setMaterias] = useState<MateriaResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMateria, setSelectedMateria] = useState<MateriaResumen | null>(null);

  useEffect(() => {
    const fetchMaterias = async () => {
      if (!institucionId) return;
      try {
        const response = await fetch(`/api/instituciones/${institucionId}/dashboard`);
        if (!response.ok) {
          setError('No se pudieron cargar las materias');
          return;
        }
        const data = await response.json();
        setMaterias(data?.datos?.materias || []);
      } catch (err) {
        console.error('Error cargando materias:', err);
        setError('Error al cargar las materias');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterias();
  }, [institucionId]);

  const handleRefetch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/instituciones/${institucionId}/dashboard`);
      if (!response.ok) {
        setError('No se pudieron cargar las materias');
        return;
      }
      const data = await response.json();
      setMaterias(data?.datos?.materias || []);
    } catch (err) {
      console.error('Error cargando materias:', err);
      setError('Error al cargar las materias');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-blue-50">
        <Header title="Materias" subtitle="Panel de administración" />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">Gestión de materias</h2>
                <p className="text-slate-600">Listado de materias por área.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Agregar materia
              </button>
            </div>

            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            )}
            {error && !loading && <div className="text-red-600">{error}</div>}
            {!loading && !error && materias.length === 0 && (
              <div className="text-slate-600">No hay materias registradas.</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materias.map((materia) => (
                <div key={materia.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{materia.nombre}</h3>
                      <p className="text-sm text-slate-500">{materia.area?.nombre}</p>
                    </div>
                    <div className="text-xs text-slate-600">
                      {materia._count?.materiaGrados ?? 0} grado(s)
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 justify-end">
                    <button
                      type="button"
                      onClick={() => { setSelectedMateria(materia); setShowViewModal(true); }}
                      className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      Ver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <AddMateriaModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          institucionId={Number(institucionId)}
          onSuccess={handleRefetch}
        />
        {showViewModal && selectedMateria && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Detalle de la materia</h3>
                <button type="button" onClick={() => { setShowViewModal(false); setSelectedMateria(null); }} className="text-slate-500 hover:text-slate-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <p className="text-slate-700"><span className="font-medium">Nombre:</span> {selectedMateria.nombre}</p>
              <p className="text-slate-700 mt-2"><span className="font-medium">Área:</span> {selectedMateria.area?.nombre || 'Sin área'}</p>
              <p className="text-slate-700 mt-2"><span className="font-medium">Grados asignados:</span> {selectedMateria._count?.materiaGrados ?? 0}</p>
            </div>
          </div>
        )}
        <Footer />
      </div>
    </AdminAuthGuard>
  );
}
