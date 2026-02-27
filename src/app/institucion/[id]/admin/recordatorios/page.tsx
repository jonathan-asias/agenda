'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import Header from '../../Header';
import Footer from '../../Footer';

const tipoColors: Record<string, string> = {
  tarea: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  examen: 'bg-red-100 text-red-800 border-red-200',
  evento: 'bg-blue-100 text-blue-800 border-blue-200',
  otro: 'bg-purple-100 text-purple-800 border-purple-200'
};
const tipoLabels: Record<string, string> = {
  tarea: 'Tarea',
  examen: 'Examen',
  evento: 'Evento',
  otro: 'Otro'
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
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los docentes</option>
                  {opcionesFiltros.docentes.map((d) => (
                    <option key={d.id} value={d.id}>{d.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
                <p className="text-slate-600">Cargando recordatorios...</p>
              </div>
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

        {/* Modal de Detalle del Recordatorio (igual que dashboard) */}
        {showModal && selectedRecordatorio && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] flex flex-col">
              <div className="bg-white border-b border-slate-200 p-6 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedRecordatorio.nombre}</h2>
                    <p className="text-slate-600 text-sm">Detalle completo del recordatorio</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setSelectedRecordatorio(null); }}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-6">
                  {/* Badges y Estado */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${tipoColors[selectedRecordatorio.tipo] || tipoColors.otro}`}>
                      {tipoLabels[selectedRecordatorio.tipo] || 'Otro'}
                    </span>
                    {(() => {
                      const fechaRecordatorio = new Date(selectedRecordatorio.fecha);
                      const hoy = new Date();
                      hoy.setHours(0, 0, 0, 0);
                      const esPasado = fechaRecordatorio < hoy;
                      const esHoy = fechaRecordatorio.toDateString() === hoy.toDateString();
                      return (
                        <>
                          {esPasado && <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-xs font-medium">Pasado</span>}
                          {esHoy && <span className="px-3 py-1 bg-blue-200 text-blue-700 rounded-full text-xs font-medium">Hoy</span>}
                        </>
                      );
                    })()}
                  </div>

                  {/* Información del Docente */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-1">Docente</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {selectedRecordatorio.docente.nombres} {selectedRecordatorio.docente.apellidos}
                        </p>
                        <p className="text-xs text-slate-600">{selectedRecordatorio.docente.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Descripción Completa */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Descripción</h3>
                    <p className="text-slate-700 bg-slate-50 rounded-xl p-4 whitespace-pre-wrap">{selectedRecordatorio.descripcion}</p>
                  </div>

                  {/* Información Académica */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs font-medium text-slate-500">Fecha</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        {new Date(selectedRecordatorio.fecha).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <p className="text-xs font-medium text-slate-500">Materia y Área</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedRecordatorio.materia?.nombre} - {selectedRecordatorio.area?.nombre}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <p className="text-xs font-medium text-slate-500">Grado y Curso</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedRecordatorio.grado?.nombre} ({selectedRecordatorio.grado?.nivel}) - {selectedRecordatorio.curso?.nombre}
                        {selectedRecordatorio.curso?.jornada ? ` (${selectedRecordatorio.curso.jornada})` : ''}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-xs font-medium text-slate-500">Estudiantes</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedRecordatorio.estudiantes?.length ?? 0} estudiante{(selectedRecordatorio.estudiantes?.length ?? 0) !== 1 ? 's' : ''} asignado{(selectedRecordatorio.estudiantes?.length ?? 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Fechas de creación y modificación */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRecordatorio.created_at && (
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-xs font-medium text-slate-500">Fecha de Creación</p>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">
                          {new Date(selectedRecordatorio.created_at).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    )}
                    {selectedRecordatorio.updated_at && selectedRecordatorio.updated_at !== selectedRecordatorio.created_at && (
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <p className="text-xs font-medium text-green-700">Última Modificación</p>
                        </div>
                        <p className="text-sm font-semibold text-green-900">
                          {new Date(selectedRecordatorio.updated_at).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Lista Completa de Estudiantes */}
                  {selectedRecordatorio.estudiantes?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700 mb-3">Estudiantes Asignados</h3>
                      <div className="bg-slate-50 rounded-xl p-4 max-h-64 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedRecordatorio.estudiantes.map((est: any, idx: number) => (
                            <div key={idx} className="bg-white rounded-lg p-3 border border-slate-200">
                              <p className="text-sm font-medium text-slate-900">
                                {est.estudiante?.nombres} {est.estudiante?.apellidos}
                              </p>
                              {est.estudiante?.codigo_estudiantil && (
                                <p className="text-xs text-slate-500 mt-1">Código: {est.estudiante.codigo_estudiantil}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200 p-6 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setSelectedRecordatorio(null); }}
                  className="w-full px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </AdminAuthGuard>
  );
}
