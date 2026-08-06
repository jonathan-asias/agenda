'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useMemo, useEffect, useCallback, memo, startTransition } from 'react';
import { showConfirm } from '@/lib/notifications';
import {
  buildReminderEmailHtml,
  parseLocalDateInput,
  COPETON_PUBLIC_PATH,
} from '@/lib/notifications/reminder-email-html';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import ErrorBanner from '@/components/ui/ErrorBanner';
import InfoTooltip from '@/components/ui/InfoTooltip';
import type { AsignacionLike } from '@/types/docente';
import type { Estudiante } from '@/types/estudiante';

interface AddRecordatorioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  docenteId: number;
  institucionId: number;
  institucionNombre?: string;
  docenteNombre?: string;
  asignaciones?: AsignacionLike[];
}

function FieldLabel({
  children,
  required,
  tip,
}: {
  children: React.ReactNode;
  required?: boolean;
  tip: string;
}) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <label className="block text-sm font-semibold text-slate-700">
        {children}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <InfoTooltip label={`Ayuda: ${typeof children === 'string' ? children : 'campo'}`} size="sm" triggerVariant="muted" placement="center">
        <p className="leading-relaxed text-sm">{tip}</p>
      </InfoTooltip>
    </div>
  );
}

const EstudiantesSelector = memo(function EstudiantesSelector({
  estudiantes,
  value,
  loading,
  loadError,
  onChange,
}: {
  estudiantes: Estudiante[];
  value: number[];
  loading: boolean;
  loadError?: string;
  onChange: (next: number[]) => void;
}) {
  const [selectedIds, setSelectedIds] = useState(() => new Set(value));

  useEffect(() => {
    setSelectedIds((prev) => {
      if (prev.size === value.length && value.every((id) => prev.has(id))) {
        return prev;
      }
      return new Set(value);
    });
  }, [value]);

  const commit = useCallback(
    (next: Set<number>) => {
      setSelectedIds(next);
      startTransition(() => onChange(Array.from(next)));
    },
    [onChange]
  );

  if (loading) {
    return (
      <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-8 text-center">
        <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
        <p className="text-sm text-slate-600">Cargando estudiantes...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 text-center">
        <p className="text-sm text-red-700">{loadError}</p>
      </div>
    );
  }

  if (estudiantes.length === 0) {
    return (
      <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 text-center">
        <p className="text-sm text-slate-600">No hay estudiantes en este curso</p>
      </div>
    );
  }

  const allSelected = selectedIds.size === estudiantes.length;

  return (
    <>
      <div className="flex items-center justify-between">
        <FieldLabel tip="Elige a quiénes se les notificará a sus acudientes. Puedes marcar todos o solo algunos.">
          Estudiantes
        </FieldLabel>
        <button
          type="button"
          onClick={() => commit(allSelected ? new Set() : new Set(estudiantes.map((item) => item.id)))}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {allSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
        </button>
      </div>
      <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
        {estudiantes.map((estudiante) => {
          const selected = selectedIds.has(estudiante.id);
          return (
            <label
              key={estudiante.id}
              className="flex cursor-pointer items-center rounded-lg p-3 transition-colors hover:bg-white"
            >
              <input
                type="checkbox"
                checked={selected}
                onChange={() => {
                  const next = new Set(selectedIds);
                  if (selected) next.delete(estudiante.id);
                  else next.add(estudiante.id);
                  commit(next);
                }}
                className="form-quiet-focus h-4 w-4 rounded text-blue-600"
              />
              <span className="ml-3 flex-1 text-slate-800">
                {estudiante.nombres} {estudiante.apellidos}
                {estudiante.codigo_estudiantil && (
                  <span className="ml-2 text-sm text-slate-500">({estudiante.codigo_estudiantil})</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {selectedIds.size > 0 && (
        <p className="text-xs text-slate-500">
          {selectedIds.size} estudiante{selectedIds.size !== 1 ? 's' : ''} seleccionado
          {selectedIds.size !== 1 ? 's' : ''}
        </p>
      )}
    </>
  );
});

export default function AddRecordatorioModal({
  isOpen,
  onClose,
  onSuccess,
  docenteId,
  institucionId,
  institucionNombre = 'Institución',
  docenteNombre = 'Docente',
  asignaciones = [],
}: AddRecordatorioModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    descripcion: '',
    fecha: '',
    gradoId: '',
    cursoId: '',
    areaId: '',
    materiaId: '',
  });
  const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState<number[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cargandoEstudiantes, setCargandoEstudiantes] = useState(false);
  const [estudiantesError, setEstudiantesError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fase, setFase] = useState<'form' | 'confirm'>('form');
  const [modoEnvio, setModoEnvio] = useState<string[]>(['email']);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  const tiposRecordatorio = [
    { value: 'tarea', label: 'Tarea' },
    { value: 'examen', label: 'Examen' },
    { value: 'evento', label: 'Evento' },
    { value: 'otro', label: 'Otro' },
  ];

  const opcionesIniciales = useMemo(() => {
    const gradosMap = new Map<number, { id: number; nombre: string; nivel: string }>();
    const areasMap = new Map<number, { id: number; nombre: string }>();

    asignaciones.forEach((asignacion) => {
      const grado = asignacion.grado;
      if (grado?.id != null && !gradosMap.has(grado.id)) {
        gradosMap.set(grado.id, { id: grado.id, nombre: grado.nombre, nivel: grado.nivel });
      }
      const area = asignacion.materia?.area;
      if (area?.id != null && !areasMap.has(area.id)) {
        areasMap.set(area.id, { id: area.id, nombre: area.nombre });
      }
    });

    return {
      grados: Array.from(gradosMap.values()),
      areas: Array.from(areasMap.values()),
    };
  }, [asignaciones]);

  const cursosFiltrados = useMemo(() => {
    if (!formData.gradoId) return [];
    const gradoIdNum = parseInt(formData.gradoId);
    const cursosMap = new Map<number, { id: number; nombre: string; jornada: string | null }>();
    asignaciones
      .filter((asignacion) => asignacion.grado?.id === gradoIdNum)
      .forEach((asignacion) => {
        const curso = asignacion.curso;
        if (curso?.id != null && !cursosMap.has(curso.id)) {
          cursosMap.set(curso.id, {
            id: curso.id,
            nombre: curso.nombre,
            jornada: curso.jornada ?? null,
          });
        }
      });
    return Array.from(cursosMap.values());
  }, [asignaciones, formData.gradoId]);

  const materiasFiltradas = useMemo(() => {
    if (!formData.areaId) return [];
    const areaIdNum = parseInt(formData.areaId);
    const materiasMap = new Map<number, { id: number; nombre: string }>();
    asignaciones
      .filter((asignacion) => asignacion.materia?.area?.id === areaIdNum)
      .forEach((asignacion) => {
        const materia = asignacion.materia;
        if (materia?.id != null && !materiasMap.has(materia.id)) {
          materiasMap.set(materia.id, { id: materia.id, nombre: materia.nombre });
        }
      });
    return Array.from(materiasMap.values());
  }, [asignaciones, formData.areaId]);

  useEffect(() => {
    if (!formData.cursoId) {
      setEstudiantes([]);
      setEstudiantesSeleccionados([]);
      setEstudiantesError('');
      return;
    }

    const controller = new AbortController();

    const cargarEstudiantes = async () => {
      setCargandoEstudiantes(true);
      setEstudiantesError('');
      try {
        const response = await fetch(
          `/api/estudiantes/by-curso/${formData.cursoId}?institucionId=${institucionId}`,
          { signal: controller.signal }
        );
        if (response.ok) {
          const data = await response.json();
          setEstudiantes(data.estudiantes || []);
        } else {
          const data = await response.json().catch(() => ({}));
          setEstudiantes([]);
          setEstudiantesError(
            data.error ||
              'No se pudieron cargar los estudiantes de este curso. Verifica tu asignación e inténtalo de nuevo.'
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setEstudiantes([]);
        setEstudiantesError('Error de red al cargar estudiantes.');
      } finally {
        if (!controller.signal.aborted) setCargandoEstudiantes(false);
      }
    };

    void cargarEstudiantes();
    return () => controller.abort();
  }, [formData.cursoId, institucionId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleRadioChange = (name: string, value: string) => {
    const next = { ...formData, [name]: value };
    if (name === 'gradoId') {
      next.cursoId = '';
      setEstudiantes([]);
      setEstudiantesSeleccionados([]);
    }
    if (name === 'cursoId') setEstudiantesSeleccionados([]);
    if (name === 'areaId') next.materiaId = '';
    setFormData(next);
    if (error) setError('');
  };

  const validarFormulario = (): boolean => {
    if (!docenteId || docenteId <= 0) {
      setError('No se identificó al docente. Recarga la página e inténtalo de nuevo.');
      return false;
    }
    if (!formData.nombre.trim()) {
      setError('El nombre del recordatorio es requerido');
      return false;
    }
    if (!formData.tipo) {
      setError('El tipo de recordatorio es requerido');
      return false;
    }
    if (!formData.descripcion.trim()) {
      setError('La descripción es requerida');
      return false;
    }
    if (!formData.fecha) {
      setError('La fecha del recordatorio es requerida');
      return false;
    }
    if (!formData.gradoId || !formData.cursoId || !formData.areaId || !formData.materiaId) {
      setError('Selecciona grado, curso, área y materia');
      return false;
    }

    const fechaSeleccionada = parseLocalDateInput(formData.fecha);
    if (!fechaSeleccionada) {
      setError('La fecha del recordatorio no es válida');
      return false;
    }
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaSeleccionada < hoy) {
      setError('La fecha no puede ser anterior a hoy');
      return false;
    }

    if (modoEnvio.length === 0) {
      setError('Selecciona al menos un método de envío (WhatsApp o correo electrónico)');
      return false;
    }
    if (estudiantesSeleccionados.length === 0) {
      setError('Selecciona al menos un estudiante para enviar el recordatorio');
      return false;
    }
    return true;
  };

  const fechaIsoParaApi = (): string => {
    const local = parseLocalDateInput(formData.fecha);
    if (!local) return formData.fecha;
    // Mediodía local → ISO estable (evita correr un día por UTC)
    return new Date(
      local.getFullYear(),
      local.getMonth(),
      local.getDate(),
      12,
      0,
      0
    ).toISOString();
  };

  const enviarRecordatorio = async () => {
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/recordatorios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          descripcion: formData.descripcion.trim(),
          fecha: fechaIsoParaApi(),
          tipo: formData.tipo,
          modoEnvio,
          docenteId: String(docenteId),
          gradoId: String(formData.gradoId),
          cursoId: String(formData.cursoId),
          areaId: String(formData.areaId),
          materiaId: String(formData.materiaId),
          estudiantesSeleccionados: estudiantesSeleccionados.map(String),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          const retryAfter = Number(
            response.headers.get('retry-after') || errorData.retryAfterSec || 60
          );
          const minutes = Math.max(1, Math.ceil(retryAfter / 60));
          setError(
            errorData.error ||
              `Has enviado demasiados recordatorios. Espera ${minutes} minuto${minutes === 1 ? '' : 's'} e inténtalo de nuevo.`
          );
        } else {
          setError(errorData.error || 'No pudimos crear el recordatorio. Intenta de nuevo.');
        }
        setFase('form');
        setSubmitting(false);
        return;
      }

      resetForm();
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error al crear recordatorio:', err);
      setError('No pudimos crear el recordatorio. Intenta de nuevo.');
      setFase('form');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validarFormulario()) return;

    if (fase === 'form') {
      setFase('confirm');
      return;
    }

    const destinatarios =
      estudiantesSeleccionados.length === estudiantes.length
        ? `todos los acudientes del curso (${estudiantesSeleccionados.length})`
        : `${estudiantesSeleccionados.length} acudiente${estudiantesSeleccionados.length !== 1 ? 's' : ''}`;

    const canales = modoEnvio
      .map((m) => (m === 'email' ? 'correo electrónico' : m === 'whatsapp' ? 'WhatsApp' : m))
      .join(' y ');

    const confirmed = await showConfirm({
      title: '¿Crear recordatorio?',
      text: `Se notificará a ${destinatarios} por ${canales}.`,
      confirmButtonText: 'Crear recordatorio',
      cancelButtonText: 'Volver a revisar',
      icon: 'question',
      confirmButtonColor: '#2563eb',
    });

    if (!confirmed) {
      setFase('form');
      return;
    }

    await enviarRecordatorio();
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      tipo: '',
      descripcion: '',
      fecha: '',
      gradoId: '',
      cursoId: '',
      areaId: '',
      materiaId: '',
    });
    setModoEnvio(['email']);
    setEstudiantes([]);
    setEstudiantesSeleccionados([]);
    setEstudiantesError('');
    setError('');
    setFase('form');
    setShowEmailPreview(false);
  };

  const toggleModoEnvio = (value: string) => {
    setModoEnvio((prev) =>
      prev.includes(value) ? prev.filter((m) => m !== value) : [...prev, value]
    );
    if (error) setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const emailPreviewHtml = useMemo(() => {
    const fecha = parseLocalDateInput(formData.fecha);
    const fechaUtcNoon = fecha
      ? new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 12))
      : null;
    return buildReminderEmailHtml({
      institucionNombre,
      docenteNombre,
      titulo: formData.nombre.trim() || 'Título del recordatorio',
      descripcion:
        formData.descripcion.trim() ||
        'Aquí aparecerá la descripción que escribas para el acudiente.',
      fechaLimite: fechaUtcNoon,
      baseUrl:
        typeof window !== 'undefined' ? window.location.origin : 'https://ahoritapp.com',
      copetonSrc: COPETON_PUBLIC_PATH,
    });
  }, [
    formData.nombre,
    formData.descripcion,
    formData.fecha,
    institucionNombre,
    docenteNombre,
  ]);

  if (!isOpen) return null;

  const hoy = new Date();
  const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  const emailSelected = modoEnvio.includes('email');
  const whatsappSelected = modoEnvio.includes('whatsapp');

  return (
    <>
      <Modal
        open={isOpen}
        onClose={handleClose}
        title="Agregar recordatorio"
        size="xl"
        className="max-w-3xl"
      >
        <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
          Crea un recordatorio para organizar tareas, exámenes o eventos con tus estudiantes.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <FieldLabel
              required
              tip="Título corto que verá el acudiente en el correo o WhatsApp. Sé claro: materia + actividad."
            >
              Nombre del recordatorio
            </FieldLabel>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              maxLength={255}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="Ej: Revisar exámenes de Matemáticas"
            />
          </div>

          <div>
            <FieldLabel
              required
              tip="Clasifica el aviso: tarea, examen, evento u otro. Ayuda al acudiente a priorizar."
            >
              Tipo de recordatorio
            </FieldLabel>
            <div className="relative">
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                required
                className="w-full cursor-pointer appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900"
              >
                <option value="">Selecciona un tipo</option>
                {tiposRecordatorio.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <FieldLabel
              required
              tip="Detalle que leerá el acudiente: qué debe hacer el estudiante, materiales o indicaciones."
            >
              Descripción
            </FieldLabel>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              required
              rows={4}
              maxLength={1000}
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="Describe los detalles del recordatorio..."
            />
            <p className="mt-1 text-xs text-slate-500">{formData.descripcion.length}/1000 caracteres</p>
          </div>

          <div>
            <FieldLabel
              required
              tip="Fecha límite o del evento. No puede ser anterior a hoy (zona horaria local)."
            >
              Fecha del recordatorio
            </FieldLabel>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              required
              min={hoyStr}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900"
            />
          </div>

          <div>
            <FieldLabel
              required
              tip="Elige por qué canales notificar a los acudientes. Puedes combinar correo y WhatsApp. El SMS ya no está disponible."
            >
              Método de envío
            </FieldLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => toggleModoEnvio('email')}
                className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition ${
                  emailSelected
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    emailSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <span>
                  <span className="block font-semibold text-slate-900">Correo electrónico</span>
                  <span className="mt-0.5 block text-xs text-slate-600">
                    Llega con la plantilla de Copetón al correo del acudiente.
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleModoEnvio('whatsapp')}
                className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition ${
                  whatsappSelected
                    ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    whatsappSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.957-1.4A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.094-1.126l-.293-.175-2.941.83.83-2.868-.191-.304A7.963 7.963 0 014 12a8 8 0 1116 0 8 8 0 01-8 8z" />
                  </svg>
                </span>
                <span>
                  <span className="block font-semibold text-slate-900">WhatsApp</span>
                  <span className="mt-0.5 block text-xs text-slate-600">
                    Requiere plan con WhatsApp y opt-in del acudiente.
                  </span>
                </span>
              </button>
            </div>

            {emailSelected && (
              <div className="mt-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setShowEmailPreview(true)}
                >
                  Vista previa del correo al acudiente
                </Button>
              </div>
            )}
          </div>

          {opcionesIniciales.areas.length > 0 && (
            <div>
              <FieldLabel required tip="Área académica asociada a tus asignaciones (ej. Matemáticas, Ciencias).">
                Área
              </FieldLabel>
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
                {opcionesIniciales.areas.map((area) => (
                  <label
                    key={area.id}
                    className="flex cursor-pointer items-center rounded-lg p-3 transition-colors hover:bg-white"
                  >
                    <input
                      type="radio"
                      name="areaId"
                      value={area.id.toString()}
                      checked={formData.areaId === area.id.toString()}
                      onChange={(e) => handleRadioChange('areaId', e.target.value)}
                      className="h-4 w-4 rounded text-blue-600"
                    />
                    <span className="ml-3 text-slate-800">{area.nombre}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {formData.areaId && materiasFiltradas.length > 0 && (
            <div>
              <FieldLabel required tip="Materia concreta del área que seleccionaste.">
                Materia
              </FieldLabel>
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
                {materiasFiltradas.map((materia) => (
                  <label
                    key={materia.id}
                    className="flex cursor-pointer items-center rounded-lg p-3 transition-colors hover:bg-white"
                  >
                    <input
                      type="radio"
                      name="materiaId"
                      value={materia.id.toString()}
                      checked={formData.materiaId === materia.id.toString()}
                      onChange={(e) => handleRadioChange('materiaId', e.target.value)}
                      className="h-4 w-4 rounded text-blue-600"
                    />
                    <span className="ml-3 text-slate-800">{materia.nombre}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {opcionesIniciales.grados.length > 0 && (
            <div>
              <FieldLabel required tip="Grado escolar al que pertenece el curso de destino.">
                Grado
              </FieldLabel>
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
                {opcionesIniciales.grados.map((grado) => (
                  <label
                    key={grado.id}
                    className="flex cursor-pointer items-center rounded-lg p-3 transition-colors hover:bg-white"
                  >
                    <input
                      type="radio"
                      name="gradoId"
                      value={grado.id.toString()}
                      checked={formData.gradoId === grado.id.toString()}
                      onChange={(e) => handleRadioChange('gradoId', e.target.value)}
                      className="h-4 w-4 rounded text-blue-600"
                    />
                    <span className="ml-3 text-slate-800">
                      {grado.nombre} <span className="text-sm text-slate-500">({grado.nivel})</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {formData.gradoId && cursosFiltrados.length > 0 && (
            <div>
              <FieldLabel required tip="Curso o grupo dentro del grado (ej. 5-A). Define la lista de estudiantes.">
                Curso
              </FieldLabel>
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
                {cursosFiltrados.map((curso) => (
                  <label
                    key={curso.id}
                    className="flex cursor-pointer items-center rounded-lg p-3 transition-colors hover:bg-white"
                  >
                    <input
                      type="radio"
                      name="cursoId"
                      value={curso.id.toString()}
                      checked={formData.cursoId === curso.id.toString()}
                      onChange={(e) => handleRadioChange('cursoId', e.target.value)}
                      className="h-4 w-4 rounded text-blue-600"
                    />
                    <span className="ml-3 text-slate-800">
                      {curso.nombre}
                      {curso.jornada && (
                        <span className="text-sm text-slate-500"> ({curso.jornada})</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {formData.cursoId && (
            <div className="space-y-3">
              <EstudiantesSelector
                estudiantes={estudiantes}
                value={estudiantesSeleccionados}
                loading={cargandoEstudiantes}
                loadError={estudiantesError}
                onChange={setEstudiantesSeleccionados}
              />
            </div>
          )}

          {error && <ErrorBanner title={error} />}

          {fase === 'confirm' && (
            <section
              className="space-y-2 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface-nested)] p-4"
              aria-label="Resumen antes de crear"
            >
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                Resumen antes de crear
              </h3>
              <p className="text-sm">
                <strong>{formData.nombre}</strong> ·{' '}
                {tiposRecordatorio.find((t) => t.value === formData.tipo)?.label}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">{formData.descripcion}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Fecha: {formData.fecha} · Canales:{' '}
                {modoEnvio
                  .map((m) => (m === 'email' ? 'correo' : m === 'whatsapp' ? 'WhatsApp' : m))
                  .join(', ')}{' '}
                · {estudiantesSeleccionados.length} destinatario
                {estudiantesSeleccionados.length !== 1 ? 's' : ''}
              </p>
            </section>
          )}

          <div className="flex flex-col gap-3 border-t border-[var(--color-border-light)] pt-4 sm:flex-row">
            {fase === 'confirm' && (
              <Button type="button" variant="outline" onClick={() => setFase('form')}>
                Volver a editar
              </Button>
            )}
            <Button type="submit" variant="primary" disabled={submitting} className="flex-1">
              {submitting
                ? 'Creando…'
                : fase === 'form'
                  ? 'Revisar y crear'
                  : 'Crear recordatorio'}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={showEmailPreview}
        onClose={() => setShowEmailPreview(false)}
        title="Vista previa del correo"
        size="xl"
        className="max-w-2xl"
        zIndex={120}
      >
        <p className="mb-3 text-sm text-slate-600">
          Así verá el acudiente el mensaje cuando envíes por correo electrónico (plantilla Copetón).
        </p>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          <iframe
            title="Vista previa correo recordatorio"
            srcDoc={emailPreviewHtml}
            className="h-[70vh] w-full bg-white"
            sandbox=""
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="button" variant="primary" onClick={() => setShowEmailPreview(false)}>
            Cerrar vista previa
          </Button>
        </div>
      </Modal>
    </>
  );
}
