'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../../../contexts/AuthContext';
import DocenteAuthGuard from '../DocenteAuthGuard';
import Swal from 'sweetalert2';
import Footer from '../../Footer';
import Header from '../../Header';

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

export default function DocentePerfilPage() {
  const params = useParams();
  const router = useRouter();
  const { signOut, user, loading: authLoading } = useAuth();
  const [docente, setDocente] = useState<Docente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Esperar a que el AuthContext termine de cargar
    if (authLoading) {
      return;
    }

    const fetchDocente = async () => {
      if (!user?.email) {
        setError('Usuario no autenticado');
        setLoading(false);
        return;
      }

      const institucionId = params.id as string;
      if (!institucionId) {
        setError('ID de institución no válido');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/docentes/by-email/${encodeURIComponent(user.email)}`);
        const data = await response.json();
        
        if (response.ok) {
          if (data.docente) {
            // Verificar que el docente pertenece a la institución de la URL
            const docenteInstitucionId = data.docente.institucion?.id?.toString();
            if (docenteInstitucionId === institucionId) {
              setDocente(data.docente);
            } else {
              console.error('ID de institución no coincide:', {
                docenteInstitucionId,
                urlInstitucionId: institucionId,
                docente: data.docente
              });
              setError(`El docente no pertenece a esta institución. Institución del docente: ${docenteInstitucionId}, Institución de la URL: ${institucionId}`);
            }
          } else {
            console.error('Docente no encontrado en la respuesta:', data);
            setError('Docente no encontrado en la respuesta');
          }
        } else {
          console.error('Error en la respuesta de la API:', {
            status: response.status,
            statusText: response.statusText,
            data
          });
          setError(data.error || `Error ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error al cargar el docente:', error);
        setError(`Error al cargar el docente: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDocente();
  }, [user, params.id, authLoading]);

  const handleSignOut = async () => {
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

    if (result.isConfirmed) {
      try {
        await signOut();
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
        router.push('/');
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

  if (loading) {
    return (
      <DocenteAuthGuard>
        <div className="min-h-screen bg-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando perfil del docente...</p>
          </div>
        </div>
      </DocenteAuthGuard>
    );
  }

  if (error || !docente) {
    return (
      <DocenteAuthGuard>
        <div className="min-h-screen bg-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Perfil no encontrado</h1>
            <p className="text-slate-600 mb-6">{error}</p>
            <Link 
              href={`/institucion/${params.id}/docente`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </DocenteAuthGuard>
    );
  }

  return (
    <DocenteAuthGuard>
      <Header 
        title={`Perfil de ${docente.nombres} ${docente.apellidos}`} 
        subtitle="Información del docente"
      />
      <div className="min-h-screen bg-blue-50 flex flex-col">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          {/* Botones de acción */}
          <div className="mb-8 flex flex-wrap gap-3">
            <Link
              href={`/institucion/${params.id}/docente`}
              className="inline-flex items-center px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al Dashboard
            </Link>
          </div>

          {/* Información Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Información Personal */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Información Personal</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Nombre Completo</label>
                  <p className="text-slate-800 font-medium text-lg">
                    {docente.nombres} {docente.apellidos}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Correo Electrónico</label>
                  <p className="text-slate-800 font-medium">{docente.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Teléfono</label>
                  <p className="text-slate-800 font-medium">{docente.telefono || 'No registrado'}</p>
                </div>
              </div>
            </div>

            {/* Información Institucional */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Información Institucional</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Institución</label>
                  <p className="text-slate-800 font-medium text-lg">{docente.institucion.nombre}</p>
                </div>
                {docente.sede ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Sede</label>
                    <p className="text-slate-800 font-medium">{docente.sede.nombre}</p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Sede</label>
                    <p className="text-slate-500 italic">No asignada</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Asignaciones */}
          {docente.docenteAsignaciones && docente.docenteAsignaciones.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Mis Asignaciones ({docente.docenteAsignaciones.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {docente.docenteAsignaciones.map((asignacion, index) => (
                  <div key={index} className="bg-slate-50 rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
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
          )}
        </div>
        <Footer />
      </div>
    </DocenteAuthGuard>
  );
}

