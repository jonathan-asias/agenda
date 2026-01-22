'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import InstitucionAuthGuard from '../InstitucionAuthGuard';
import { useAuth } from '../../../../contexts/AuthContext';
import Footer from '../Footer';
import Header from '../Header';

type Institucion = {
  id: number;
  nombre: string;
  direccion_principal: string;
  nit: string;
  nombre_contacto: string;
  telefono_contacto: string;
  email: string;
  tiene_sedes: boolean;
  jornadas: string[];
  created_at: string;
};

type NotificationSettings = {
  recordatorios: boolean;
  alertasEmail: boolean;
  alertasSms: boolean;
};

export default function ConfiguracionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { signOut } = useAuth();
  const [institucion, setInstitucion] = useState<Institucion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<NotificationSettings>({
    recordatorios: true,
    alertasEmail: true,
    alertasSms: false,
  });

  const institucionId = useMemo(() => params?.id ?? '', [params?.id]);

  useEffect(() => {
    const fetchInstitucion = async () => {
      if (!institucionId) {
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/instituciones/${institucionId}`);
        if (!response.ok) {
          throw new Error('No fue posible obtener la información de la institución');
        }
        const data = await response.json();
        setInstitucion(data);
      } catch (err) {
        console.error('Error cargando institución:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchInstitucion();
  }, [institucionId]);

  const handleTogglePreference = (key: keyof NotificationSettings) => {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleSavePreferences = async () => {
    await Swal.fire({
      icon: 'success',
      title: 'Preferencias guardadas',
      text: 'Tus configuraciones de notificación se han actualizado.',
      confirmButtonColor: '#2563eb',
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (err) {
      console.error('Error cerrando sesión:', err);
      await Swal.fire({
        icon: 'error',
        title: 'Error al cerrar sesión',
        text: 'Intenta nuevamente en unos momentos.',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  return (
    <InstitucionAuthGuard>
      <Header title="Configuración de la Institución" subtitle="Administra las preferencias generales y de comunicación" />
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">

          {loading && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                  <p className="text-slate-500">Cargando configuración...</p>
                </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
              <h2 className="text-lg font-semibold mb-2">No pudimos cargar la configuración</h2>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && institucion && (
            <section className="max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200">
              <header className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-800">Notificaciones</h2>
                <p className="text-sm text-slate-500">
                  Controla qué alertas recibirán los administradores registrados.
                </p>
              </header>
              <div className="px-6 py-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Recordatorios automáticos</p>
                    <span className="text-sm text-slate-500">
                      Recibir avisos sobre tareas y eventos próximos.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTogglePreference('recordatorios')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.recordatorios ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.recordatorios ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Alertas por correo</p>
                    <span className="text-sm text-slate-500">
                      Notificar por email las novedades y publicaciones relevantes.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTogglePreference('alertasEmail')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.alertasEmail ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.alertasEmail ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Alertas SMS</p>
                    <span className="text-sm text-slate-500">
                      Recibir confirmaciones y recordatorios por mensajes de texto.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTogglePreference('alertasSms')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.alertasSms ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.alertasSms ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="w-full mt-6 inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Guardar preferencias
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
      <Footer />
    </InstitucionAuthGuard>
  );
}

