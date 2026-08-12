'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Button, Card, Input, ErrorBanner, LoaderPage, EmptyState, TurnstileField, isTurnstileVerified } from '@/components/ui';
import {
  RECORDATORIO_TIPO_COLORS,
  RECORDATORIO_TIPO_LABELS,
  type AutorizacionRespuesta,
} from '@/lib/recordatorios/tipos';

type RecordatorioPublico = {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  tipo: string;
  motivo?: string | null;
  evento_nombre?: string | null;
  fecha_evento?: string | null;
  lugar_evento?: string | null;
  hora_fin?: string | null;
  hora_llegada?: string | null;
  autorizacion_respuesta?: string | null;
  materia: string;
  area: string;
  grado: string;
  curso: string;
  docente: string;
};

type EstudianteResumen = {
  nombres: string;
  apellidos: string;
  codigo_estudiantil: string;
  institucion: string;
};

function hoyISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatFechaLarga(iso: string): string {
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

export default function ConsultarRecordatoriosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
          <LoaderPage message="Cargando consulta..." />
        </div>
      }
    >
      <ConsultarRecordatoriosContent />
    </Suspense>
  );
}

function ConsultarRecordatoriosContent() {
  const searchParams = useSearchParams();
  const [identificador, setIdentificador] = useState('');
  const [fecha, setFecha] = useState(hoyISO());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [estudiante, setEstudiante] = useState<EstudianteResumen | null>(null);
  const [recordatorios, setRecordatorios] = useState<RecordatorioPublico[] | null>(null);
  const [consultado, setConsultado] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const [respuestasLocales, setRespuestasLocales] = useState<
    Record<number, AutorizacionRespuesta | ''>
  >({});
  const [guardandoId, setGuardandoId] = useState<number | null>(null);
  const [authMsg, setAuthMsg] = useState<Record<number, string>>({});

  useEffect(() => {
    const fechaParam = searchParams.get('fecha');
    if (fechaParam && /^\d{4}-\d{2}-\d{2}$/.test(fechaParam)) {
      setFecha(fechaParam);
    }
    const codigoParam = searchParams.get('codigo');
    if (codigoParam?.trim()) {
      setIdentificador(codigoParam.trim());
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMensaje('');
    setEstudiante(null);
    setRecordatorios(null);
    setConsultado(false);
    setRespuestasLocales({});
    setAuthMsg({});

    if (!isTurnstileVerified(turnstileToken)) {
      setError('Debes completar la verificación de seguridad');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/recordatorios/consultar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identificador: identificador.trim(),
          fecha,
          turnstileToken,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'No se pudo consultar. Intenta de nuevo.');
        setCaptchaResetKey((k) => k + 1);
        setTurnstileToken(null);
        return;
      }

      const lista: RecordatorioPublico[] = Array.isArray(data.recordatorios)
        ? data.recordatorios
        : [];
      setConsultado(true);
      setEstudiante(data.estudiante ?? null);
      setRecordatorios(lista);
      setMensaje(typeof data.mensaje === 'string' ? data.mensaje : '');
      const iniciales: Record<number, AutorizacionRespuesta | ''> = {};
      for (const r of lista) {
        if (r.tipo === 'autorizacion') {
          iniciales[r.id] =
            r.autorizacion_respuesta === 'autorizado' ||
            r.autorizacion_respuesta === 'no_autorizado'
              ? r.autorizacion_respuesta
              : '';
        }
      }
      setRespuestasLocales(iniciales);
      setCaptchaResetKey((k) => k + 1);
      setTurnstileToken(null);
    } catch {
      setError('Error de conexión. Verifica tu internet e intenta de nuevo.');
      setCaptchaResetKey((k) => k + 1);
      setTurnstileToken(null);
    } finally {
      setLoading(false);
    }
  };

  const guardarAutorizacion = async (recordatorioId: number) => {
    const respuesta = respuestasLocales[recordatorioId];
    if (!respuesta) {
      setAuthMsg((prev) => ({
        ...prev,
        [recordatorioId]: 'Selecciona Se autorizó o No autorizó.',
      }));
      return;
    }
    if (!isTurnstileVerified(turnstileToken)) {
      setAuthMsg((prev) => ({
        ...prev,
        [recordatorioId]: 'Completa la verificación de seguridad y vuelve a intentar.',
      }));
      return;
    }

    setGuardandoId(recordatorioId);
    setAuthMsg((prev) => ({ ...prev, [recordatorioId]: '' }));
    try {
      const res = await fetch('/api/recordatorios/consultar/autorizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identificador: identificador.trim(),
          fecha,
          recordatorioId,
          respuesta,
          turnstileToken,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAuthMsg((prev) => ({
          ...prev,
          [recordatorioId]: data.error || 'No se pudo guardar la respuesta.',
        }));
        setCaptchaResetKey((k) => k + 1);
        setTurnstileToken(null);
        return;
      }
      setRecordatorios((prev) =>
        prev
          ? prev.map((r) =>
              r.id === recordatorioId
                ? { ...r, autorizacion_respuesta: respuesta }
                : r
            )
          : prev
      );
      setAuthMsg((prev) => ({
        ...prev,
        [recordatorioId]: 'Respuesta registrada correctamente.',
      }));
      setCaptchaResetKey((k) => k + 1);
      setTurnstileToken(null);
    } catch {
      setAuthMsg((prev) => ({
        ...prev,
        [recordatorioId]: 'Error de conexión al guardar la respuesta.',
      }));
      setCaptchaResetKey((k) => k + 1);
      setTurnstileToken(null);
    } finally {
      setGuardandoId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      <Header />
      <main className="flex-1 px-4 py-10 sm:px-6">
        <div className="mx-auto w-full max-w-xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Consultar recordatorios
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Ingresa el nombre completo o el código del estudiante y la fecha para ver sus
              recordatorios.
            </p>
          </div>

          <Card padding="lg" className="sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <ErrorBanner title="No se pudo consultar" message={error} />}

              <Input
                label="Nombre completo o código estudiantil"
                name="identificador"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                placeholder="Ej. Ana María López o 2024001"
                required
                autoComplete="off"
                disabled={loading}
                hint="Puedes usar el nombre completo (nombres y apellidos) o el código del estudiante."
              />

              <Input
                label="Fecha del recordatorio"
                name="fecha"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
                disabled={loading}
              />

              <TurnstileField
                resetKey={captchaResetKey}
                onChange={setTurnstileToken}
              />

              {!isTurnstileVerified(turnstileToken) && (
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  Marca la casilla &quot;No soy un robot&quot; para continuar.
                </p>
              )}

              <Button
                type="submit"
                fullWidth
                disabled={loading || !isTurnstileVerified(turnstileToken)}
              >
                {loading ? 'Consultando...' : 'Consultar'}
              </Button>
            </form>
          </Card>

          {consultado && (
            <div className="space-y-4">
              {estudiante && (
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">
                    {estudiante.nombres} {estudiante.apellidos}
                  </p>
                  <p className="text-slate-500">
                    Código {estudiante.codigo_estudiantil}
                    {estudiante.institucion ? ` · ${estudiante.institucion}` : ''}
                  </p>
                </div>
              )}

              {recordatorios && recordatorios.length === 0 ? (
                <EmptyState
                  title="Sin recordatorios"
                  description={
                    mensaje ||
                    'No hay recordatorios para este estudiante en la fecha indicada.'
                  }
                />
              ) : (
                <ul className="space-y-3">
                  {recordatorios?.map((r) => {
                    const esAutorizacion = r.tipo === 'autorizacion';
                    return (
                      <li
                        key={r.id}
                        className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm"
                      >
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h2 className="text-lg font-semibold text-slate-900">{r.nombre}</h2>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              RECORDATORIO_TIPO_COLORS[
                                r.tipo as keyof typeof RECORDATORIO_TIPO_COLORS
                              ] || RECORDATORIO_TIPO_COLORS.otro
                            }`}
                          >
                            {RECORDATORIO_TIPO_LABELS[
                              r.tipo as keyof typeof RECORDATORIO_TIPO_LABELS
                            ] || 'Otro'}
                          </span>
                        </div>
                        <p className="text-slate-600 whitespace-pre-wrap text-sm leading-relaxed">
                          {r.descripcion}
                        </p>
                        <dl className="mt-4 grid gap-1 text-sm text-slate-500">
                          <div>
                            <dt className="inline font-medium text-slate-700">
                              {esAutorizacion ? 'Vence: ' : 'Fecha: '}
                            </dt>
                            <dd className="inline capitalize">
                              {esAutorizacion
                                ? formatFechaHora(r.fecha)
                                : formatFechaLarga(r.fecha)}
                            </dd>
                          </div>
                          {esAutorizacion && r.evento_nombre ? (
                            <div>
                              <dt className="inline font-medium text-slate-700">Evento: </dt>
                              <dd className="inline">{r.evento_nombre}</dd>
                            </div>
                          ) : null}
                          {esAutorizacion && r.lugar_evento ? (
                            <div>
                              <dt className="inline font-medium text-slate-700">Lugar: </dt>
                              <dd className="inline">{r.lugar_evento}</dd>
                            </div>
                          ) : null}
                          {esAutorizacion && r.fecha_evento ? (
                            <div>
                              <dt className="inline font-medium text-slate-700">
                                Fecha del evento:{' '}
                              </dt>
                              <dd className="inline capitalize">
                                {formatSoloFecha(r.fecha_evento)}
                              </dd>
                            </div>
                          ) : null}
                          {esAutorizacion && r.fecha_evento ? (
                            <div>
                              <dt className="inline font-medium text-slate-700">
                                Hora de inicio:{' '}
                              </dt>
                              <dd className="inline">{formatSoloHora(r.fecha_evento)}</dd>
                              {r.hora_fin ? (
                                <>
                                  <span className="mx-1 text-slate-400">·</span>
                                  <dt className="inline font-medium text-slate-700">
                                    Hora de fin:{' '}
                                  </dt>
                                  <dd className="inline">{formatSoloHora(r.hora_fin)}</dd>
                                </>
                              ) : null}
                            </div>
                          ) : null}
                          {esAutorizacion && r.hora_llegada ? (
                            <div>
                              <dt className="inline font-medium text-slate-700">
                                Hora de llegada:{' '}
                              </dt>
                              <dd className="inline">{formatSoloHora(r.hora_llegada)}</dd>
                            </div>
                          ) : null}
                          <div>
                            <dt className="inline font-medium text-slate-700">Materia: </dt>
                            <dd className="inline">
                              {r.materia}
                              {r.area ? ` (${r.area})` : ''}
                            </dd>
                          </div>
                          <div>
                            <dt className="inline font-medium text-slate-700">Curso: </dt>
                            <dd className="inline">
                              {r.grado} · {r.curso}
                            </dd>
                          </div>
                          <div>
                            <dt className="inline font-medium text-slate-700">Docente: </dt>
                            <dd className="inline">{r.docente}</dd>
                          </div>
                        </dl>

                        {esAutorizacion ? (
                          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-3">
                            <p className="text-sm font-semibold text-emerald-900">
                              Tu respuesta de autorización
                            </p>
                            <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                              <label className="inline-flex items-center gap-2 text-sm text-slate-800 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`autorizacion-${r.id}`}
                                  value="autorizado"
                                  checked={respuestasLocales[r.id] === 'autorizado'}
                                  onChange={() =>
                                    setRespuestasLocales((prev) => ({
                                      ...prev,
                                      [r.id]: 'autorizado',
                                    }))
                                  }
                                  className="h-4 w-4 text-emerald-600"
                                />
                                Se autorizó
                              </label>
                              <label className="inline-flex items-center gap-2 text-sm text-slate-800 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`autorizacion-${r.id}`}
                                  value="no_autorizado"
                                  checked={respuestasLocales[r.id] === 'no_autorizado'}
                                  onChange={() =>
                                    setRespuestasLocales((prev) => ({
                                      ...prev,
                                      [r.id]: 'no_autorizado',
                                    }))
                                  }
                                  className="h-4 w-4 text-emerald-600"
                                />
                                No autorizó
                              </label>
                            </div>
                            {authMsg[r.id] ? (
                              <p
                                className={`text-sm ${
                                  authMsg[r.id].includes('correctamente')
                                    ? 'text-emerald-700'
                                    : 'text-red-600'
                                }`}
                              >
                                {authMsg[r.id]}
                              </p>
                            ) : null}
                            <Button
                              type="button"
                              size="sm"
                              disabled={guardandoId === r.id}
                              onClick={() => void guardarAutorizacion(r.id)}
                            >
                              {guardandoId === r.id
                                ? 'Guardando...'
                                : r.autorizacion_respuesta
                                  ? 'Actualizar respuesta'
                                  : 'Guardar respuesta'}
                            </Button>
                            <p className="text-xs text-slate-500">
                              Completa de nuevo la verificación de seguridad arriba si se
                              reinició, y luego guarda tu respuesta.
                            </p>
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          <p className="text-center text-sm text-slate-500">
            ¿Quieres recibir avisos en el celular?{' '}
            <Link href="/activar-notificaciones" className="text-blue-700 hover:underline">
              Activa las notificaciones
            </Link>{' '}
            desde el enlace del correo.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
