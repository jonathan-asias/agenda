'use client';

import { useState, useEffect, useCallback } from 'react';
import { showSuccess, showError, showConfirm } from '@/lib/notifications';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { Institucion, Sede, InstitucionAdministrador } from '@/types';
import { Button } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import InstitucionAuthGuard from '@/components/auth/InstitucionAuthGuard';
import AddAdministradorModal from './AddAdministradorModal';
import Footer from './Footer';
import Header from './Header';
import { useSubscriptionAccess } from '@/contexts/SubscriptionAccessContext';

export default function InstitucionPage() {
  return (
    <InstitucionAuthGuard>
      <InstitucionPageContent />
    </InstitucionAuthGuard>
  );
}

function InstitucionPageContent() {
  const params = useParams();
  const [institucion, setInstitucion] = useState<Institucion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<InstitucionAdministrador | null>(null);
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
  const { canWrite } = useSubscriptionAccess();

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

  const handleViewAdmin = (admin: InstitucionAdministrador) => {
    setSelectedAdmin(admin);
    setShowViewAdminModal(true);
  };

  const handleEditAdmin = (admin: InstitucionAdministrador) => {
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
        await showError('Error', errorData.error || 'No se pudo actualizar el administrador');
        return;
      }

      await fetchInstitucion();
      setShowEditAdminModal(false);
      setSelectedAdmin(null);
      await showSuccess('Administrador actualizado', 'Administrador actualizado correctamente');
    } catch (err) {
      console.error('Error actualizando administrador:', err);
      await showError('Error', 'No se pudo actualizar el administrador');
    } finally {
      setIsUpdatingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (admin: InstitucionAdministrador) => {
    if (!institucion) {
      return;
    }
    const confirmed = await showConfirm({
      title: '¿Eliminar administrador?',
      html: `¿Está seguro de eliminar a <strong>${admin.nombre} ${admin.apellido}</strong>? Esta acción no se puede deshacer.`,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/instituciones/${institucion.id}/administradores/${admin.id}`,
        { method: 'DELETE' }
      );
      if (!response.ok) {
        const errorData = await response.json();
        await showError('Error', errorData.error || 'No se pudo eliminar el administrador');
        return;
      }
      await fetchInstitucion();
      await showSuccess('Administrador eliminado', 'El administrador fue eliminado correctamente');
    } catch (err) {
      console.error('Error eliminando administrador:', err);
      await showError('Error', 'No se pudo eliminar el administrador');
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
    <>
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
            <Button
              type="button"
              variant="primary"
              onClick={() => setShowAddAdminModal(true)}
              className="w-full sm:w-auto"
              disabled={!canWrite}
              title={!canWrite ? 'Suscripción cancelada: solo lectura' : undefined}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar Administrador
            </Button>
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
                      disabled={!canWrite}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2m-1 0v14m-7-7h14" />
                      </svg>
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAdmin(admin)}
                      disabled={!canWrite}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <Button type="button" variant="primary" onClick={() => setShowAddAdminModal(true)} disabled={!canWrite}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Crear administrador
              </Button>
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
      <Modal
        open={showViewAdminModal && !!selectedAdmin}
        onClose={() => setShowViewAdminModal(false)}
        title="Administrador"
        size="md"
      >
        {selectedAdmin && (
          <>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">Detalles completos del administrador.</p>
            <div className="mb-5">
              <p className="text-lg font-semibold text-[var(--color-text-primary)]">
                {selectedAdmin.nombre} {selectedAdmin.apellido}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">{selectedAdmin.cargo}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="bg-[var(--color-surface-nested)] border border-[var(--color-border-light)] rounded-xl p-3">
                <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)] mb-1">Correo</p>
                <p className="text-[var(--color-text-primary)] font-medium">{selectedAdmin.correo || selectedAdmin.email}</p>
              </div>
              <div className="bg-[var(--color-surface-nested)] border border-[var(--color-border-light)] rounded-xl p-3">
                <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)] mb-1">Teléfono</p>
                <p className="text-[var(--color-text-primary)] font-medium">{selectedAdmin.telefono || 'No registrado'}</p>
              </div>
              <div className="bg-[var(--color-surface-nested)] border border-[var(--color-border-light)] rounded-xl p-3">
                <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)] mb-1">Cargo</p>
                <p className="text-[var(--color-text-primary)] font-medium">{selectedAdmin.cargo}</p>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-[var(--color-border-light)]">
              <Button type="button" variant="primary" fullWidth onClick={() => setShowViewAdminModal(false)}>
                Cerrar
              </Button>
            </div>
          </>
        )}
      </Modal>
      <Modal
        open={showEditAdminModal && !!selectedAdmin}
        onClose={() => setShowEditAdminModal(false)}
        title="Editar administrador"
        size="lg"
      >
        {selectedAdmin && (
          <>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">Actualiza los datos del administrador.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                value={editAdminData.nombre}
                onChange={(e) => setEditAdminData((prev) => ({ ...prev, nombre: e.target.value }))}
              />
              <Input
                label="Apellido"
                value={editAdminData.apellido}
                onChange={(e) => setEditAdminData((prev) => ({ ...prev, apellido: e.target.value }))}
              />
              <div className="md:col-span-2">
                <Input
                  label="Correo"
                  type="email"
                  value={editAdminData.correo}
                  onChange={(e) => setEditAdminData((prev) => ({ ...prev, correo: e.target.value }))}
                />
              </div>
              <Input
                label="Teléfono"
                value={editAdminData.telefono}
                onChange={(e) => setEditAdminData((prev) => ({ ...prev, telefono: e.target.value }))}
              />
              <Input
                label="Cargo"
                value={editAdminData.cargo}
                onChange={(e) => setEditAdminData((prev) => ({ ...prev, cargo: e.target.value }))}
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Sede</label>
                <select
                  className="w-full min-h-11 px-3 py-2 text-sm text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-focus)]"
                  value={editAdminData.sede_id}
                  onChange={(e) => setEditAdminData((prev) => ({ ...prev, sede_id: e.target.value }))}
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
                <Input
                  label="Nueva contraseña (opcional)"
                  type="password"
                  value={editAdminData.password}
                  onChange={(e) => setEditAdminData((prev) => ({ ...prev, password: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 mt-4 border-t border-[var(--color-border-light)]">
              <Button type="button" variant="outline" onClick={() => setShowEditAdminModal(false)}>
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleUpdateAdmin}
                disabled={isUpdatingAdmin}
                className="sm:ml-auto"
              >
                {isUpdatingAdmin ? 'Guardando…' : 'Guardar cambios'}
              </Button>
            </div>
          </>
        )}
      </Modal>
      <Footer />
    </div>
    </>
  );
}
