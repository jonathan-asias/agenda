'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

type PermissionStatus = 'default' | 'granted' | 'denied';

type PageStatus =
  | 'loading'
  | 'error'
  | 'denied'
  | 'ready'
  | 'subscribed'
  | 'activating'
  | 'disabling';

/**
 * Página de activación/desactivación de notificaciones push.
 * Futuro: activar push solo si plan === "plus"; preferencias por tipo de notificación; panel de configuración.
 */
function ActivarNotificacionesContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<PageStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [activateData, setActivateData] = useState<{
    acudienteId: number;
    institucionId: number;
    publicKey: string;
    subscribeToken: string;
  } | null>(null);

  const estudianteIdParam = searchParams.get('estudianteId');
  const sigParam = searchParams.get('sig');

  const urlBase64ToUint8Array = useCallback((base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }, []);

  const fetchActivate = useCallback(async () => {
    if (!estudianteIdParam || !sigParam) {
      setError('Enlace inválido. Use el enlace del correo de recordatorio.');
      setStatus('error');
      return;
    }

    try {
      const params = new URLSearchParams();
      params.set('estudianteId', estudianteIdParam);
      params.set('sig', sigParam);

      const res = await fetch(`/api/push/activate?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Error al validar');
        setStatus('error');
        return;
      }

      setActivateData({
        acudienteId: data.acudienteId,
        institucionId: data.institucionId,
        publicKey: data.publicKey,
        subscribeToken: data.subscribeToken,
      });

      const permission = (Notification.permission ?? 'default') as PermissionStatus;

      if (permission === 'denied') {
        setStatus('denied');
        return;
      }

      if (permission === 'granted') {
        try {
          const registration = await navigator.serviceWorker.ready;
          const existing = await registration.pushManager.getSubscription();
          if (existing) {
            setStatus('subscribed');
            return;
          }
        } catch {
          // Sin subscription activa
        }
      }

      setStatus('ready');
    } catch {
      setError('Error de conexión');
      setStatus('error');
    }
  }, [estudianteIdParam, sigParam]);

  useEffect(() => {
    fetchActivate();
  }, [fetchActivate]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  const handleActivate = async () => {
    if (!activateData) return;

    setError(null);
    setStatus('activating');
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setError('Permiso denegado. Debe permitir las notificaciones.');
        setStatus('ready');
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(activateData.publicKey) as BufferSource,
      });

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institucionId: activateData.institucionId,
          acudienteId: activateData.acudienteId,
          subscribeToken: activateData.subscribeToken,
          subscription: subscription.toJSON(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Error al guardar la suscripción');
        setStatus('ready');
        return;
      }

      setStatus('subscribed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al activar notificaciones');
      setStatus('ready');
    }
  };

  const disablePushNotifications = useCallback(async () => {
    setError(null);
    setStatus('disabling');
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        const res = await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? 'Error al desactivar');
        }
      }
      setStatus('ready');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo desactivar. Intente de nuevo.'
      );
      setStatus('subscribed');
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Notificaciones push
          </h1>
        </div>
        <p className="text-slate-600 mb-6">
          Reciba recordatorios escolares directamente en su navegador.
        </p>

        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-900 border-t-transparent" />
            <p className="text-sm text-slate-500">Verificando...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex gap-3">
            <svg className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {status === 'denied' && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-5">
            <div className="flex gap-3">
              <svg className="h-5 w-5 flex-shrink-0 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <div>
                <p className="font-semibold text-amber-900 mb-1">
                  Las notificaciones están bloqueadas en tu navegador.
                </p>
                <p className="text-sm text-amber-800 mb-4">
                  Para activarlas nuevamente debes habilitarlas manualmente desde la configuración del navegador.
                </p>
                <div className="text-xs text-amber-700 bg-amber-100/80 rounded-lg p-3">
                  <p className="font-medium mb-1">Chrome:</p>
                  <p>Configuración → Privacidad y seguridad → Configuración de sitios → Notificaciones</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {status === 'ready' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Permita las notificaciones para recibir recordatorios de tareas y eventos.
            </p>
            <button
              type="button"
              onClick={handleActivate}
              className="w-full rounded-xl bg-slate-900 px-6 py-4 font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Activar notificaciones push
            </button>
          </div>
        )}

        {status === 'activating' && (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-900 border-t-transparent" />
            <p className="text-sm text-slate-600">Activando notificaciones...</p>
          </div>
        )}

        {(status === 'subscribed' || status === 'disabling') && (
          <div className="space-y-4">
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex gap-3">
              <svg className="h-5 w-5 flex-shrink-0 text-emerald-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-emerald-800 font-medium">
                Notificaciones activadas correctamente.
              </p>
            </div>
            <button
              type="button"
              onClick={disablePushNotifications}
              disabled={status === 'disabling'}
              className="w-full rounded-xl border-2 border-slate-300 bg-white px-6 py-4 font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'disabling' ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-500 border-t-transparent" />
                  Desactivando...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Desactivar notificaciones
                </>
              )}
            </button>
          </div>
        )}

        {error && status !== 'error' && status !== 'denied' && (
          <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-4 flex gap-3">
            <svg className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ActivarNotificacionesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-900 border-t-transparent" />
            <p className="text-sm text-slate-500">Cargando...</p>
          </div>
        </div>
      }
    >
      <ActivarNotificacionesContent />
    </Suspense>
  );
}
