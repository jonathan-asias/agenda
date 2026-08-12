'use client';

import { useMemo, useState } from 'react';
import type { Recordatorio } from '@/types/recordatorio';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { downloadAutorizacionConsolidadoExcel } from '@/lib/recordatorios/autorizacion-excel';
import { showError, showSuccess } from '@/lib/notifications';

interface ViewRecordatorioModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordatorio: Recordatorio | null;
}

function formatFechaLarga(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Bogota',
  });
}

function formatFechaHora(iso: string): string {
  return new Date(iso).toLocaleString('es-CO', {
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
  return new Date(iso).toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Bogota',
  });
}

function formatSoloHora(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Bogota',
  });
}

function estadoAutorizacion(respuesta?: string | null): {
  label: string;
  className: string;
} {
  if (respuesta === 'autorizado') {
    return {
      label: 'Autorizó',
      className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };
  }
  if (respuesta === 'no_autorizado') {
    return {
      label: 'No autorizó',
      className: 'bg-red-100 text-red-800 border-red-200',
    };
  }
  return {
    label: 'Pendiente',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  };
}

export default function ViewRecordatorioModal({
  isOpen,
  onClose,
  recordatorio,
}: ViewRecordatorioModalProps) {
  const [showAutorizaciones, setShowAutorizaciones] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const resumen = useMemo(() => {
    const lista = recordatorio?.estudiantes ?? [];
    let autorizaron = 0;
    let noAutorizaron = 0;
    let pendientes = 0;
    for (const item of lista) {
      if (item.autorizacion_respuesta === 'autorizado') autorizaron += 1;
      else if (item.autorizacion_respuesta === 'no_autorizado') noAutorizaron += 1;
      else pendientes += 1;
    }
    return { autorizaron, noAutorizaron, pendientes, total: lista.length };
  }, [recordatorio?.estudiantes]);

  if (!recordatorio) return null;

  const fechaRecordatorio = new Date(recordatorio.fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const esPasado = fechaRecordatorio < hoy;
  const esHoy = fechaRecordatorio.toDateString() === hoy.toDateString();
  const esAutorizacion = recordatorio.tipo === 'autorizacion';

  const tipoColors = {
    tarea: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    examen: 'bg-red-100 text-red-800 border-red-200',
    evento: 'bg-blue-100 text-blue-800 border-blue-200',
    autorizacion: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    otro: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  const tipoLabels = {
    tarea: 'Tarea',
    examen: 'Examen',
    evento: 'Evento',
    autorizacion: 'Autorización',
    otro: 'Otro',
  };

  const handleClose = () => {
    setShowAutorizaciones(false);
    onClose();
  };

  const handleDescargarConsolidado = () => {
    try {
      setDownloadingExcel(true);
      downloadAutorizacionConsolidadoExcel(recordatorio);
      void showSuccess('Consolidado descargado', 'El archivo Excel se generó correctamente.');
    } catch (err) {
      console.error('Error generando consolidado:', err);
      void showError('No se pudo descargar', 'Intenta de nuevo en unos segundos.');
    } finally {
      setDownloadingExcel(false);
    }
  };

  return (
    <>
      <Modal
        open={isOpen}
        onClose={handleClose}
        title="Información del recordatorio"
        size="xl"
        className="max-w-3xl"
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-xl font-bold text-slate-900">{recordatorio.nombre}</h3>
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
          </div>

          {recordatorio.docente && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Docente</label>
              <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
                <p className="font-medium text-slate-900">
                  {recordatorio.docente.nombres} {recordatorio.docente.apellidos}
                </p>
                <p className="text-sm text-slate-600 mt-1">{recordatorio.docente.email}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              {esAutorizacion ? 'Descripción de la autorización' : 'Descripción'}
            </label>
            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
              <p className="text-slate-800 whitespace-pre-wrap">{recordatorio.descripcion}</p>
            </div>
          </div>

          {esAutorizacion ? (
            <div className="space-y-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-4">
              {recordatorio.evento_nombre ? (
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-emerald-900">Evento</label>
                  <p className="text-slate-800 text-sm">{recordatorio.evento_nombre}</p>
                </div>
              ) : null}
              {recordatorio.lugar_evento ? (
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-emerald-900">Lugar</label>
                  <p className="text-slate-800 text-sm">{recordatorio.lugar_evento}</p>
                </div>
              ) : null}
              {recordatorio.fecha_evento ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-emerald-900">
                      Fecha del evento
                    </label>
                    <p className="text-slate-800 text-sm capitalize">
                      {formatSoloFecha(recordatorio.fecha_evento)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-emerald-900">
                      Hora de inicio
                    </label>
                    <p className="text-slate-800 text-sm">
                      {formatSoloHora(recordatorio.fecha_evento)}
                    </p>
                  </div>
                  {recordatorio.hora_fin ? (
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-emerald-900">
                        Hora de fin
                      </label>
                      <p className="text-slate-800 text-sm">
                        {formatSoloHora(recordatorio.hora_fin)}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}
              {recordatorio.hora_llegada ? (
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-emerald-900">
                    Hora de llegada
                  </label>
                  <p className="text-slate-800 text-sm">
                    {formatSoloHora(recordatorio.hora_llegada)}
                  </p>
                </div>
              ) : null}

              <div className="rounded-lg border border-emerald-200 bg-white/70 px-3 py-2 text-sm text-emerald-900">
                <span className="font-semibold">{resumen.autorizaron}</span> autorizaron ·{' '}
                <span className="font-semibold">{resumen.noAutorizaron}</span> no autorizaron ·{' '}
                <span className="font-semibold">{resumen.pendientes}</span> pendientes
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowAutorizaciones(true)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 active:scale-[0.98]"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  Ver autorizaciones
                </button>

                <button
                  type="button"
                  disabled={downloadingExcel || resumen.total === 0}
                  onClick={handleDescargarConsolidado}
                  title={
                    resumen.total === 0
                      ? 'No hay estudiantes para generar el consolidado'
                      : 'Descargar Excel con el consolidado de autorizaciones'
                  }
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-indigo-300 bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-800 shadow-sm transition hover:border-indigo-400 hover:bg-indigo-100 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {downloadingExcel ? 'Generando…' : 'Descargar consolidado'}
                </button>
              </div>
            </div>
          ) : null}

          {recordatorio.modo_envio && recordatorio.modo_envio.trim() !== '' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Modo de envío</label>
              <div className="flex flex-wrap gap-2">
                {recordatorio.modo_envio.split(',').map((modo) => {
                  const m = modo.trim().toLowerCase();
                  const labels: Record<string, string> = {
                    sms: 'SMS',
                    whatsapp: 'WhatsApp',
                    email: 'Email',
                  };
                  const label = labels[m] || m;
                  const colors: Record<string, string> = {
                    sms: 'bg-slate-100 text-slate-800 border-slate-200',
                    whatsapp: 'bg-green-100 text-green-800 border-green-200',
                    email: 'bg-blue-100 text-blue-800 border-blue-200',
                  };
                  return (
                    <span
                      key={modo}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                        colors[m] || 'bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              {esAutorizacion ? 'Fecha de vencimiento' : 'Fecha del Recordatorio'}
            </label>
            <div className="flex items-center text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
              <svg
                className="w-5 h-5 mr-3 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="font-medium capitalize">
                {esAutorizacion
                  ? formatFechaHora(recordatorio.fecha)
                  : formatFechaLarga(recordatorio.fecha)}
              </span>
            </div>
          </div>

          {(recordatorio.area || recordatorio.materia || recordatorio.grado || recordatorio.curso) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recordatorio.area && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Área</label>
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
                    <span className="font-medium">{recordatorio.area.nombre}</span>
                  </div>
                </div>
              )}
              {recordatorio.materia && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Materia</label>
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
                    <span className="font-medium">{recordatorio.materia.nombre}</span>
                  </div>
                </div>
              )}
              {recordatorio.grado && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Grado</label>
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
                    <span className="font-medium">{recordatorio.grado.nombre}</span>
                  </div>
                </div>
              )}
              {recordatorio.curso && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Curso</label>
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
                    <span className="font-medium">{recordatorio.curso.nombre}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recordatorio.created_at && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Fecha de Creación
                </label>
                <div className="flex items-center text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
                  <span className="font-medium">
                    {new Date(recordatorio.created_at).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            )}
            {recordatorio.updated_at &&
              recordatorio.updated_at !== recordatorio.created_at && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Última Modificación
                  </label>
                  <div className="flex items-center text-slate-800 bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <span className="font-medium text-green-900">
                      {new Date(recordatorio.updated_at).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Estudiantes Asignados ({recordatorio.estudiantes?.length ?? 0})
            </label>
            {recordatorio.estudiantes && recordatorio.estudiantes.length > 0 ? (
              <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 max-h-64 overflow-y-auto">
                <div className="grid grid-cols-1 gap-2">
                  {recordatorio.estudiantes.map((est, idx) => (
                    <div
                      key={est.estudiante.id ?? idx}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {est.estudiante.nombres} {est.estudiante.apellidos}
                        </p>
                        {est.estudiante.codigo_estudiantil && (
                          <p className="text-sm text-slate-500">
                            Código: {est.estudiante.codigo_estudiantil}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-center">
                <p className="text-slate-600">
                  No hay estudiantes asignados a este recordatorio
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-[var(--color-border-light)]">
          <Button type="button" variant="primary" fullWidth onClick={handleClose}>
            Cerrar
          </Button>
        </div>
      </Modal>

      <Modal
        open={isOpen && showAutorizaciones}
        onClose={() => setShowAutorizaciones(false)}
        title="Autorizaciones"
        size="xl"
        className="max-w-4xl"
        zIndex={130}
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              <span className="font-semibold">{resumen.autorizaron}</span> autorizaron ·{' '}
              <span className="font-semibold">{resumen.noAutorizaron}</span> no autorizaron ·{' '}
              <span className="font-semibold">{resumen.pendientes}</span> pendientes
              {resumen.total > 0 ? ` · ${resumen.total} en total` : ''}
            </div>

            <button
              type="button"
              disabled={downloadingExcel || resumen.total === 0}
              onClick={handleDescargarConsolidado}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-indigo-300 bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-800 shadow-sm transition hover:border-indigo-400 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              {downloadingExcel ? 'Generando…' : 'Descargar consolidado'}
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Estudiante
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Código</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Estado</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Respondido el
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {(recordatorio.estudiantes ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                      No hay estudiantes asociados a esta autorización.
                    </td>
                  </tr>
                ) : (
                  [...(recordatorio.estudiantes ?? [])]
                    .sort((a, b) => {
                      const an = `${a.estudiante.apellidos} ${a.estudiante.nombres}`.toLowerCase();
                      const bn = `${b.estudiante.apellidos} ${b.estudiante.nombres}`.toLowerCase();
                      return an.localeCompare(bn, 'es');
                    })
                    .map((item) => {
                      const estado = estadoAutorizacion(item.autorizacion_respuesta);
                      return (
                        <tr key={item.estudiante.id}>
                          <td className="px-4 py-3 text-slate-900">
                            {item.estudiante.nombres} {item.estudiante.apellidos}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {item.estudiante.codigo_estudiantil || '—'}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${estado.className}`}
                            >
                              {estado.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {item.autorizacion_respondido_at
                              ? new Date(item.autorizacion_respondido_at).toLocaleString(
                                  'es-CO',
                                  {
                                    dateStyle: 'medium',
                                    timeStyle: 'short',
                                  }
                                )
                              : '—'}
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>

          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={() => setShowAutorizaciones(false)}
          >
            Cerrar
          </Button>
        </div>
      </Modal>
    </>
  );
}
