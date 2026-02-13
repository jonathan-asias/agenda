'use client';

import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import InstitucionAuthGuard from './InstitucionAuthGuard';
import AddAdministradorModal from './AddAdministradorModal';
import Footer from './Footer';
import Header from './Header';

interface Institucion {
  id: number;
  nombre: string;
  direccion_principal: string;
  nit: string;
  nombre_contacto: string;
  telefono_contacto: string;
  email: string;
  color_primario?: string | null;
  tiene_sedes: boolean;
  jornadas: string[];
  created_at: string;
  sedes: Sede[];
  administradores: Administrador[];
}

interface Sede {
  id: number;
  nombre: string;
  jornadas: string[];
}

interface Administrador {
  id: number;
  nombre: string;
  apellido: string;
  correo?: string;
  email?: string;
  telefono?: string;
  cargo: string;
  sede_id?: number | null;
}

export default function InstitucionPage() {
  const params = useParams();
  const [institucion, setInstitucion] = useState<Institucion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Administrador | null>(null);
  const [showViewAdminModal, setShowViewAdminModal] = useState(false);
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);
  const [editAdminData, setEditAdminData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    cargo: '',
    sede_id: '',
    password: ''
  });
  const [isUpdatingAdmin, setIsUpdatingAdmin] = useState(false);
  const primaryColor = institucion?.color_primario || '#2563eb';

  const fetchInstitucion = useCallback(async () => {
    try {
      const response = await fetch(`/api/instituciones/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setInstitucion(data);
      } else {
        setError('Institución no encontrada');
      }
    } catch (error) {
      console.error('Error al cargar la institución:', error);
      setError('Error al cargar la institución');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchInstitucion();
    }
  }, [params.id, fetchInstitucion]);

  const handleViewAdmin = (admin: Administrador) => {
    setSelectedAdmin(admin);
    setShowViewAdminModal(true);
  };

  const handleEditAdmin = (admin: Administrador) => {
    setSelectedAdmin(admin);
    setEditAdminData({
      nombre: admin.nombre || '',
      apellido: admin.apellido || '',
      correo: admin.correo || admin.email || '',
      telefono: admin.telefono || '',
      cargo: admin.cargo || '',
      sede_id: admin.sede_id ? String(admin.sede_id) : 'principal',
      password: ''
    });
    setShowEditAdminModal(true);
  };

  const handleUpdateAdmin = async () => {
    if (!selectedAdmin || !institucion) {
      return;
    }

    setIsUpdatingAdmin(true);
    try {
      const response = await fetch(
        `/api/instituciones/${institucion.id}/administradores/${selectedAdmin.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editAdminData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorData.error || 'No se pudo actualizar el administrador'
        });
        return;
      }

      await fetchInstitucion();
      setShowEditAdminModal(false);
      setSelectedAdmin(null);
      await Swal.fire({
        icon: 'success',
        title: 'Administrador actualizado',
        text: 'Administrador actualizado correctamente'
      });
    } catch (err) {
      console.error('Error actualizando administrador:', err);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el administrador'
      });
    } finally {
      setIsUpdatingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (admin: Administrador) => {
    if (!institucion) {
      return;
    }
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar administrador?',
      html: `¿Está seguro de eliminar a <strong>${admin.nombre} ${admin.apellido}</strong>? Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/instituciones/${institucion.id}/administradores/${admin.id}`,
        { method: 'DELETE' }
      );
      if (!response.ok) {
        const errorData = await response.json();
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorData.error || 'No se pudo eliminar el administrador'
        });
        return;
      }
      await fetchInstitucion();
      await Swal.fire({
        icon: 'success',
        title: 'Administrador eliminado',
        text: 'El administrador fue eliminado correctamente'
      });
    } catch (err) {
      console.error('Error eliminando administrador:', err);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el administrador'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando institución...</p>
        </div>
      </div>
    );
  }

  if (error || !institucion) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Institución no encontrada</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <Link 
            href="/registro-institucion"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Registrar Nueva Institución
          </Link>
        </div>
      </div>
    );
  }

  return (
    <InstitucionAuthGuard>
      <Header title={institucion.nombre} />
      <div className="min-h-screen bg-blue-50 flex flex-col">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Título del dashboard */}
        <h1 className="text-3xl font-bold text-slate-800 text-center mb-8">
          Dashboard de Administración
        </h1>

        {/* Administradores */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-800">Administradores</h2>
              <div className="relative group">
                <button
                  type="button"
                  className="p-1 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  aria-label="Información sobre funciones del administrador"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <div className="absolute left-0 top-full mt-1.5 z-10 w-72 p-3 bg-slate-800 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <p className="leading-relaxed">
                    Los administradores pueden crear y gestionar docentes, estudiantes, materias y cursos de la sede a la cual estén vinculados.
                  </p>
                  <div className="absolute -top-1.5 left-4 w-3 h-3 bg-slate-800 transform rotate-45 pointer-events-none" />
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAddAdminModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar Administrador
            </button>
          </div>
          
          {institucion.administradores && institucion.administradores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {institucion.administradores.map((admin) => (
                <div key={admin.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="mb-2">
                    <h3 className="font-medium text-slate-800">
                      {admin.nombre} {admin.apellido}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{admin.correo || admin.email}</p>
                  <p className="text-sm text-slate-500">{admin.cargo}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleViewAdmin(admin)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                    >
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver info
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditAdmin(admin)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100"
                    >
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2m-1 0v14m-7-7h14" />
                      </svg>
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAdmin(admin)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                    >
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Aquí puede crear un administrador</h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                Los administradores tendrán la función de crear y gestionar docentes, estudiantes, materias y cursos de la sede a la cual estén vinculados.
              </p>
              <button
                onClick={() => setShowAddAdminModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Crear administrador
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Agregar Administrador */}
      <AddAdministradorModal
        isOpen={showAddAdminModal}
        onClose={() => setShowAddAdminModal(false)}
        onSuccess={() => {
          // Recargar la información de la institución
          fetchInstitucion();
        }}
        institucionId={parseInt(params.id as string)}
      />
      {showViewAdminModal && selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div
              className="flex items-center justify-between px-6 py-4 text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A4 4 0 0110 15h4a4 4 0 014.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Administrador</h3>
                  <p className="text-sm text-white/80">Detalles completos</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowViewAdminModal(false)}
                className="text-white/80 hover:text-white"
                aria-label="Cerrar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-5">
                <p className="text-lg font-semibold text-slate-800">
                  {selectedAdmin.nombre} {selectedAdmin.apellido}
                </p>
                <p className="text-sm text-slate-500">{selectedAdmin.cargo}</p>
              </div>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Correo</p>
                  <p className="text-slate-800 font-medium">{selectedAdmin.correo || selectedAdmin.email}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Teléfono</p>
                  <p className="text-slate-800 font-medium">{selectedAdmin.telefono || 'No registrado'}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Cargo</p>
                  <p className="text-slate-800 font-medium">{selectedAdmin.cargo}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowViewAdminModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditAdminModal && selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div
              className="flex items-center justify-between px-6 py-4 text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2m-1 0v14m-7-7h14" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Editar Administrador</h3>
                  <p className="text-sm text-white/80">Actualiza los datos del administrador</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditAdminModal(false)}
                className="text-white/80 hover:text-white"
                aria-label="Cerrar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre</label>
                  <input
                    className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Nombre"
                    value={editAdminData.nombre}
                    onChange={(e) => setEditAdminData(prev => ({ ...prev, nombre: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Apellido</label>
                  <input
                    className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Apellido"
                    value={editAdminData.apellido}
                    onChange={(e) => setEditAdminData(prev => ({ ...prev, apellido: e.target.value }))}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Correo</label>
                  <input
                    className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Correo"
                    value={editAdminData.correo}
                    onChange={(e) => setEditAdminData(prev => ({ ...prev, correo: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Teléfono</label>
                  <input
                    className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Teléfono"
                    value={editAdminData.telefono}
                    onChange={(e) => setEditAdminData(prev => ({ ...prev, telefono: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Cargo</label>
                  <input
                    className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Cargo"
                    value={editAdminData.cargo}
                    onChange={(e) => setEditAdminData(prev => ({ ...prev, cargo: e.target.value }))}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Sede</label>
                  <select
                    className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={editAdminData.sede_id}
                    onChange={(e) => setEditAdminData(prev => ({ ...prev, sede_id: e.target.value }))}
                  >
                    <option value="">Seleccione una sede</option>
                    {institucion?.sedes && institucion.sedes.length > 0 ? (
                      institucion.sedes.map((sede) => (
                        <option key={sede.id} value={String(sede.id)}>
                          {sede.nombre}
                        </option>
                      ))
                    ) : (
                      <option value="principal">Sede Principal</option>
                    )}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nueva contraseña (opcional)</label>
                  <input
                    className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Nueva contraseña (opcional)"
                    type="password"
                    value={editAdminData.password}
                    onChange={(e) => setEditAdminData(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditAdminModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleUpdateAdmin}
                  disabled={isUpdatingAdmin}
                  className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50"
                >
                  {isUpdatingAdmin ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
    </InstitucionAuthGuard>
  );
}
