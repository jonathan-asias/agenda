'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Button, Card, Input, ErrorBanner, LoaderPage, EmptyState, TurnstileField, isTurnstileVerified } from '@/components/ui';

type RecordatorioPublico = {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  tipo: string;
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

const TIPO_LABELS: Record<string, string> = {
  tarea: 'Tarea',
  examen: 'Examen',
  evento: 'Evento',
  otro: 'Otro',
};

const TIPO_COLORS: Record<string, string> = {
  tarea: 'bg-amber-100 text-amber-800 border-amber-200',
  examen: 'bg-red-100 text-red-800 border-red-200',
  evento: 'bg-blue-100 text-blue-800 border-blue-200',
  otro: 'bg-slate-100 text-slate-700 border-slate-200',
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
    timeZone: 'UTC',
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

      setConsultado(true);
      setEstudiante(data.estudiante ?? null);
      setRecordatorios(Array.isArray(data.recordatorios) ? data.recordatorios : []);
      setMensaje(typeof data.mensaje === 'string' ? data.mensaje : '');
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
                  {recordatorios?.map((r) => (
                    <li
                      key={r.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h2 className="text-lg font-semibold text-slate-900">{r.nombre}</h2>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            TIPO_COLORS[r.tipo] || TIPO_COLORS.otro
                          }`}
                        >
                          {TIPO_LABELS[r.tipo] || 'Otro'}
                        </span>
                      </div>
                      <p className="text-slate-600 whitespace-pre-wrap text-sm leading-relaxed">
                        {r.descripcion}
                      </p>
                      <dl className="mt-4 grid gap-1 text-sm text-slate-500">
                        <div>
                          <dt className="inline font-medium text-slate-700">Fecha: </dt>
                          <dd className="inline capitalize">{formatFechaLarga(r.fecha)}</dd>
                        </div>
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
                    </li>
                  ))}
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
