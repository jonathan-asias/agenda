'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Button, ErrorBanner, LoaderPage, Modal } from '@/components/ui';
import { showConfirm } from '@/lib/notifications';
import type { AutorizacionRespuesta } from '@/lib/recordatorios/tipos';

type AutorizacionDetalle = {
  recordatorioId: number;
  nombre: string;
  descripcion: string;
  fechaVencimiento: string;
  motivo: string | null;
  eventoNombre: string | null;
  fechaEvento: string | null;
  lugarEvento: string | null;
  horaFin: string | null;
  horaLlegada: string | null;
  materia: string;
  area: string;
  grado: string;
  curso: string;
  docente: string;
  institucion: string;
  estudiante: {
    id: number;
    nombres: string;
    apellidos: string;
    codigoEstudiantil: string;
  };
  respuestaActual: string | null;
  respondidoAt: string | null;
};

function formatFechaHora(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Bogota',
  });
}

function formatSoloFecha(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Bogota',
  });
}

function formatSoloHora(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Bogota',
  });
}

function DetailRow({
  icon,
  label,
  children,
  tone = 'slate',
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  tone?: 'blue' | 'rose' | 'amber' | 'indigo' | 'orange' | 'teal' | 'slate';
}) {
  const toneClasses = {
    blue: 'bg-blue-100 text-blue-700',
    rose: 'bg-rose-100 text-rose-700',
    amber: 'bg-amber-100 text-amber-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    orange: 'bg-orange-100 text-orange-700',
    teal: 'bg-teal-100 text-teal-700',
    slate: 'bg-slate-100 text-slate-700',
  } as const;

  return (
    <div className="flex gap-3 rounded-xl border border-slate-100 bg-white px-3.5 py-3">
      <span
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${toneClasses[tone]}`}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <div className="mt-0.5 text-sm font-medium text-slate-900 capitalize">{children}</div>
      </div>
    </div>
  );
}

export default function AutorizarRecordatorioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
          <LoaderPage message="Cargando autorización..." />
        </div>
      }
    >
      <AutorizarRecordatorioContent />
    </Suspense>
  );
}

function AutorizarRecordatorioContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token')?.trim() || '';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [expiredInfo, setExpiredInfo] = useState<{
    fechaVencimiento: string;
    nombre: string | null;
    eventoNombre: string | null;
    institucion: string | null;
    estudiante: {
      nombres: string;
      apellidos: string;
      codigoEstudiantil: string;
    } | null;
  } | null>(null);
  const [detalle, setDetalle] = useState<AutorizacionDetalle | null>(null);
  const [respuesta, setRespuesta] = useState<AutorizacionRespuesta | ''>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const yaRespondido = Boolean(detalle?.respuestaActual);

  useEffect(() => {
    if (!token) {
      setError('Falta el enlace de autorización. Abre el botón del correo.');
      setLoading(false);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      setExpiredInfo(null);
      try {
        const res = await fetch(
          `/api/recordatorios/autorizar?token=${encodeURIComponent(token)}`
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (!cancelled) {
            if (res.status === 410 || data.reason === 'expired') {
              setExpiredInfo({
                fechaVencimiento: data.fechaVencimiento || '',
                nombre: data.nombre ?? null,
                eventoNombre: data.eventoNombre ?? null,
                institucion: data.institucion ?? null,
                estudiante: data.estudiante ?? null,
              });
              setError('');
              setDetalle(null);
            } else {
              setError(data.error || 'No se pudo cargar la autorización.');
              setDetalle(null);
              setExpiredInfo(null);
            }
          }
          return;
        }
        if (!cancelled) {
          const auth = data.autorizacion as AutorizacionDetalle;
          setDetalle(auth);
          setRespuesta(
            auth.respuestaActual === 'autorizado' ||
              auth.respuestaActual === 'no_autorizado'
              ? auth.respuestaActual
              : ''
          );
        }
      } catch {
        if (!cancelled) setError('Error de conexión. Intenta de nuevo.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const enviarRespuesta = async (valor: AutorizacionRespuesta) => {
    if (!token) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/recordatorios/autorizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, respuesta: valor }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 410 || data.reason === 'expired') {
          setExpiredInfo({
            fechaVencimiento: data.fechaVencimiento || detalle?.fechaVencimiento || '',
            nombre: data.nombre ?? detalle?.nombre ?? null,
            eventoNombre: data.eventoNombre ?? detalle?.eventoNombre ?? null,
            institucion: data.institucion ?? detalle?.institucion ?? null,
            estudiante: data.estudiante ?? (detalle
              ? {
                  nombres: detalle.estudiante.nombres,
                  apellidos: detalle.estudiante.apellidos,
                  codigoEstudiantil: detalle.estudiante.codigoEstudiantil,
                }
              : null),
          });
          setDetalle(null);
          setError('');
          return;
        }
        setError(data.error || 'No se pudo guardar la respuesta.');
        return;
      }
      const auth = data.autorizacion as AutorizacionDetalle;
      setDetalle(auth);
      setRespuesta(
        auth.respuestaActual === 'autorizado' ||
          auth.respuestaActual === 'no_autorizado'
          ? auth.respuestaActual
          : valor
      );
      setShowSuccessModal(true);
    } catch {
      setError('Error de conexión al guardar la respuesta.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !respuesta || yaRespondido) {
      if (!respuesta) setError('Selecciona si autorizas o no.');
      return;
    }

    const esAutorizado = respuesta === 'autorizado';
    const confirmed = await showConfirm({
      title: esAutorizado ? '¿Confirmas que autorizas?' : '¿Confirmas que no autorizas?',
      text: esAutorizado
        ? 'Vas a registrar que SÍ autorizas. Esta respuesta no se podrá cambiar después.'
        : 'Vas a registrar que NO autorizas. Esta respuesta no se podrá cambiar después.',
      confirmButtonText: esAutorizado ? 'Sí, autorizo' : 'Sí, no autorizo',
      cancelButtonText: 'Revisar de nuevo',
      icon: 'warning',
      confirmButtonColor: esAutorizado ? '#059669' : '#dc2626',
    });

    if (!confirmed) return;
    await enviarRespuesta(respuesta);
  };

  const estudianteNombre = detalle
    ? `${detalle.estudiante.nombres} ${detalle.estudiante.apellidos}`.trim()
    : '';

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-emerald-50/40 to-slate-100">
      <Header />
      <main className="relative flex-1 overflow-hidden px-4 py-8 sm:px-6 sm:py-12">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.12),_transparent_60%)]"
          aria-hidden
        />

        <div className="relative mx-auto w-full max-w-2xl space-y-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Autorización escolar
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Respuesta del acudiente
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 sm:text-base">
              Revisa los datos del evento y confirma si autorizas la participación del estudiante.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-10 shadow-sm backdrop-blur">
              <LoaderPage message="Cargando autorización..." />
            </div>
          ) : expiredInfo ? (
            <div className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-lg shadow-amber-100/60">
              <div className="border-b border-amber-100 bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-5 text-white sm:px-7">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-100">
                  {expiredInfo.institucion || 'Autorización escolar'}
                </p>
                <h2 className="mt-1 text-xl font-bold leading-snug sm:text-2xl">
                  Autorización ya no válida
                </h2>
              </div>

              <div className="space-y-5 px-5 py-6 sm:px-7 sm:py-7">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                <div className="text-center sm:text-left">
                  <p className="text-base font-semibold text-slate-900">
                    Se superó la hora límite para responder
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Esta autorización ya no es válida porque el plazo para que el acudiente
                    responda venció. Por seguridad, el enlace del correo deja de funcionar
                    exactamente en esa hora límite.
                  </p>
                </div>

                <div className="space-y-2.5 rounded-xl border border-amber-100 bg-amber-50/70 p-4">
                  {expiredInfo.nombre ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                        Autorización
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-slate-900">{expiredInfo.nombre}</p>
                    </div>
                  ) : null}
                  {expiredInfo.eventoNombre ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                        Evento
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-slate-900">
                        {expiredInfo.eventoNombre}
                      </p>
                    </div>
                  ) : null}
                  {expiredInfo.estudiante ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                        Estudiante
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-slate-900">
                        {expiredInfo.estudiante.nombres} {expiredInfo.estudiante.apellidos}
                        {expiredInfo.estudiante.codigoEstudiantil
                          ? ` · ${expiredInfo.estudiante.codigoEstudiantil}`
                          : ''}
                      </p>
                    </div>
                  ) : null}
                  {expiredInfo.fechaVencimiento ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                        Hora límite de respuesta
                      </p>
                      <p className="mt-0.5 text-sm font-semibold capitalize text-amber-950">
                        {formatFechaHora(expiredInfo.fechaVencimiento)}
                      </p>
                    </div>
                  ) : null}
                </div>

                <p className="text-sm text-slate-600">
                  Si necesitas más información, contacta a la institución o consulta los
                  recordatorios del estudiante.
                </p>

                <Link
                  href="/consultar-recordatorios"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Ir a consultar recordatorios
                </Link>
              </div>
            </div>
          ) : error && !detalle ? (
            <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
              <ErrorBanner title="No se pudo abrir" message={error} />
              <p className="text-sm text-slate-600">
                También puedes consultar recordatorios con el nombre o código del estudiante.
              </p>
              <Link
                href="/consultar-recordatorios"
                className="inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                Ir a consultar recordatorios
              </Link>
            </div>
          ) : detalle ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/50">
              <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-5 text-white sm:px-7">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-100">
                  {detalle.institucion || 'Institución'}
                </p>
                <h2 className="mt-1 text-xl font-bold leading-snug sm:text-2xl">{detalle.nombre}</h2>
                <p className="mt-2 text-sm text-emerald-50/95">
                  {detalle.materia}
                  {detalle.area ? ` · ${detalle.area}` : ''}
                </p>
              </div>

              <div className="space-y-6 px-5 py-6 sm:px-7 sm:py-7">
                <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
                    {detalle.estudiante.nombres.charAt(0)}
                    {detalle.estudiante.apellidos.charAt(0)}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Estudiante
                    </p>
                    <p className="text-base font-semibold text-slate-900">{estudianteNombre}</p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      Código {detalle.estudiante.codigoEstudiantil}
                      {' · '}
                      {detalle.grado} · {detalle.curso}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Descripción
                  </p>
                  <p className="whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm leading-relaxed text-slate-700">
                    {detalle.descripcion}
                  </p>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  {detalle.eventoNombre ? (
                    <DetailRow
                      label="Evento"
                      tone="blue"
                      icon={
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      }
                    >
                      {detalle.eventoNombre}
                    </DetailRow>
                  ) : null}
                  {detalle.lugarEvento ? (
                    <DetailRow
                      label="Lugar"
                      tone="rose"
                      icon={
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      }
                    >
                      <span className="normal-case">{detalle.lugarEvento}</span>
                    </DetailRow>
                  ) : null}
                  {detalle.fechaEvento ? (
                    <DetailRow
                      label="Fecha del evento"
                      tone="amber"
                      icon={
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      }
                    >
                      {formatSoloFecha(detalle.fechaEvento)}
                    </DetailRow>
                  ) : null}
                  {detalle.fechaEvento ? (
                    <DetailRow
                      label="Horario"
                      tone="indigo"
                      icon={
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      }
                    >
                      <span className="normal-case">
                        {formatSoloHora(detalle.fechaEvento)}
                        {detalle.horaFin ? ` – ${formatSoloHora(detalle.horaFin)}` : ''}
                      </span>
                    </DetailRow>
                  ) : null}
                  <DetailRow
                    label="Vence la autorización"
                    tone="orange"
                    icon={
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                        />
                      </svg>
                    }
                  >
                    {formatFechaHora(detalle.fechaVencimiento)}
                  </DetailRow>
                  <DetailRow
                    label="Docente"
                    tone="teal"
                    icon={
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    }
                  >
                    <span className="normal-case">{detalle.docente}</span>
                  </DetailRow>
                </div>

                {yaRespondido ? (
                  <div
                    className={`rounded-xl border px-4 py-4 ${
                      detalle.respuestaActual === 'autorizado'
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-rose-200 bg-rose-50'
                    }`}
                  >
                    <p
                      className={`text-sm font-semibold ${
                        detalle.respuestaActual === 'autorizado'
                          ? 'text-emerald-900'
                          : 'text-rose-900'
                      }`}
                    >
                      {detalle.respuestaActual === 'autorizado'
                        ? 'Respuesta registrada: se autorizó'
                        : 'Respuesta registrada: no autorizó'}
                    </p>
                    {detalle.respondidoAt ? (
                      <p
                        className={`mt-1 text-xs capitalize ${
                          detalle.respuestaActual === 'autorizado'
                            ? 'text-emerald-700'
                            : 'text-rose-700'
                        }`}
                      >
                        Enviada el {formatFechaHora(detalle.respondidoAt)}
                      </p>
                    ) : null}
                    <p
                      className={`mt-2 text-xs ${
                        detalle.respuestaActual === 'autorizado'
                          ? 'text-emerald-700'
                          : 'text-rose-700'
                      }`}
                    >
                      Esta respuesta es definitiva y no se puede modificar.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 border-t border-slate-100 pt-5">
                    {error ? <ErrorBanner title="No se pudo guardar" message={error} /> : null}

                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                      <p className="text-sm font-medium text-amber-900">
                        Tu respuesta no se podrá cambiar después de enviarla.
                      </p>
                      <p className="mt-1 text-xs text-amber-800">
                        Revisa bien los datos antes de confirmar.
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-slate-900">¿Autorizas la participación?</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => {
                          setRespuesta('autorizado');
                          setError('');
                        }}
                        className={`rounded-xl border-2 px-4 py-4 text-left transition ${
                          respuesta === 'autorizado'
                            ? 'border-emerald-500 bg-emerald-50 shadow-sm ring-1 ring-emerald-200'
                            : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              respuesta === 'autorizado'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-slate-900">Sí, autorizo</span>
                            <span className="mt-0.5 block text-xs text-slate-500">
                              El estudiante puede participar
                            </span>
                          </span>
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setRespuesta('no_autorizado');
                          setError('');
                        }}
                        className={`rounded-xl border-2 px-4 py-4 text-left transition ${
                          respuesta === 'no_autorizado'
                            ? 'border-rose-500 bg-rose-50 shadow-sm ring-1 ring-rose-200'
                            : 'border-slate-200 bg-white hover:border-rose-300 hover:bg-rose-50/40'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              respuesta === 'no_autorizado'
                                ? 'bg-rose-600 text-white'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-slate-900">No autorizo</span>
                            <span className="mt-0.5 block text-xs text-slate-500">
                              El estudiante no participará
                            </span>
                          </span>
                        </span>
                      </button>
                    </div>

                    <Button
                      type="submit"
                      fullWidth
                      size="lg"
                      disabled={saving || !respuesta}
                      className={
                        respuesta === 'no_autorizado'
                          ? '!bg-rose-600 hover:!bg-rose-700'
                          : respuesta === 'autorizado'
                            ? '!bg-emerald-600 hover:!bg-emerald-700'
                            : ''
                      }
                    >
                      {saving ? 'Enviando…' : 'Enviar respuesta'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />

      <Modal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Respuesta enviada"
        size="md"
        zIndex={220}
      >
        <div className="space-y-4 text-center sm:text-left">
          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full sm:mx-0 ${
              respuesta === 'autorizado' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}
          >
            {respuesta === 'autorizado' ? (
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900">
              {respuesta === 'autorizado'
                ? 'Registramos que autorizas la participación.'
                : 'Registramos que no autorizas la participación.'}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {estudianteNombre
                ? `Respuesta guardada para ${estudianteNombre}. `
                : ''}
              Esta decisión es definitiva y no se puede modificar.
            </p>
          </div>
          <Button type="button" fullWidth onClick={() => setShowSuccessModal(false)}>
            Entendido
          </Button>
        </div>
      </Modal>
    </div>
  );
}
