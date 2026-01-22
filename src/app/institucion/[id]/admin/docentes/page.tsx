'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminAuthGuard from '../AdminAuthGuard';
import Header from '../../Header';
import Footer from '../../Footer';
import AddDocenteModal from '../modals/AddDocenteModal';

interface DocenteAsignacion {
  id: number;
  grado: { nombre: string; nivel: string };
  curso: { nombre: string };
  materia: { nombre: string };
}

interface DocenteResumen {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  sede?: { nombre: string };
  docenteAsignaciones: DocenteAsignacion[];
}

export default function AdminDocentesPage() {
  const params = useParams();
  const institucionId = params?.id as string;
  const [docentes, setDocentes] = useState<DocenteResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchDocentes = async () => {
      if (!institucionId) return;
      try {
        const response = await fetch(`/api/instituciones/${institucionId}/dashboard`);
        if (!response.ok) {
          setError('No se pudieron cargar los docentes');
          return;
        }
        const data = await response.json();
        setDocentes(data?.datos?.docentes || []);
      } catch (err) {
        console.error('Error cargando docentes:', err);
        setError('Error al cargar los docentes');
      } finally {
        setLoading(false);
      }
    };

    fetchDocentes();
  }, [institucionId]);

  const handleRefetch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/instituciones/${institucionId}/dashboard`);
      if (!response.ok) {
        setError('No se pudieron cargar los docentes');
        return;
      }
      const data = await response.json();
      setDocentes(data?.datos?.docentes || []);
    } catch (err) {
      console.error('Error cargando docentes:', err);
      setError('Error al cargar los docentes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-blue-50">
        <Header title="Docentes" subtitle="Panel de administración" />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">Gestión de docentes</h2>
                <p className="text-slate-600">Listado de docentes y sus asignaciones.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Agregar docente
              </button>
            </div>

            {loading && <div className="text-slate-600">Cargando docentes...</div>}
            {error && !loading && <div className="text-red-600">{error}</div>}
            {!loading && !error && docentes.length === 0 && (
              <div className="text-slate-600">No hay docentes registrados.</div>
            )}

            <div className="space-y-4">
              {docentes.map((docente) => (
                <div key={docente.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {docente.nombres} {docente.apellidos}
                      </h3>
                      <p className="text-sm text-slate-500">{docente.email}</p>
                    </div>
                    <div className="text-xs text-slate-600">
                      {docente.sede?.nombre || 'Sede principal'}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {docente.docenteAsignaciones?.length ? (
                      docente.docenteAsignaciones.map((asignacion) => (
                        <span
                          key={asignacion.id}
                          className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-700"
                        >
                          {asignacion.grado.nombre} {asignacion.curso.nombre} · {asignacion.materia.nombre}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">Sin asignaciones</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <AddDocenteModal
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
