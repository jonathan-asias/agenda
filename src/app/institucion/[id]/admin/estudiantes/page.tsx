'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import Header from '../../Header';
import Footer from '../../Footer';
import AddEstudianteModal from '../modals/AddEstudianteModal';
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
        <Footer />
      </div>
    </AdminAuthGuard>
  );
}
