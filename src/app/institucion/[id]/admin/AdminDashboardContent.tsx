'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import SetupWizard from './SetupWizard';
import DashboardStats from './DashboardStats';
import DashboardSections from './DashboardSections';
import AddItemModal from './AddItemModal';
import Swal from 'sweetalert2';
import Footer from '../Footer';
import Header from '../Header';

interface Administrador {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  cargo: string;
  institucion: {
    id: number;
    nombre: string;
  };
  sede?: {
    id: number;
    nombre: string;
  };
}

interface DashboardData {
  estadisticas: {
    areas: number;
    materias: number;
    grados: number;
    cursos: number;
    docentes: number;
    estudiantes: number;
  };
  datos: {
    areas: any[];
    materias: any[];
    grados: any[];
    cursos: any[];
    docentes: any[];
    estudiantes: any[];
  };
  resumen: {
    estudiantesPorGrado: any[];
    materiasPorArea: any[];
  };
}

export default function AdminDashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [administrador, setAdministrador] = useState<Administrador | null>(null);
  const [institucionId, setInstitucionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [dashboardLoaded, setDashboardLoaded] = useState(false);
  const [recordatorios, setRecordatorios] = useState<any[]>([]);
  const [loadingRecordatorios, setLoadingRecordatorios] = useState(false);
  const [selectedRecordatorio, setSelectedRecordatorio] = useState<any | null>(null);
  const [showRecordatorioModal, setShowRecordatorioModal] = useState(false);
  const [filtros, setFiltros] = useState({
    area: '',
    materia: '',
    docente: '',
    cantidadEstudiantes: ''
  });

  const fetchRecordatorios = useCallback(async (institucionIdValue: number) => {
    setLoadingRecordatorios(true);
    try {
      const response = await fetch(`/api/recordatorios/by-institucion/${institucionIdValue}`);
      if (response.ok) {
        const data = await response.json();
        setRecordatorios(data.recordatorios || []);
      }
    } catch (error) {
      console.error('Error fetching recordatorios:', error);
    } finally {
      setLoadingRecordatorios(false);
    }
  }, []);

  const fetchDashboardData = useCallback(async (institucionIdParam?: number) => {
    const id = institucionIdParam || administrador?.institucion?.id;
    if (!id) return;
    
    if (dashboardLoaded && !institucionIdParam) return;
    
    setDashboardLoading(true);
    try {
      const response = await fetch(`/api/instituciones/${id}/dashboard`);
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
        setDashboardLoaded(true);
        fetchRecordatorios(id);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setDashboardLoading(false);
    }
  }, [administrador?.institucion?.id, dashboardLoaded, fetchRecordatorios]);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!user?.email) return;
      
      try {
        const response = await fetch(`/api/administradores/by-email/${encodeURIComponent(user.email)}`);
        if (response.ok) {
          const data = await response.json();
          setAdministrador(data.administrador);
          setInstitucionId(data.administrador?.institucion?.id || null);
          if (data.administrador?.institucion?.id && !dashboardLoaded) {
            fetchDashboardData(data.administrador.institucion.id);
          }
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user, dashboardLoaded, fetchDashboardData]);

  const handleAddSuccess = () => {
    // Recargar datos del dashboard después de agregar un elemento
    setDashboardLoaded(false);
    fetchDashboardData();
  };

  // Extraer opciones únicas para los filtros
  const opcionesFiltros = {
    areas: Array.from(new Set(recordatorios.map(r => r.area.id))).map(id => {
      const recordatorio = recordatorios.find(r => r.area.id === id);
      return { id: recordatorio.area.id, nombre: recordatorio.area.nombre };
    }),
    materias: Array.from(new Set(recordatorios.map(r => r.materia.id))).map(id => {
      const recordatorio = recordatorios.find(r => r.materia.id === id);
      return { id: recordatorio.materia.id, nombre: recordatorio.materia.nombre };
    }),
    docentes: Array.from(new Set(recordatorios.map(r => r.docente.id))).map(id => {
      const recordatorio = recordatorios.find(r => r.docente.id === id);
      return { 
        id: recordatorio.docente.id, 
        nombre: `${recordatorio.docente.nombres} ${recordatorio.docente.apellidos}` 
      };
    })
  };

  // Filtrar recordatorios
  const recordatoriosFiltrados = recordatorios.filter(recordatorio => {
    // Filtro por área
    if (filtros.area && recordatorio.area.id.toString() !== filtros.area) {
      return false;
    }
    
    // Filtro por materia
    if (filtros.materia && recordatorio.materia.id.toString() !== filtros.materia) {
      return false;
    }
    
    // Filtro por docente
    if (filtros.docente && recordatorio.docente.id.toString() !== filtros.docente) {
      return false;
    }
    
    // Filtro por cantidad de estudiantes
    if (filtros.cantidadEstudiantes) {
      const cantidad = recordatorio.estudiantes.length;
      switch (filtros.cantidadEstudiantes) {
        case '1-5':
          if (cantidad < 1 || cantidad > 5) return false;
          break;
        case '6-10':
          if (cantidad < 6 || cantidad > 10) return false;
          break;
        case '11-20':
          if (cantidad < 11 || cantidad > 20) return false;
          break;
        case '21+':
          if (cantidad < 21) return false;
          break;
      }
    }
    
    return true;
  });

  if (loading || !administrador) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando información del administrador...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header 
        title="Panel de Administrador" 
        subtitle={administrador.institucion.nombre}
      />
      <div className="min-h-screen bg-blue-50 flex flex-col">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="space-y-8">
          {/* Header con botones de acción */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Dashboard de Administración</h2>
              <p className="text-slate-600 mt-1">
                Gestiona todos los datos de tu institución educativa
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar
              </button>
              <button
                onClick={() => {
                  setDashboardLoaded(false);
                  fetchDashboardData();
                  // Actualizar recordatorios también
                  if (institucionId) {
                    fetchRecordatorios(institucionId);
                  }
                }}
                disabled={dashboardLoading}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:bg-slate-400 transition-colors flex items-center"
              >
                <svg className={`w-4 h-4 mr-2 ${dashboardLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {dashboardLoading ? 'Actualizando...' : 'Actualizar'}
              </button>
              <button
                onClick={() => setShowWizard(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Configurar
              </button>
            </div>
          </div>

          {/* Estado de carga */}
          {dashboardLoading && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Cargando datos del dashboard...</p>
              </div>
            </div>
          )}

          {/* Dashboard de datos */}
          {!dashboardLoading && dashboardData && (
            <>
              <DashboardStats estadisticas={dashboardData.estadisticas} />
              <DashboardSections
                areas={dashboardData.datos.areas}
                materias={dashboardData.datos.materias}
                grados={dashboardData.datos.grados}
                cursos={dashboardData.datos.cursos}
                docentes={dashboardData.datos.docentes}
                estudiantes={dashboardData.datos.estudiantes}
                institucionId={institucionId || 0}
              />
              
              {/* Sección de Recordatorios */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-4">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Recordatorios de Docentes ({recordatoriosFiltrados.length} de {recordatorios.length})
                  </h3>
                  
                  {/* Filtros */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Filtro por Área */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-2">
                        Filtrar por Área
                      </label>
                      <select
                        value={filtros.area}
                        onChange={(e) => {
                          setFiltros(prev => ({ ...prev, area: e.target.value, materia: '' }));
                        }}
                        className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      >
                        <option value="">Todas las áreas</option>
                        {opcionesFiltros.areas.map((area) => (
                          <option key={area.id} value={area.id}>
                            {area.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filtro por Materia */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-2">
                        Filtrar por Materia
                      </label>
                      <select
                        value={filtros.materia}
                        onChange={(e) => setFiltros(prev => ({ ...prev, materia: e.target.value }))}
                        className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        disabled={!filtros.area}
                      >
                        <option value="">Todas las materias</option>
                        {opcionesFiltros.materias
                          .filter(m => !filtros.area || recordatorios.find(r => r.materia.id === m.id && r.area.id.toString() === filtros.area))
                          .map((materia) => (
                            <option key={materia.id} value={materia.id}>
                              {materia.nombre}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Filtro por Docente */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-2">
                        Filtrar por Docente
                      </label>
                      <select
                        value={filtros.docente}
                        onChange={(e) => setFiltros(prev => ({ ...prev, docente: e.target.value }))}
                        className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      >
                        <option value="">Todos los docentes</option>
                        {opcionesFiltros.docentes.map((docente) => (
                          <option key={docente.id} value={docente.id}>
                            {docente.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filtro por Cantidad de Estudiantes */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-2">
                        Cantidad de Estudiantes
                      </label>
                      <select
                        value={filtros.cantidadEstudiantes}
                        onChange={(e) => setFiltros(prev => ({ ...prev, cantidadEstudiantes: e.target.value }))}
                        className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      >
                        <option value="">Todas las cantidades</option>
                        <option value="1-5">1 - 5 estudiantes</option>
                        <option value="6-10">6 - 10 estudiantes</option>
                        <option value="11-20">11 - 20 estudiantes</option>
                        <option value="21+">21+ estudiantes</option>
                      </select>
                    </div>
                  </div>

                  {/* Botón para limpiar filtros */}
                  {(filtros.area || filtros.materia || filtros.docente || filtros.cantidadEstudiantes) && (
                    <div className="mt-4">
                      <button
                        onClick={() => setFiltros({ area: '', materia: '', docente: '', cantidadEstudiantes: '' })}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Limpiar filtros
                      </button>
                    </div>
                  )}
                </div>

                {/* Lista de recordatorios */}
                <div className="h-96 overflow-y-auto">
                  {loadingRecordatorios ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-slate-600">Cargando recordatorios...</p>
                    </div>
                  ) : recordatorios.length > 0 ? (
                    recordatoriosFiltrados.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recordatoriosFiltrados.map((recordatorio) => {
                      const fechaRecordatorio = new Date(recordatorio.fecha);
                      const hoy = new Date();
                      hoy.setHours(0, 0, 0, 0);
                      const esPasado = fechaRecordatorio < hoy;
                      const esHoy = fechaRecordatorio.toDateString() === hoy.toDateString();
                      
                      const tipoColors = {
                        tarea: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                        examen: 'bg-red-100 text-red-800 border-red-200',
                        evento: 'bg-blue-100 text-blue-800 border-blue-200',
                        otro: 'bg-purple-100 text-purple-800 border-purple-200'
                      };

                      const tipoLabels = {
                        tarea: 'Tarea',
                        examen: 'Examen',
                        evento: 'Evento',
                        otro: 'Otro'
                      };

                      // Truncar descripción a 100 caracteres
                      const descripcionTruncada = recordatorio.descripcion.length > 100
                        ? recordatorio.descripcion.substring(0, 100) + '...'
                        : recordatorio.descripcion;

                      // Limitar estudiantes mostrados a 3
                      const estudiantesMostrados = recordatorio.estudiantes.slice(0, 3);
                      const estudiantesRestantes = recordatorio.estudiantes.length - 3;

                      return (
                        <div
                          key={recordatorio.id}
                          className={`p-5 rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer ${
                            esPasado
                              ? 'bg-slate-50 border-slate-200'
                              : esHoy
                              ? 'bg-blue-50 border-blue-300'
                              : 'bg-white border-slate-200'
                          }`}
                          onClick={() => {
                            setSelectedRecordatorio(recordatorio);
                            setShowRecordatorioModal(true);
                          }}
                        >
                          {/* Header con título y badges */}
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-lg font-semibold text-slate-900 flex-1 pr-2">
                              {recordatorio.nombre}
                            </h4>
                            <div className="flex flex-col gap-1 items-end">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${
                                  tipoColors[recordatorio.tipo as keyof typeof tipoColors] || tipoColors.otro
                                }`}
                              >
                                {tipoLabels[recordatorio.tipo as keyof typeof tipoLabels] || 'Otro'}
                              </span>
                              {esPasado && (
                                <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-xs font-medium">
                                  Pasado
                                </span>
                              )}
                              {esHoy && (
                                <span className="px-2 py-0.5 bg-blue-200 text-blue-700 rounded text-xs font-medium">
                                  Hoy
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Docente */}
                          <div className="flex items-center gap-2 mb-3">
                            <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-sm text-slate-700 truncate">
                              {recordatorio.docente.nombres} {recordatorio.docente.apellidos}
                            </span>
                          </div>

                          {/* Descripción truncada */}
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                            {descripcionTruncada}
                          </p>

                          {/* Fecha de modificación */}
                          {recordatorio.updated_at && recordatorio.updated_at !== recordatorio.created_at && (
                            <div className="flex items-center gap-2 mb-3 text-xs text-green-600">
                              <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span className="font-medium">
                                Modificado: {new Date(recordatorio.updated_at).toLocaleDateString('es-ES', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          )}

                          {/* Estudiantes asignados */}
                          {recordatorio.estudiantes.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-200">
                              <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="text-xs font-medium text-slate-600">
                                  Asignado a {recordatorio.estudiantes.length} estudiante{recordatorio.estudiantes.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {estudiantesMostrados.map((est: any, idx: number) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
                                  >
                                    {est.estudiante.nombres.split(' ')[0]} {est.estudiante.apellidos.split(' ')[0]}
                                  </span>
                                ))}
                                {estudiantesRestantes > 0 && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                    +{estudiantesRestantes} más
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Botón ver más */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecordatorio(recordatorio);
                              setShowRecordatorioModal(true);
                            }}
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
              </div>
            </>
          )}

          {/* Estado sin datos */}
          {!dashboardLoading && !dashboardData && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="text-center max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No hay datos disponibles
                </h3>
                <p className="text-slate-600 mb-6">
                  Comienza configurando tu institución educativa
                </p>
                <button
                  onClick={() => setShowWizard(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center shadow-lg mx-auto"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Iniciar Configuración
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Setup Wizard Modal */}
      {showWizard && (
        <SetupWizard 
          institucionId={administrador.institucion.id}
          onClose={() => setShowWizard(false)} 
        />
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <AddItemModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          institucionId={administrador.institucion.id}
          onSuccess={handleAddSuccess}
        />
      )}

      {/* Modal de Detalle del Recordatorio */}
      {showRecordatorioModal && selectedRecordatorio && (
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
                onClick={() => {
                  setShowRecordatorioModal(false);
                  setSelectedRecordatorio(null);
                }}
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
                  {(() => {
                    const tipoColors = {
                      tarea: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                      examen: 'bg-red-100 text-red-800 border-red-200',
                      evento: 'bg-blue-100 text-blue-800 border-blue-200',
                      otro: 'bg-purple-100 text-purple-800 border-purple-200'
                    };
                    const tipoLabels = {
                      tarea: 'Tarea',
                      examen: 'Examen',
                      evento: 'Evento',
                      otro: 'Otro'
                    };
                    const fechaRecordatorio = new Date(selectedRecordatorio.fecha);
                    const hoy = new Date();
                    hoy.setHours(0, 0, 0, 0);
                    const esPasado = fechaRecordatorio < hoy;
                    const esHoy = fechaRecordatorio.toDateString() === hoy.toDateString();

                    return (
                      <>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                            tipoColors[selectedRecordatorio.tipo as keyof typeof tipoColors] || tipoColors.otro
                          }`}
                        >
                          {tipoLabels[selectedRecordatorio.tipo as keyof typeof tipoLabels] || 'Otro'}
                        </span>
                        {esPasado && (
                          <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-xs font-medium">
                            Pasado
                          </span>
                        )}
                        {esHoy && (
                          <span className="px-3 py-1 bg-blue-200 text-blue-700 rounded-full text-xs font-medium">
                            Hoy
                          </span>
                        )}
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
                  <p className="text-slate-700 bg-slate-50 rounded-xl p-4 whitespace-pre-wrap">
                    {selectedRecordatorio.descripcion}
                  </p>
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
                      {new Date(selectedRecordatorio.fecha).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
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
                      {selectedRecordatorio.materia.nombre} - {selectedRecordatorio.area.nombre}
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
                      {selectedRecordatorio.grado.nombre} ({selectedRecordatorio.grado.nivel}) - {selectedRecordatorio.curso.nombre}
                      {selectedRecordatorio.curso.jornada && ` (${selectedRecordatorio.curso.jornada})`}
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
                      {selectedRecordatorio.estudiantes.length} estudiante{selectedRecordatorio.estudiantes.length !== 1 ? 's' : ''} asignado{selectedRecordatorio.estudiantes.length !== 1 ? 's' : ''}
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
                        {new Date(selectedRecordatorio.created_at).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
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
                        {new Date(selectedRecordatorio.updated_at).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Lista Completa de Estudiantes */}
                {selectedRecordatorio.estudiantes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Estudiantes Asignados</h3>
                    <div className="bg-slate-50 rounded-xl p-4 max-h-64 overflow-y-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedRecordatorio.estudiantes.map((est: any, idx: number) => (
                          <div key={idx} className="bg-white rounded-lg p-3 border border-slate-200">
                            <p className="text-sm font-medium text-slate-900">
                              {est.estudiante.nombres} {est.estudiante.apellidos}
                            </p>
                            {est.estudiante.codigo_estudiantil && (
                              <p className="text-xs text-slate-500 mt-1">
                                Código: {est.estudiante.codigo_estudiantil}
                              </p>
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
                onClick={() => {
                  setShowRecordatorioModal(false);
                  setSelectedRecordatorio(null);
                }}
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
    </>
  );
}
