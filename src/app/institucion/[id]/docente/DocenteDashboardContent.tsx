'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import Swal from 'sweetalert2';
import AddRecordatorioModal from './AddRecordatorioModal';
import ViewRecordatorioModal from './ViewRecordatorioModal';
import EditRecordatorioModal from './EditRecordatorioModal';
import Footer from '../Footer';
import Header from '../Header';

interface Asignacion {
  id: number;
  grado: {
    id: number;
    nombre: string;
    nivel: string;
  };
  curso: {
    id: number;
    nombre: string;
    jornada: string | null;
  };
  materia: {
    id: number;
    nombre: string;
    area: {
      id: number;
      nombre: string;
    };
  };
}

interface Docente {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  institucion: {
    id: number;
    nombre: string;
  };
  sede?: {
    id: number;
    nombre: string;
  };
  docenteAsignaciones?: Asignacion[];
}

interface Recordatorio {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  tipo: string;
  created_at?: string;
  updated_at?: string;
  grado: {
    id: number;
    nombre: string;
    nivel: string;
  };
  curso: {
    id: number;
    nombre: string;
    jornada: string | null;
  };
  area: {
    id: number;
    nombre: string;
  };
  materia: {
    id: number;
    nombre: string;
  };
  estudiantes?: Array<{
    estudiante: {
      id: number;
      nombres: string;
      apellidos: string;
      codigo_estudiantil: string;
    };
  }>;
}

export default function DocenteDashboardContent() {
  const { user } = useAuth();
  const [docente, setDocente] = useState<Docente | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRecordatorioModal, setShowRecordatorioModal] = useState(false);
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [loadingRecordatorios, setLoadingRecordatorios] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecordatorio, setSelectedRecordatorio] = useState<Recordatorio | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [recordatorioToEdit, setRecordatorioToEdit] = useState<Recordatorio | null>(null);
  const [filtros, setFiltros] = useState({
    area: '',
    materia: '',
    tipo: '',
    fecha: '',
    cantidadEstudiantes: ''
  });
  const [paginaActual, setPaginaActual] = useState(1);
  const recordatoriosPorPagina = 8;

  useEffect(() => {
    const fetchDocenteData = async () => {
      if (!user?.email) return;
      
      try {
        const response = await fetch(`/api/docentes/by-email/${encodeURIComponent(user.email)}`);
        if (response.ok) {
          const data = await response.json();
          setDocente(data.docente);
          // No cargar recordatorios automáticamente - solo cuando el usuario haga clic en "Actualizar"
        }
      } catch (error) {
        console.error('Error fetching docente data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocenteData();
  }, [user]);

  const fetchRecordatorios = async (docenteId: number) => {
    setLoadingRecordatorios(true);
    try {
      const response = await fetch(`/api/recordatorios/by-docente/${docenteId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
        console.error('Error en la respuesta de la API:', errorData);
        await Swal.fire({
          title: 'Error',
          text: errorData.error || 'Error al cargar los recordatorios. Por favor, intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#dc2626',
          customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'rounded-lg'
          }
        });
        return;
      }

      const data = await response.json();
      console.log('Recordatorios recibidos:', data);
      setRecordatorios(data.recordatorios || []);
      
      if (!data.recordatorios || data.recordatorios.length === 0) {
        console.log('No se encontraron recordatorios para el docente:', docenteId);
      }
    } catch (error) {
      console.error('Error fetching recordatorios:', error);
      await Swal.fire({
        title: 'Error',
        text: 'Error al cargar los recordatorios. Por favor, intenta nuevamente.',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'rounded-lg'
        }
      });
    } finally {
      setLoadingRecordatorios(false);
    }
  };

  const handleDeleteRecordatorio = async (recordatorioId: number, recordatorioNombre: string) => {
    // Mostrar mensaje de advertencia
    const result = await Swal.fire({
      title: '¿Eliminar recordatorio?',
      html: `
        <div style="text-align: left; margin-top: 1rem;">
          <p style="margin-bottom: 1rem; color: #334155;">Estás a punto de eliminar el siguiente recordatorio:</p>
          <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 0.5rem; padding: 1rem; margin-top: 1rem;">
            <p style="font-weight: 600; color: #991b1b; margin-bottom: 0.5rem; font-size: 0.875rem;">⚠️ Advertencia:</p>
            <p style="color: #7f1d1d; font-size: 0.875rem; margin: 0; line-height: 1.6;">
              "<strong>${recordatorioNombre}</strong>"
            </p>
          </div>
          <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 0.5rem; padding: 1rem; margin-top: 1rem;">
            <p style="font-weight: 600; color: #1e40af; margin-bottom: 0.5rem; font-size: 0.875rem;">ℹ️ Información importante:</p>
            <ul style="color: #1e3a8a; font-size: 0.875rem; padding-left: 1.5rem; margin: 0; line-height: 1.8;">
              <li>Esta acción no se puede deshacer</li>
              <li>Se eliminarán todos los datos asociados al recordatorio</li>
              <li>Los estudiantes ya no podrán ver este recordatorio</li>
            </ul>
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true,
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-lg',
        cancelButton: 'rounded-lg'
      }
    });

    // Si el usuario confirma, proceder con la eliminación
    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/recordatorios/${recordatorioId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al eliminar el recordatorio');
        }

        // Mostrar mensaje de éxito
        await Swal.fire({
          title: '¡Recordatorio eliminado!',
          text: 'El recordatorio ha sido eliminado exitosamente. Usa el botón "Actualizar" para ver los cambios.',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-2xl'
          }
        });

        // Eliminar el recordatorio de la lista local (sin recargar automáticamente)
        setRecordatorios(prev => prev.filter(r => r.id !== recordatorioId));
      } catch (error) {
        console.error('Error al eliminar recordatorio:', error);
        await Swal.fire({
          title: 'Error',
          text: error instanceof Error ? error.message : 'Hubo un problema al eliminar el recordatorio. Por favor, intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#dc2626',
          customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'rounded-lg'
          }
        });
      }
    }
  };

  // Extraer opciones únicas para los filtros
  const opcionesFiltros = {
    areas: Array.from(new Set(recordatorios.map(r => r.area.id))).map(id => {
      const recordatorio = recordatorios.find(r => r.area.id === id);
      return { id: recordatorio!.area.id, nombre: recordatorio!.area.nombre };
    }),
    materias: Array.from(new Set(recordatorios.map(r => r.materia.id))).map(id => {
      const recordatorio = recordatorios.find(r => r.materia.id === id);
      return { id: recordatorio!.materia.id, nombre: recordatorio!.materia.nombre };
    }),
    tipos: ['tarea', 'examen', 'evento', 'otro']
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
    
    // Filtro por tipo
    if (filtros.tipo && recordatorio.tipo !== filtros.tipo) {
      return false;
    }
    
    // Filtro por fecha
    if (filtros.fecha) {
      const fechaRecordatorio = new Date(recordatorio.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const esPasado = fechaRecordatorio < hoy;
      const esHoy = fechaRecordatorio.toDateString() === hoy.toDateString();
      const esFuturo = fechaRecordatorio > hoy;
      
      switch (filtros.fecha) {
        case 'pasado':
          if (!esPasado) return false;
          break;
        case 'hoy':
          if (!esHoy) return false;
          break;
        case 'futuro':
          if (!esFuturo) return false;
          break;
      }
    }
    
    // Filtro por cantidad de estudiantes
    if (filtros.cantidadEstudiantes && recordatorio.estudiantes) {
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

  // Calcular paginación
  const totalPaginas = Math.ceil(recordatoriosFiltrados.length / recordatoriosPorPagina);
  const indiceInicio = (paginaActual - 1) * recordatoriosPorPagina;
  const indiceFin = indiceInicio + recordatoriosPorPagina;
  const recordatoriosPaginados = recordatoriosFiltrados.slice(indiceInicio, indiceFin);

  // Resetear a la primera página cuando cambien los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [filtros.area, filtros.materia, filtros.tipo, filtros.fecha, filtros.cantidadEstudiantes]);

  if (loading || !docente) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando información del docente...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header 
        title="Panel de Docente" 
        subtitle={docente.institucion.nombre}
      />
      <div className="min-h-screen bg-blue-50 flex flex-col">

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="space-y-8">
          {/* Bienvenida con información del docente */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Bienvenido, {docente.nombres} {docente.apellidos}
                </h2>
                <p className="text-slate-600">
                  Dashboard del docente - {docente.institucion.nombre}
                </p>
                {docente.sede && (
                  <p className="text-sm text-slate-500 mt-2">
                    Sede: {docente.sede.nombre}
                  </p>
                )}
              </div>
            </div>

            {/* Información de Asignaciones */}
            {docente.docenteAsignaciones && docente.docenteAsignaciones.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Mis Asignaciones ({docente.docenteAsignaciones.length})
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {docente.docenteAsignaciones.map((asignacion, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Área</label>
                          <p className="text-sm font-semibold text-indigo-700">
                            {asignacion.materia.area.nombre}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Materia</label>
                          <p className="text-sm font-medium text-slate-900">
                            {asignacion.materia.nombre}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Grado</label>
                            <p className="text-xs text-slate-800">
                              {asignacion.grado.nombre}
                            </p>
                            <p className="text-xs text-slate-500">
                              {asignacion.grado.nivel}
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Curso</label>
                            <p className="text-xs text-slate-800">
                              {asignacion.curso.nombre}
                            </p>
                            {asignacion.curso.jornada && (
                              <p className="text-xs text-slate-500">
                                {asignacion.curso.jornada}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-slate-600">No tienes asignaciones asignadas aún</p>
              </div>
            )}
          </div>

          {/* Recordatorios */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recordatorios {recordatorios.length > 0 && `(${recordatoriosFiltrados.length} de ${recordatorios.length})`}
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (docente?.id) {
                      fetchRecordatorios(docente.id);
                    }
                  }}
                  disabled={loadingRecordatorios || !docente?.id}
                  className="inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className={`w-4 h-4 mr-2 ${loadingRecordatorios ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {loadingRecordatorios ? 'Actualizando...' : 'Actualizar'}
                </button>
                <button
                  onClick={() => setShowRecordatorioModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Agregar Recordatorio
                </button>
              </div>
            </div>

            {/* Filtros */}
            {recordatorios.length > 0 && (
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

                  {/* Filtro por Tipo */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">
                      Filtrar por Tipo
                    </label>
                    <select
                      value={filtros.tipo}
                      onChange={(e) => setFiltros(prev => ({ ...prev, tipo: e.target.value }))}
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="">Todos los tipos</option>
                      <option value="tarea">Tarea</option>
                      <option value="examen">Examen</option>
                      <option value="evento">Evento</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  {/* Filtro por Fecha */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">
                      Filtrar por Fecha
                    </label>
                    <select
                      value={filtros.fecha}
                      onChange={(e) => setFiltros(prev => ({ ...prev, fecha: e.target.value }))}
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="">Todas las fechas</option>
                      <option value="pasado">Pasados</option>
                      <option value="hoy">Hoy</option>
                      <option value="futuro">Futuros</option>
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
                {(filtros.area || filtros.materia || filtros.tipo || filtros.fecha || filtros.cantidadEstudiantes) && (
                  <div className="mt-4">
                    <button
                      onClick={() => setFiltros({ area: '', materia: '', tipo: '', fecha: '', cantidadEstudiantes: '' })}
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
            )}
            
            {/* Lista de recordatorios */}
            {loadingRecordatorios ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Cargando recordatorios...</p>
              </div>
            ) : recordatorios.length > 0 ? (
              recordatoriosFiltrados.length > 0 ? (
                <>
                <div className="space-y-4">
                  {recordatoriosPaginados.map((recordatorio) => {
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

                  // Truncar descripción a 150 caracteres
                  const descripcionTruncada = recordatorio.descripcion.length > 150
                    ? recordatorio.descripcion.substring(0, 150) + '...'
                    : recordatorio.descripcion;

                  return (
                    <div
                      key={recordatorio.id}
                      className={`p-5 rounded-xl border-2 transition-all hover:shadow-md ${
                        esPasado
                          ? 'bg-slate-50 border-slate-200'
                          : esHoy
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h4 className="text-lg font-semibold text-slate-900">
                              {recordatorio.nombre}
                            </h4>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                tipoColors[recordatorio.tipo as keyof typeof tipoColors] || tipoColors.otro
                              }`}
                            >
                              {tipoLabels[recordatorio.tipo as keyof typeof tipoLabels] || 'Otro'}
                            </span>
                            {esPasado && (
                              <span className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-xs font-medium">
                                Pasado
                              </span>
                            )}
                            {esHoy && (
                              <span className="px-2 py-1 bg-blue-200 text-blue-700 rounded text-xs font-medium">
                                Hoy
                              </span>
                            )}
                          </div>
                          <p className="text-slate-700 mb-3 text-sm">{descripcionTruncada}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center text-sm text-slate-600">
                          <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <span className="font-medium">{recordatorio.area.nombre}</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span className="font-medium">{recordatorio.materia.nombre}</span>
                        </div>
                        {recordatorio.updated_at && recordatorio.updated_at !== recordatorio.created_at && (
                          <div className="flex items-center text-sm text-green-600 col-span-1 md:col-span-2">
                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="font-medium text-xs">
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
                      </div>

                      <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                        <button
                          onClick={() => {
                            setSelectedRecordatorio(recordatorio);
                            setShowViewModal(true);
                          }}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Ver información
                        </button>
                        <button
                          onClick={() => {
                            setRecordatorioToEdit(recordatorio);
                            setShowEditModal(true);
                          }}
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteRecordatorio(recordatorio.id, recordatorio.nombre)}
                          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                  })}
                </div>

                {/* Controles de Paginación */}
                {totalPaginas > 1 && (
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-slate-600">
                      Mostrando {indiceInicio + 1} - {Math.min(indiceFin, recordatoriosFiltrados.length)} de {recordatoriosFiltrados.length} recordatorios
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
                        disabled={paginaActual === 1}
                        className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      {/* Números de página */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => {
                          // Mostrar solo algunas páginas alrededor de la actual
                          if (
                            numero === 1 ||
                            numero === totalPaginas ||
                            (numero >= paginaActual - 1 && numero <= paginaActual + 1)
                          ) {
                            return (
                              <button
                                key={numero}
                                onClick={() => setPaginaActual(numero)}
                                className={`px-3 py-2 min-w-[2.5rem] rounded-lg transition-colors ${
                                  paginaActual === numero
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                {numero}
                              </button>
                            );
                          } else if (
                            numero === paginaActual - 2 ||
                            numero === paginaActual + 2
                          ) {
                            return (
                              <span key={numero} className="px-2 text-slate-500">
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>

                      <button
                        onClick={() => setPaginaActual(prev => Math.min(totalPaginas, prev + 1))}
                        disabled={paginaActual === totalPaginas}
                        className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                </>
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
                <p className="text-slate-600">
                  {recordatorios.length === 0 && !loadingRecordatorios
                    ? 'No hay recordatorios cargados'
                    : 'No hay recordatorios aún'}
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  {recordatorios.length === 0 && !loadingRecordatorios
                    ? 'Haz clic en el botón "Actualizar" para cargar tus recordatorios o crea tu primer recordatorio'
                    : 'Crea tu primer recordatorio para empezar'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para Agregar Recordatorio */}
      {docente && (
        <AddRecordatorioModal
          isOpen={showRecordatorioModal}
          onClose={() => setShowRecordatorioModal(false)}
          onSuccess={async () => {
            await Swal.fire({
              title: '¡Recordatorio creado!',
              text: 'El recordatorio ha sido creado exitosamente. Usa el botón "Actualizar" para ver los nuevos recordatorios.',
              icon: 'success',
              timer: 3000,
              showConfirmButton: false,
              customClass: {
                popup: 'rounded-2xl'
              }
            });
            // No recargar automáticamente - el usuario debe usar el botón de actualizar
          }}
          docenteId={docente.id}
          institucionId={docente.institucion.id}
          asignaciones={docente.docenteAsignaciones || []}
        />
      )}

      {/* Modal para Ver Información del Recordatorio */}
      <ViewRecordatorioModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedRecordatorio(null);
        }}
        recordatorio={selectedRecordatorio}
      />

      {/* Modal para Editar Recordatorio */}
      <EditRecordatorioModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setRecordatorioToEdit(null);
        }}
        onSuccess={async (updatedRecordatorio?: Recordatorio) => {
          await Swal.fire({
            title: '¡Recordatorio actualizado!',
            text: 'El recordatorio ha sido actualizado exitosamente.',
            icon: 'success',
            timer: 3000,
            showConfirmButton: false,
            customClass: {
              popup: 'rounded-2xl'
            }
          });
          // Actualizar el recordatorio en la lista local
          if (updatedRecordatorio && recordatorioToEdit) {
            setRecordatorios(prev => 
              prev.map(r => r.id === recordatorioToEdit.id ? updatedRecordatorio : r)
            );
          }
        }}
        recordatorio={recordatorioToEdit}
      />
      <Footer />
      </div>
    </>
  );
}

