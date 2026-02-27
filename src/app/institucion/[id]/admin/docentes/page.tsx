'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import Header from '../../Header';
import Footer from '../../Footer';
import AddDocenteModal from '../modals/AddDocenteModal';
import ViewDocenteModal from '../modals/ViewDocenteModal';
import EditDocenteModal from '../modals/EditDocenteModal';
import DeleteDocenteModal from '../modals/DeleteDocenteModal';
import Skeleton from '@/components/ui/Skeleton';
import type { Docente, DocenteGetResponse } from '@/types';

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
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDocente, setSelectedDocente] = useState<DocenteResumen | null>(null);
  /** Docente completo para edición (se obtiene por GET /api/docentes/[id]). */
  const [docenteParaEditar, setDocenteParaEditar] = useState<Docente | null>(null);
  const [loadingEditDocente, setLoadingEditDocente] = useState(false);

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

  const openEditModal = useCallback(async (docente: DocenteResumen) => {
    setSelectedDocente(docente);
    setLoadingEditDocente(true);
    setDocenteParaEditar(null);
    try {
      const res = await fetch(`/api/docentes/${docente.id}`);
      if (!res.ok) {
        setError('No se pudo cargar el docente para editar');
        return;
      }
      const data: DocenteGetResponse = await res.json();
      setDocenteParaEditar(data);
      setShowEditModal(true);
    } catch (err) {
      console.error('Error cargando docente:', err);
      setError('Error al cargar el docente');
    } finally {
      setLoadingEditDocente(false);
    }
  }, []);

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

            {loading && (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-28" />
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                  <div className="flex flex-wrap gap-2 mt-3 justify-end">
                    <button
                      type="button"
                      onClick={() => { setSelectedDocente(docente); setShowViewModal(true); }}
                      className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      Ver
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(docente)}
                      disabled={loadingEditDocente}
                      className="px-3 py-1.5 text-xs bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedDocente(docente); setShowDeleteModal(true); }}
                      className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Eliminar
                    </button>
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
        <ViewDocenteModal
          isOpen={showViewModal}
          onClose={() => { setShowViewModal(false); setSelectedDocente(null); }}
          docente={selectedDocente}
        />
        <EditDocenteModal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setSelectedDocente(null); setDocenteParaEditar(null); }}
          docente={docenteParaEditar}
          institucionId={Number(institucionId)}
          onSuccess={() => { handleRefetch(); setShowEditModal(false); setSelectedDocente(null); setDocenteParaEditar(null); }}
        />
        <DeleteDocenteModal
          isOpen={showDeleteModal}
          onClose={() => { setShowDeleteModal(false); setSelectedDocente(null); }}
          docente={selectedDocente}
          onSuccess={() => { handleRefetch(); setShowDeleteModal(false); setSelectedDocente(null); }}
        />
        <Footer />
      </div>
    </AdminAuthGuard>
  );
}
