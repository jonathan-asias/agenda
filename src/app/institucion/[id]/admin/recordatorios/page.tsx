'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import Header from '../../Header';
import Footer from '../../Footer';
import ViewRecordatorioModal from '../../docente/ViewRecordatorioModal';
import type { Recordatorio } from '@/types/recordatorio';
import { ListPageSkeleton } from '@/components/ui/PageSkeletons';

const tipoColors: Record<string, string> = {
  tarea: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  examen: 'bg-red-100 text-red-800 border-red-200',
  evento: 'bg-blue-100 text-blue-800 border-blue-200',
  autorizacion: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  otro: 'bg-purple-100 text-purple-800 border-purple-200',
};
const tipoLabels: Record<string, string> = {
  tarea: 'Tarea',
  examen: 'Examen',
  evento: 'Evento',
  autorizacion: 'Autorización',
  otro: 'Otro',
};

export default function AdminRecordatoriosPage() {
  const params = useParams();
  const institucionId = params?.id as string;
  const [recordatorios, setRecordatorios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecordatorio, setSelectedRecordatorio] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filtros, setFiltros] = useState({ area: '', materia: '', docente: '' });

  const fetchRecordatorios = async () => {
    if (!institucionId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/recordatorios/by-institucion/${institucionId}`);
      if (response.ok) {
        const data = await response.json();
        setRecordatorios(data.recordatorios || []);
      }
    } catch (error) {
      console.error('Error fetching recordatorios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordatorios();
  }, [institucionId]);

  const opcionesFiltros = useMemo(() => {
    const areas = Array.from(new Set(recordatorios.map((r: any) => r.area.id))).map((id) => {
      const r = recordatorios.find((x: any) => x.area.id === id);
      return { id: r.area.id, nombre: r.area.nombre };
    });
    const materias = Array.from(new Set(recordatorios.map((r: any) => r.materia.id))).map((id) => {
      const r = recordatorios.find((x: any) => x.materia.id === id);
      return { id: r.materia.id, nombre: r.materia.nombre };
    });
    const docentes = Array.from(new Set(recordatorios.map((r: any) => r.docente.id))).map((id) => {
      const r = recordatorios.find((x: any) => x.docente.id === id);
      return { id: r.docente.id, nombre: `${r.docente.nombres} ${r.docente.apellidos}` };
    });
    return { areas, materias, docentes };
  }, [recordatorios]);

  const recordatoriosFiltrados = useMemo(() => {
    return recordatorios.filter((r: any) => {
      if (filtros.area && r.area.id.toString() !== filtros.area) return false;
      if (filtros.materia && r.materia.id.toString() !== filtros.materia) return false;
      if (filtros.docente && r.docente.id.toString() !== filtros.docente) return false;
      return true;
    });
  }, [recordatorios, filtros]);

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-blue-50">
        <Header title="Recordatorios" subtitle="Panel de administración" />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Recordatorios de docentes</h2>
              <p className="text-slate-600">Listado de recordatorios creados por los docentes de la institución.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">Área</label>
                <select
                  value={filtros.area}
                  onChange={(e) => setFiltros((prev) => ({ ...prev, area: e.target.value, materia: '' }))}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 transition-all duration-200"
                >
                  <option value="">Todas las áreas</option>
                  {opcionesFiltros.areas.map((area) => (
                    <option key={area.id} value={area.id}>{area.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">Materia</label>
                <select
                  value={filtros.materia}
                  onChange={(e) => setFiltros((prev) => ({ ...prev, materia: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 transition-all duration-200"
                  disabled={!filtros.area}
                >
                  <option value="">Todas las materias</option>
                  {opcionesFiltros.materias
                    .filter((m) => !filtros.area || recordatorios.some((r: any) => r.materia.id === m.id && r.area.id.toString() === filtros.area))
                    .map((m) => (
                      <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">Docente</label>
                <select
                  value={filtros.docente}
                  onChange={(e) => setFiltros((prev) => ({ ...prev, docente: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 transition-all duration-200"
                >
                  <option value="">Todos los docentes</option>
                  {opcionesFiltros.docentes.map((d) => (
                    <option key={d.id} value={d.id}>{d.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <ListPageSkeleton rows={6} />
            ) : recordatorios.length > 0 ? (
              recordatoriosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recordatoriosFiltrados.map((recordatorio: any) => {
                  const fechaRecordatorio = new Date(recordatorio.fecha);
                  const hoy = new Date();
                  hoy.setHours(0, 0, 0, 0);
                  const esPasado = fechaRecordatorio < hoy;
                  const esHoy = fechaRecordatorio.toDateString() === hoy.toDateString();
                  const descripcionTruncada = recordatorio.descripcion?.length > 100
                    ? recordatorio.descripcion.substring(0, 100) + '...'
                    : recordatorio.descripcion || '';
                  const estudiantesList = recordatorio.estudiantes || [];
                  const estudiantesMostrados = estudiantesList.slice(0, 3);
                  const estudiantesRestantes = estudiantesList.length - 3;
                  return (
                    <div
                      key={recordatorio.id}
                      className={`p-5 rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer ${
                        esPasado ? 'bg-slate-50 border-slate-200' : esHoy ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-200'
                      }`}
                      onClick={() => { setSelectedRecordatorio(recordatorio); setShowModal(true); }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-slate-900 flex-1 pr-2">{recordatorio.nombre}</h4>
                        <div className="flex flex-col gap-1 items-end">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${tipoColors[recordatorio.tipo] || tipoColors.otro}`}>
                            {tipoLabels[recordatorio.tipo] || 'Otro'}
                          </span>
                          {esPasado && <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-xs font-medium">Pasado</span>}
                          {esHoy && <span className="px-2 py-0.5 bg-blue-200 text-blue-700 rounded text-xs font-medium">Hoy</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm text-slate-700 truncate">{recordatorio.docente.nombres} {recordatorio.docente.apellidos}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{descripcionTruncada}</p>
                      {recordatorio.updated_at && recordatorio.updated_at !== recordatorio.created_at && (
                        <div className="flex items-center gap-2 mb-3 text-xs text-green-600">
                          <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span className="font-medium">Modificado: {new Date(recordatorio.updated_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      )}
                      {estudiantesList.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-xs font-medium text-slate-600">Asignado a {estudiantesList.length} estudiante{estudiantesList.length !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {estudiantesMostrados.map((est: any, idx: number) => (
                              <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                                {est.estudiante?.nombres?.split(' ')[0] || ''} {est.estudiante?.apellidos?.split(' ')[0] || ''}
                              </span>
                            ))}
                            {estudiantesRestantes > 0 && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">+{estudiantesRestantes} más</span>
                            )}
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setSelectedRecordatorio(recordatorio); setShowModal(true); }}
                        className="mt-4 w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Ver detalles completos
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <p className="text-slate-600">No se encontraron recordatorios con los filtros seleccionados</p>
                <p className="text-sm text-slate-500 mt-2">Intenta ajustar los filtros para ver más resultados</p>
              </div>
            )
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-600">No hay recordatorios creados aún</p>
                <p className="text-sm text-slate-500 mt-2">Los docentes aún no han creado recordatorios</p>
              </div>
            )}
          </div>
        </main>

        <ViewRecordatorioModal
          isOpen={showModal}
          onClose={() => { setShowModal(false); setSelectedRecordatorio(null); }}
          recordatorio={selectedRecordatorio as Recordatorio | null}
        />

        <Footer />
      </div>
    </AdminAuthGuard>
  );
}
