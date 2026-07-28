'use client';

import { useState, useEffect, useCallback, type InputHTMLAttributes } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import type { Institucion, Sede, BrandingData } from '@/types';
import InstitucionAuthGuard from '@/components/auth/InstitucionAuthGuard';
import { showSuccess, showError, showLoading, closeLoading, showWarning, showConfirm } from '@/lib/notifications';
import { useAuth } from '@/contexts/AuthContext';
import AddAdministradorModal from '../AddAdministradorModal';
import Footer from '../Footer';
import Header from '../Header';
import InstitutionPlanSection from './InstitutionPlanSection';
import { useSubscriptionAccess } from '@/contexts/SubscriptionAccessContext';
import { ProfilePageSkeleton } from '@/components/ui/PageSkeletons';

interface PerfilFormData {
  email: string;
  direccion_principal: string;
  nombre_contacto: string;
  telefono_contacto: string;
}

function BufferedProfileInput({
  value,
  onCommit,
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onBlur'> & {
  value: string;
  onCommit: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  return (
    <input
      {...props}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => {
        if (draft !== value) onCommit(draft);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur();
      }}
      className={`form-quiet-focus ${className || ''}`.trim()}
    />
  );
}

export default function PerfilPage() {
  return (
    <InstitucionAuthGuard>
      <PerfilPageContent />
    </InstitucionAuthGuard>
  );
}

function PerfilPageContent() {
  const params = useParams();
  const router = useRouter();
  const { signOut } = useAuth();
  const { mode: subscriptionMode } = useSubscriptionAccess();
  const trialBillingOnly = subscriptionMode === 'trial_billing_only';
  const [institucion, setInstitucion] = useState<Institucion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [headerRefreshKey, setHeaderRefreshKey] = useState(0);
  const [formData, setFormData] = useState<PerfilFormData>({
    email: '',
    direccion_principal: '',
    nombre_contacto: '',
    telefono_contacto: ''
  });
  const [branding, setBranding] = useState<BrandingData>({
    logoUrl: null,
    bannerUrl: null,
    colorPrimario: '#2563eb',
    colorSecundario: '#0f172a'
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const fetchInstitucion = useCallback(async () => {
    try {
      const response = await fetch(`/api/instituciones/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setInstitucion(data);
        setFormData({
          email: data.email || '',
          direccion_principal: data.direccion_principal || '',
          nombre_contacto: data.nombre_contacto || '',
          telefono_contacto: data.telefono_contacto || ''
        });
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

  const fetchBranding = useCallback(async () => {
    try {
      const response = await fetch(`/api/instituciones/${params.id}/branding`);
      if (response.ok) {
        const data = await response.json();
        setBranding({
          logoUrl: data.logoUrl ?? null,
          bannerUrl: data.bannerUrl ?? null,
          colorPrimario: data.color_primario || '#2563eb',
          colorSecundario: data.color_secundario || '#0f172a'
        });
      }
    } catch (error) {
      console.error('Error al cargar branding:', error);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchInstitucion();
      fetchBranding();
    }
  }, [params.id, fetchBranding, fetchInstitucion]);

  const obtainSupabaseClient = () => {
    if (!isSupabaseConfigured()) {
      showError('Error', 'Supabase no está configurado.');
      return null;
    }
    try {
      return getSupabaseClient();
    } catch (clientError) {
      console.error('No se pudo inicializar Supabase:', clientError);
      showError('Error', 'No se pudo conectar con Supabase.');
      return null;
    }
  };

  const uploadInstitutionAsset = async (
    supabaseClient: ReturnType<typeof getSupabaseClient>,
    institucionId: number,
    file: File,
    kind: 'logo' | 'banner'
  ): Promise<string | null> => {
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'instituciones';
    const extension =
      file.name.split('.').pop()?.toLowerCase() || (file.type === 'image/svg+xml' ? 'svg' : 'png');
    const filePath = `instituciones/${institucionId}/${kind}.${extension}`;

    const { error: uploadError } = await supabaseClient.storage.from(bucket).upload(filePath, file, {
      upsert: true,
      contentType: file.type || undefined,
      cacheControl: '3600'
    });

    if (uploadError) {
      console.error(`Error subiendo ${kind}:`, uploadError);
      showError('Error', `No se pudo subir el ${kind}.`);
      return null;
    }

    return filePath;
  };

  const handleSaveChanges = async () => {
    if (!institucion) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/instituciones/${institucion.id}/perfil`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        showError('No se pudo guardar', errorData.error || 'Verifica los datos ingresados e intenta nuevamente.');
        return;
      }

      let logoPath: string | null = null;
      let bannerPath: string | null = null;
      if (logoFile || bannerFile) {
        const supabaseClient = obtainSupabaseClient();
        if (!supabaseClient) {
          return;
        }
        if (logoFile) {
          logoPath = await uploadInstitutionAsset(supabaseClient, institucion.id, logoFile, 'logo');
          if (!logoPath) {
            return;
          }
        }
        if (bannerFile) {
          bannerPath = await uploadInstitutionAsset(supabaseClient, institucion.id, bannerFile, 'banner');
          if (!bannerPath) {
            return;
          }
        }
      }

      const brandingResponse = await fetch(`/api/instituciones/${institucion.id}/branding`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logo_url: logoPath ?? undefined,
          banner_url: bannerPath ?? undefined,
          color_primario: branding.colorPrimario,
          color_secundario: branding.colorSecundario
        })
      });

      if (!brandingResponse.ok) {
        showWarning(
          'Actualización parcial',
          'Se guardó la información, pero no se pudo actualizar el branding.'
        );
        return;
      }

      const updatedInstitucion = await response.json();
      setInstitucion(updatedInstitucion.data);
      await fetchBranding();
      setHeaderRefreshKey(prev => prev + 1);
      setLogoFile(null);
      setBannerFile(null);
      setIsEditing(false);
      showSuccess('Actualización exitosa', 'Los datos de la institución y la personalización fueron guardados.');
    } catch (saveError) {
      console.error('Error al guardar cambios:', saveError);
      showError('Error inesperado', 'Ocurrió un problema al guardar los cambios. Intenta nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!institucion || isDeletingAccount) return;

    const warning = await showConfirm({
      icon: 'warning',
      title: '¿Eliminar cuenta de la institución?',
      html: `
        <div class="text-left space-y-3 text-sm">
          <p class="font-semibold text-red-700">Esta acción es permanente e irreversible.</p>
          <p>Se eliminarán de la base de datos todos los datos relacionados con <strong>${institucion.nombre}</strong>, incluyendo:</p>
          <ul class="list-disc pl-5 space-y-1">
            <li>Administradores y sus accesos</li>
            <li>Docentes, estudiantes y acudientes</li>
            <li>Grados, cursos, áreas y materias</li>
            <li>Recordatorios y suscripciones push</li>
            <li>Suscripción, pagos y personalización (logo/banner)</li>
            <li>Cuentas de acceso en el sistema de autenticación</li>
          </ul>
          <p class="text-slate-600">No podrá recuperar esta información después.</p>
        </div>
      `,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      reverseButtons: true,
      focusCancel: true,
    });

    if (!warning) return;

    const confirmInput = await showConfirm({
      icon: 'error',
      title: 'Confirmación final',
      html: '<p class="text-sm text-slate-600">Escriba <strong>ELIMINAR</strong> para confirmar la eliminación permanente de la cuenta.</p>',
      inputPlaceholder: 'ELIMINAR',
      confirmButtonText: 'Eliminar cuenta permanentemente',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      reverseButtons: true,
      focusCancel: true,
      inputValidator: (value) => {
        if (value?.trim().toUpperCase() !== 'ELIMINAR') {
          return 'Debe escribir ELIMINAR exactamente';
        }
        return null;
      },
    });

    if (!confirmInput) return;

    setIsDeletingAccount(true);
    showLoading(
      'Eliminando cuenta',
      'Estamos eliminando todos los datos de la institución. Por favor espere…'
    );

    try {
      const response = await fetch(`/api/instituciones/${institucion.id}/delete-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation: 'ELIMINAR' }),
      });
      const data = await response.json();
      closeLoading();

      if (!response.ok) {
        await showError('No se pudo eliminar', data.error ?? 'Intente de nuevo.');
        return;
      }

      await signOut();
      await showSuccess('Cuenta eliminada', 'La institución y todos sus datos fueron eliminados permanentemente.');
      router.push('/');
    } catch (deleteError) {
      closeLoading();
      console.error('Error eliminando cuenta:', deleteError);
      await showError('Error', 'No se pudo eliminar la cuenta. Intente de nuevo o contacte soporte.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  if (loading) {
    return <ProfilePageSkeleton />;
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
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Perfil no encontrado</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <Link 
            href="/registro-institucion"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Registrar Nueva Institución
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header
        key={`institucion-header-${headerRefreshKey}`}
        title={trialBillingOnly ? 'Renovar o eliminar cuenta' : `Perfil de ${institucion.nombre}`}
        subtitle={
          trialBillingOnly
            ? 'Período de prueba finalizado'
            : 'Información detallada de la institución'
        }
      />
      <div className="min-h-screen bg-blue-50 flex flex-col">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">

        {trialBillingOnly && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            <p className="font-semibold">Período de prueba finalizado</p>
            <p className="mt-1">
              El acceso al resto de la plataforma está bloqueado para administradores y docentes.
              Desde aquí puede contratar un plan para reactivar el servicio o eliminar todos los
              datos de la institución.
            </p>
          </div>
        )}

        <InstitutionPlanSection institucionId={institucion.id} />

        {!trialBillingOnly && (
        <>
        {/* Información Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Información Básica */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Información Básica</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Nombre de la Institución</label>
                <p className="text-slate-800 font-medium text-lg">{institucion.nombre}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">NIT</label>
                <p className="text-slate-800 font-medium">{institucion.nit}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                {isEditing ? (
                  <BufferedProfileInput
                    type="email"
                    value={formData.email}
                    onCommit={(value) => setFormData(prev => ({ ...prev, email: value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                ) : (
                  <p className="text-slate-800 font-medium">{institucion.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Dirección Principal</label>
                {isEditing ? (
                  <BufferedProfileInput
                    type="text"
                    value={formData.direccion_principal}
                    onCommit={(value) =>
                      setFormData(prev => ({ ...prev, direccion_principal: value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                ) : (
                  <p className="text-slate-800 font-medium">{institucion.direccion_principal}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Información de Contacto</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Nombre de Contacto</label>
                {isEditing ? (
                  <BufferedProfileInput
                    type="text"
                    value={formData.nombre_contacto}
                    onCommit={(value) =>
                      setFormData(prev => ({ ...prev, nombre_contacto: value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                ) : (
                  <p className="text-slate-800 font-medium">{institucion.nombre_contacto}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Teléfono de Contacto</label>
                {isEditing ? (
                  <BufferedProfileInput
                    type="tel"
                    value={formData.telefono_contacto}
                    onCommit={(value) =>
                      setFormData(prev => ({ ...prev, telefono_contacto: value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                ) : (
                  <p className="text-slate-800 font-medium">{institucion.telefono_contacto}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Fecha de Registro</label>
                <p className="text-slate-800 font-medium">
                  {institucion.created_at
                  ? new Date(institucion.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Jornadas y Sedes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Jornadas */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Jornadas de la Institución</h2>
            {(institucion.jornadas ?? []).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {(institucion.jornadas ?? []).map((jornada, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {jornada}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-500">No hay jornadas configuradas</p>
              </div>
            )}
          </div>

          {/* Sedes */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Sedes</h2>
            {institucion.sedes && institucion.sedes.length > 0 ? (
              <div className="space-y-4">
                {institucion.sedes.map((sede) => (
                  <div key={sede.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <h3 className="font-medium text-slate-800 mb-2">{sede.nombre}</h3>
                    <div className="flex flex-wrap gap-1">
                      {sede.jornadas.map((jornada, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {jornada}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <h3 className="font-medium text-slate-800">Sede Principal</h3>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Personalización</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Logo (PNG/SVG)</label>
                <input
                  type="file"
                  accept="image/png,image/svg+xml"
                  disabled={!isEditing}
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Banner (PNG/SVG)</label>
                <input
                  type="file"
                  accept="image/png,image/svg+xml"
                  disabled={!isEditing}
                  onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Color primario</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={branding.colorPrimario ?? ''}
                    disabled={!isEditing}
                    onChange={(e) => setBranding(prev => ({ ...prev, colorPrimario: e.target.value }))}
                    className="h-10 w-14 rounded border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    value={branding.colorPrimario ?? ''}
                    disabled={!isEditing}
                    onChange={(e) => setBranding(prev => ({ ...prev, colorPrimario: e.target.value }))}
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Color secundario</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={branding.colorSecundario ?? ''}
                    disabled={!isEditing}
                    onChange={(e) => setBranding(prev => ({ ...prev, colorSecundario: e.target.value }))}
                    className="h-10 w-14 rounded border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    value={branding.colorSecundario ?? ''}
                    disabled={!isEditing}
                    onChange={(e) => setBranding(prev => ({ ...prev, colorSecundario: e.target.value }))}
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mb-8">
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-semibold text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50"
            >
              Editar
            </button>
          )}
          {isEditing && (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                {isSaving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </>
          )}
        </div>
        </>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-red-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Zona de peligro</h2>
          <p className="text-sm text-slate-600 mb-4">
            Eliminar la cuenta borrará permanentemente la institución y todos los datos asociados
            (administradores, docentes, estudiantes, recordatorios, suscripción y accesos de
            autenticación). Esta acción no se puede deshacer.
          </p>
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={isDeletingAccount || isEditing || isSaving}
            className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDeletingAccount ? 'Eliminando cuenta...' : 'Eliminar cuenta'}
          </button>
        </div>
        
      </div>

      {/* Modal para Agregar Administrador */}
      <AddAdministradorModal
        isOpen={showAddAdminModal}
        onClose={() => setShowAddAdminModal(false)}
        onSuccess={() => {
          // Recargar la información de la institución
          fetch(`/api/instituciones/${params.id}`)
            .then(res => res.json())
            .then(data => setInstitucion(data))
            .catch(err => console.error('Error al recargar institución:', err));
        }}
        institucionId={parseInt(params.id as string)}
      />
      <Footer />
    </div>
    </>
  );
}
