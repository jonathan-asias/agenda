'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import Header from '../../Header';
import Footer from '../../Footer';
import AddEstudianteModal from '../modals/AddEstudianteModal';
import ViewEstudianteModal from '../modals/ViewEstudianteModal';
import EditEstudianteModal from '../modals/EditEstudianteModal';
import DeleteEstudianteModal from '../modals/DeleteEstudianteModal';
import { Button, Card, LoaderPage, Skeleton } from '@/components/ui';

interface EstudianteResumen {
  id: number;
  nombres: string;
  apellidos: string;
  codigo_estudiantil: string;
  grado?: { nombre: string; nivel: string };
  curso?: { nombre: string; jornada?: string | null };
}

export default function AdminEstudiantesPage() {
  const params = useParams();
  const institucionId = params?.id as string;
  const [estudiantes, setEstudiantes] = useState<EstudianteResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEstudiante, setSelectedEstudiante] = useState<EstudianteResumen | null>(null);

  useEffect(() => {
    const fetchEstudiantes = async () => {
      if (!institucionId) return;
      try {
        const response = await fetch(`/api/instituciones/${institucionId}/dashboard`);
        if (!response.ok) {
          setError('No se pudieron cargar los estudiantes');
          return;
        }
        const data = await response.json();
        setEstudiantes(data?.datos?.estudiantes || []);
      } catch (err) {
        console.error('Error cargando estudiantes:', err);
        setError('Error al cargar los estudiantes');
      } finally {
        setLoading(false);
      }
    };

    fetchEstudiantes();
  }, [institucionId]);

  const handleRefetch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/instituciones/${institucionId}/dashboard`);
      if (!response.ok) {
        setError('No se pudieron cargar los estudiantes');
        return;
      }
      const data = await response.json();
      setEstudiantes(data?.datos?.estudiantes || []);
    } catch (err) {
      console.error('Error cargando estudiantes:', err);
      setError('Error al cargar los estudiantes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-blue-50">
        <Header title="Estudiantes" subtitle="Panel de administración" />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card variant="default" padding="lg" className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">Gestión de estudiantes</h2>
                <p className="text-slate-600">Listado de estudiantes activos.</p>
              </div>
              <Button type="button" variant="primary" onClick={() => setShowAddModal(true)}>
                Agregar estudiante
              </Button>
            </div>

            {loading && (
              <LoaderPage message="Cargando estudiantes..." />
            )}
            {error && !loading && <div className="text-red-600">{error}</div>}
            {!loading && !error && estudiantes.length === 0 && (
              <div className="text-slate-600">No hay estudiantes registrados.</div>
            )}

            {!loading && !error && estudiantes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {estudiantes.map((estudiante) => (
                <Card key={estudiante.id} variant="outlined" padding="md">
                  <h3 className="font-semibold text-slate-900">
                    {estudiante.nombres} {estudiante.apellidos}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Código: {estudiante.codigo_estudiantil}
                  </p>
                  <p className="text-xs text-slate-600 mt-2">
                    {estudiante.grado?.nombre} · {estudiante.curso?.nombre}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3 justify-end">
                    <button
                      type="button"
                      onClick={() => { setSelectedEstudiante(estudiante); setShowViewModal(true); }}
                      className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      Ver
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedEstudiante(estudiante); setShowEditModal(true); }}
                      className="px-3 py-1.5 text-xs bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedEstudiante(estudiante); setShowDeleteModal(true); }}
                      className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Eliminar
                    </button>
                  </div>
                </Card>
              ))}
            </div>
            )}
          </Card>
        </main>
        <AddEstudianteModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          institucionId={Number(institucionId)}
          onSuccess={handleRefetch}
        />
        <ViewEstudianteModal
          isOpen={showViewModal}
          onClose={() => { setShowViewModal(false); setSelectedEstudiante(null); }}
          estudiante={selectedEstudiante}
        />
        <EditEstudianteModal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setSelectedEstudiante(null); }}
          estudiante={selectedEstudiante}
          institucionId={Number(institucionId)}
          onSuccess={() => { handleRefetch(); setShowEditModal(false); setSelectedEstudiante(null); }}
        />
        <DeleteEstudianteModal
          isOpen={showDeleteModal}
          onClose={() => { setShowDeleteModal(false); setSelectedEstudiante(null); }}
          estudiante={selectedEstudiante}
          onSuccess={() => { handleRefetch(); setShowDeleteModal(false); setSelectedEstudiante(null); }}
        />
        <Footer />
      </div>
    </AdminAuthGuard>
  );
}
