'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import AddRecordatorioModal from './AddRecordatorioModal';

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
  estudiantes: Array<{
    estudiante: {
      id: number;
      nombres: string;
      apellidos: string;
      codigo_estudiantil: string;
    };
  }>;
}

export default function DocenteDashboardContent() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [docente, setDocente] = useState<Docente | null>(null);
  const [institucionId, setInstitucionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRecordatorioModal, setShowRecordatorioModal] = useState(false);
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [loadingRecordatorios, setLoadingRecordatorios] = useState(false);

  useEffect(() => {
    const fetchDocenteData = async () => {
      if (!user?.email) return;
      
      try {
        const response = await fetch(`/api/docentes/by-email/${encodeURIComponent(user.email)}`);
        if (response.ok) {
          const data = await response.json();
          setDocente(data.docente);
          setInstitucionId(data.docente?.institucion?.id || null);
          
          // Cargar recordatorios después de obtener el docente
          if (data.docente?.id) {
            fetchRecordatorios(data.docente.id);
          }
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
      if (response.ok) {
        const data = await response.json();
        setRecordatorios(data.recordatorios || []);
      }
    } catch (error) {
      console.error('Error fetching recordatorios:', error);
    } finally {
      setLoadingRecordatorios(false);
    }
  };

  const handleLogout = async () => {
    // Mostrar diálogo informativo antes de cerrar sesión
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      html: `
        <div style="text-align: left; margin-top: 1rem;">
          <p style="margin-bottom: 1rem; color: #334155;">Estás a punto de cerrar sesión de tu cuenta.</p>
          <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 0.5rem; padding: 1rem; margin-top: 1rem;">
            <p style="font-weight: 600; color: #1e40af; margin-bottom: 0.5rem; font-size: 0.875rem;">ℹ️ Información importante:</p>
            <ul style="color: #1e3a8a; font-size: 0.875rem; padding-left: 1.5rem; margin: 0; line-height: 1.8;">
              <li>Tu sesión será finalizada de forma segura</li>
              <li>Deberás iniciar sesión nuevamente para acceder</li>
              <li>Tus datos y configuraciones se mantendrán guardados</li>
            </ul>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true,
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-lg',
        cancelButton: 'rounded-lg'
      }
    });

    // Si el usuario confirma, proceder con el cierre de sesión
    if (result.isConfirmed) {
      try {
        await signOut();
        // Mostrar mensaje de éxito antes de redirigir
        await Swal.fire({
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión exitosamente. ¡Hasta pronto!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-2xl'
          }
        });
        router.push('/login');
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        await Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al cerrar sesión. Por favor, intenta nuevamente.',
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

  if (loading || !docente) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando información del docente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Panel de Docente
              </h1>
              <p className="text-slate-600">
                {docente.institucion.nombre}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">
                  {docente.nombres} {docente.apellidos}
                </p>
                <p className="text-sm text-slate-600">{docente.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                Recordatorios
              </h3>
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
            
            {/* Lista de recordatorios */}
            {loadingRecordatorios ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Cargando recordatorios...</p>
              </div>
            ) : recordatorios.length > 0 ? (
              <div className="space-y-4">
                {recordatorios.map((recordatorio) => {
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

                  return (
                    <div
                      key={recordatorio.id}
                      className={`p-6 rounded-xl border-2 transition-all hover:shadow-md ${
                        esPasado
                          ? 'bg-slate-50 border-slate-200'
                          : esHoy
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
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
                          <p className="text-slate-700 mb-3">{recordatorio.descripcion}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm text-slate-600">
                          <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">
                            {fechaRecordatorio.toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span>
                            {recordatorio.materia.nombre} - {recordatorio.area.nombre}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <span>
                            {recordatorio.grado.nombre} ({recordatorio.grado.nivel}) - {recordatorio.curso.nombre}
                            {recordatorio.curso.jornada && ` (${recordatorio.curso.jornada})`}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>
                            {recordatorio.estudiantes.length} estudiante{recordatorio.estudiantes.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {recordatorio.estudiantes.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <p className="text-xs font-medium text-slate-600 mb-2">Estudiantes asignados:</p>
                          <div className="flex flex-wrap gap-2">
                            {recordatorio.estudiantes.map((est, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
                              >
                                {est.estudiante.nombres} {est.estudiante.apellidos}
                                {est.estudiante.codigo_estudiantil && (
                                  <span className="text-slate-500 ml-1">
                                    ({est.estudiante.codigo_estudiantil})
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-600">No hay recordatorios aún</p>
                <p className="text-sm text-slate-500 mt-2">Crea tu primer recordatorio para empezar</p>
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
              text: 'El recordatorio ha sido creado exitosamente.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
              customClass: {
                popup: 'rounded-2xl'
              }
            });
            // Recargar recordatorios después de crear uno nuevo
            if (docente?.id) {
              fetchRecordatorios(docente.id);
            }
          }}
          docenteId={docente.id}
          institucionId={docente.institucion.id}
          asignaciones={docente.docenteAsignaciones || []}
        />
      )}
    </div>
  );
}

