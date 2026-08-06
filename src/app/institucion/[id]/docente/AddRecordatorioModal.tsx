'use client';

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

type DestinoStep = 1 | 2 | 3 | 4 | 5;

const DESTINO_STEPS: {
  id: DestinoStep;
  title: string;
  short: string;
  tip: string;
}[] = [
  {
    id: 1,
    title: 'Área',
    short: 'Área',
    tip: 'Primero elige el área académica (por ejemplo Ciencias o Lenguaje). Solo verás las áreas que tienes asignadas.',
  },
  {
    id: 2,
    title: 'Materia',
    short: 'Materia',
    tip: 'Después de elegir el área, selecciona la materia concreta a la que aplica este recordatorio.',
  },
  {
    id: 3,
    title: 'Grado',
    short: 'Grado',
    tip: 'Indica el grado escolar (por ejemplo 5.° o 6.°). Filtra los cursos disponibles en el siguiente paso.',
  },
  {
    id: 4,
    title: 'Curso',
    short: 'Curso',
    tip: 'Elige el grupo o curso (por ejemplo 5-A). Con esto cargamos la lista de estudiantes.',
  },
  {
    id: 5,
    title: 'Estudiantes',
    short: 'Alumnos',
    tip: 'Marca a qué estudiantes va dirigido el aviso. Sus acudientes recibirán la notificación por el canal que elegiste.',
  },
];

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
    <div className="mb-2 flex items-center gap-1.5">
      <label className="block text-sm font-semibold text-slate-700">
        {children}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <InfoTooltip
        label={`Ayuda: ${typeof children === 'string' ? children : 'campo'}`}
        size="sm"
        triggerVariant="muted"
        placement="center"
      >
        <p className="text-sm leading-relaxed">{tip}</p>
      </InfoTooltip>
    </div>
  );
}

function OptionCard({
  selected,
  title,
  subtitle,
  onSelect,
}: {
  selected: boolean;
  title: string;
  subtitle?: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border-2 px-4 py-3 text-left transition ${
        selected
          ? 'border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-200'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <span className="flex items-center gap-3">
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
            selected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
          }`}
        >
          {selected ? (
            <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : null}
        </span>
        <span>
          <span className="block text-sm font-semibold text-slate-900">{title}</span>
          {subtitle ? <span className="mt-0.5 block text-xs text-slate-500">{subtitle}</span> : null}
        </span>
      </span>
    </button>
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
      if (prev.size === value.length && value.every((id) => prev.has(id))) return prev;
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
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
        <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
        <p className="text-sm text-slate-600">Cargando estudiantes del curso…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
        <p className="text-sm text-red-700">{loadError}</p>
      </div>
    );
  }

  if (estudiantes.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
        <p className="text-sm text-slate-600">Este curso aún no tiene estudiantes activos.</p>
      </div>
    );
  }

  const allSelected = selectedIds.size === estudiantes.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-slate-600">
          {selectedIds.size} de {estudiantes.length} seleccionado
          {selectedIds.size !== 1 ? 's' : ''}
        </p>
        <button
          type="button"
          onClick={() =>
            commit(allSelected ? new Set() : new Set(estudiantes.map((item) => item.id)))
          }
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          {allSelected ? 'Quitar todos' : 'Seleccionar todos'}
        </button>
      </div>
      <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
        {estudiantes.map((estudiante) => {
          const selected = selectedIds.has(estudiante.id);
          return (
            <label
              key={estudiante.id}
              className={`flex cursor-pointer items-center rounded-lg border px-3 py-2.5 transition ${
                selected
                  ? 'border-blue-200 bg-white shadow-sm'
                  : 'border-transparent hover:border-slate-200 hover:bg-white'
              }`}
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
              <span className="ml-3 flex-1 text-sm text-slate-800">
                {estudiante.nombres} {estudiante.apellidos}
                {estudiante.codigo_estudiantil ? (
                  <span className="ml-2 text-xs text-slate-500">
                    ({estudiante.codigo_estudiantil})
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
    </div>
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
  const [destinoStep, setDestinoStep] = useState<DestinoStep>(1);

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

  const maxUnlockedStep: DestinoStep = useMemo(() => {
    if (!formData.areaId) return 1;
    if (!formData.materiaId) return 2;
    if (!formData.gradoId) return 3;
    if (!formData.cursoId) return 4;
    return 5;
  }, [formData.areaId, formData.materiaId, formData.gradoId, formData.cursoId]);

  useEffect(() => {
    if (destinoStep > maxUnlockedStep) setDestinoStep(maxUnlockedStep);
  }, [destinoStep, maxUnlockedStep]);

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
              'No se pudieron cargar los estudiantes. Confirma que el curso está en tu asignación.'
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setEstudiantes([]);
        setEstudiantesError('No hay conexión para cargar estudiantes. Inténtalo de nuevo.');
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

  const selectDestino = (name: 'areaId' | 'materiaId' | 'gradoId' | 'cursoId', value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'areaId') {
        next.materiaId = '';
        next.gradoId = '';
        next.cursoId = '';
      }
      if (name === 'materiaId') {
        next.gradoId = '';
        next.cursoId = '';
      }
      if (name === 'gradoId') {
        next.cursoId = '';
      }
      return next;
    });

    if (name === 'areaId' || name === 'materiaId' || name === 'gradoId') {
      setEstudiantes([]);
      setEstudiantesSeleccionados([]);
    }
    if (name === 'cursoId') {
      setEstudiantesSeleccionados([]);
    }

    if (error) setError('');

    if (name === 'areaId') setDestinoStep(2);
    if (name === 'materiaId') setDestinoStep(3);
    if (name === 'gradoId') setDestinoStep(4);
    if (name === 'cursoId') setDestinoStep(5);
  };

  const validarFormulario = (): boolean => {
    if (!docenteId || docenteId <= 0) {
      setError('No se identificó tu sesión de docente. Recarga la página e inténtalo otra vez.');
      return false;
    }
    if (!formData.nombre.trim()) {
      setError('Escribe un nombre para el recordatorio.');
      return false;
    }
    if (!formData.tipo) {
      setError('Elige el tipo: tarea, examen, evento u otro.');
      return false;
    }
    if (!formData.descripcion.trim()) {
      setError('Agrega una descripción para que el acudiente entienda el aviso.');
      return false;
    }
    if (!formData.fecha) {
      setError('Selecciona la fecha del recordatorio.');
      return false;
    }
    if (!formData.gradoId || !formData.cursoId || !formData.areaId || !formData.materiaId) {
      setError('Completa los 5 pasos de destino: área, materia, grado, curso y estudiantes.');
      setDestinoStep(
        !formData.areaId ? 1 : !formData.materiaId ? 2 : !formData.gradoId ? 3 : !formData.cursoId ? 4 : 5
      );
      return false;
    }

    const fechaSeleccionada = parseLocalDateInput(formData.fecha);
    if (!fechaSeleccionada) {
      setError('La fecha no es válida.');
      return false;
    }
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaSeleccionada < hoy) {
      setError('La fecha no puede ser anterior a hoy.');
      return false;
    }

    if (modoEnvio.length === 0) {
      setError('Elige al menos un canal: correo electrónico o WhatsApp.');
      return false;
    }
    if (estudiantesSeleccionados.length === 0) {
      setError('Selecciona al menos un estudiante (paso 5).');
      setDestinoStep(5);
      return false;
    }
    return true;
  };

  const fechaIsoParaApi = (): string => {
    const local = parseLocalDateInput(formData.fecha);
    if (!local) return formData.fecha;
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
      setError('No pudimos crear el recordatorio. Revisa tu conexión e inténtalo de nuevo.');
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
    setDestinoStep(1);
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
      showActionButtons: false,
    });
  }, [
    formData.nombre,
    formData.descripcion,
    formData.fecha,
    institucionNombre,
    docenteNombre,
  ]);

  const selectedLabels = useMemo(() => {
    const area = opcionesIniciales.areas.find((a) => String(a.id) === formData.areaId)?.nombre;
    const materia = materiasFiltradas.find((m) => String(m.id) === formData.materiaId)?.nombre;
    const grado = opcionesIniciales.grados.find((g) => String(g.id) === formData.gradoId)?.nombre;
    const curso = cursosFiltrados.find((c) => String(c.id) === formData.cursoId)?.nombre;
    return { area, materia, grado, curso };
  }, [
    opcionesIniciales.areas,
    opcionesIniciales.grados,
    materiasFiltradas,
    cursosFiltrados,
    formData.areaId,
    formData.materiaId,
    formData.gradoId,
    formData.cursoId,
  ]);

  if (!isOpen) return null;

  const hoy = new Date();
  const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  const emailSelected = modoEnvio.includes('email');
  const whatsappSelected = modoEnvio.includes('whatsapp');
  const currentStepMeta = DESTINO_STEPS.find((s) => s.id === destinoStep)!;

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
          Completa el aviso y luego elige a quién llega, paso a paso.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <FieldLabel
              required
              tip="Es el título que verá el acudiente. Usa algo concreto, por ejemplo: “Tarea de fracciones — entrega viernes”."
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
              placeholder="Ej: Tarea de fracciones — entrega viernes"
            />
          </div>

          <div>
            <FieldLabel
              required
              tip="Clasifica el aviso para que el acudiente sepa si es tarea, examen, evento u otro tipo."
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
              tip="Explica con claridad qué debe hacer o saber el estudiante. Este texto llega al acudiente casi tal cual."
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
              placeholder="Ej: Traer el cuaderno y resolver los ejercicios 1 al 10 de la página 42."
            />
            <p className="mt-1 text-xs text-slate-500">{formData.descripcion.length}/1000 caracteres</p>
          </div>

          <div>
            <FieldLabel
              required
              tip="Fecha límite o del evento. No puede ser un día anterior a hoy."
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
              tip="Define cómo se notifica al acudiente. Puedes marcar correo, WhatsApp o ambos. El SMS ya no está disponible."
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
                    El acudiente recibe el mensaje con la plantilla de Copetón.
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
                    Solo si tu plan lo incluye y el acudiente ya autorizó WhatsApp.
                  </span>
                </span>
              </button>
            </div>

            {emailSelected && (
              <button
                type="button"
                onClick={() => setShowEmailPreview(true)}
                className="mt-3 flex w-full items-center gap-3 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50 px-4 py-3 text-left shadow-sm transition hover:border-blue-300 hover:from-blue-100 hover:to-sky-100"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-blue-900">
                    Vista previa del correo al acudiente
                  </span>
                  <span className="mt-0.5 block text-xs text-blue-700/80">
                    Mira cómo se verá el mensaje de Copetón antes de enviarlo.
                  </span>
                </span>
                <span className="hidden text-sm font-medium text-blue-700 sm:inline">Ver</span>
              </button>
            )}
          </div>

          {/* Destino en pasos */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900">Destino del recordatorio</h3>
                <InfoTooltip
                  label="Ayuda: destino"
                  size="sm"
                  triggerVariant="muted"
                  placement="center"
                >
                  <p className="text-sm leading-relaxed">
                    Completa estos 5 pasos en orden. Cada elección desbloquea el siguiente.
                  </p>
                </InfoTooltip>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Paso {destinoStep} de 5 · {currentStepMeta.title}
              </p>

              <ol className="mt-4 flex items-center gap-1 sm:gap-2">
                {DESTINO_STEPS.map((step, index) => {
                  const done =
                    (step.id === 1 && !!formData.areaId) ||
                    (step.id === 2 && !!formData.materiaId) ||
                    (step.id === 3 && !!formData.gradoId) ||
                    (step.id === 4 && !!formData.cursoId) ||
                    (step.id === 5 && estudiantesSeleccionados.length > 0);
                  const unlocked = step.id <= maxUnlockedStep;
                  const active = step.id === destinoStep;
                  return (
                    <li key={step.id} className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
                      <button
                        type="button"
                        disabled={!unlocked}
                        onClick={() => unlocked && setDestinoStep(step.id)}
                        className={`flex w-full flex-col items-center gap-1 rounded-lg px-0.5 py-1 transition ${
                          unlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
                        }`}
                        aria-current={active ? 'step' : undefined}
                      >
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                            active
                              ? 'bg-blue-600 text-white shadow'
                              : done
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {done && !active ? (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            step.id
                          )}
                        </span>
                        <span
                          className={`hidden text-[10px] font-medium sm:block ${
                            active ? 'text-blue-700' : 'text-slate-500'
                          }`}
                        >
                          {step.short}
                        </span>
                      </button>
                      {index < DESTINO_STEPS.length - 1 ? (
                        <span
                          className={`mb-4 hidden h-0.5 flex-1 rounded sm:mb-5 sm:block ${
                            step.id < maxUnlockedStep ? 'bg-emerald-400' : 'bg-slate-200'
                          }`}
                          aria-hidden
                        />
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="space-y-4 px-4 py-4 sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Paso {destinoStep}: {currentStepMeta.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{currentStepMeta.tip}</p>
                </div>
                <InfoTooltip
                  label={`Ayuda: ${currentStepMeta.title}`}
                  size="sm"
                  triggerVariant="muted"
                  placement="left"
                >
                  <p className="text-sm leading-relaxed">{currentStepMeta.tip}</p>
                </InfoTooltip>
              </div>

              {(selectedLabels.area ||
                selectedLabels.materia ||
                selectedLabels.grado ||
                selectedLabels.curso) && (
                <div className="flex flex-wrap gap-2">
                  {selectedLabels.area ? (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      Área: {selectedLabels.area}
                    </span>
                  ) : null}
                  {selectedLabels.materia ? (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      Materia: {selectedLabels.materia}
                    </span>
                  ) : null}
                  {selectedLabels.grado ? (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      Grado: {selectedLabels.grado}
                    </span>
                  ) : null}
                  {selectedLabels.curso ? (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      Curso: {selectedLabels.curso}
                    </span>
                  ) : null}
                </div>
              )}

              {destinoStep === 1 && (
                <div className="max-h-56 space-y-2 overflow-y-auto">
                  {opcionesIniciales.areas.length === 0 ? (
                    <p className="rounded-xl bg-amber-50 px-3 py-3 text-sm text-amber-800">
                      No tienes áreas asignadas. Pide a tu administrador que te asigne materias.
                    </p>
                  ) : (
                    opcionesIniciales.areas.map((area) => (
                      <OptionCard
                        key={area.id}
                        selected={formData.areaId === String(area.id)}
                        title={area.nombre}
                        onSelect={() => selectDestino('areaId', String(area.id))}
                      />
                    ))
                  )}
                </div>
              )}

              {destinoStep === 2 && (
                <div className="max-h-56 space-y-2 overflow-y-auto">
                  {materiasFiltradas.length === 0 ? (
                    <p className="text-sm text-slate-600">No hay materias en esta área.</p>
                  ) : (
                    materiasFiltradas.map((materia) => (
                      <OptionCard
                        key={materia.id}
                        selected={formData.materiaId === String(materia.id)}
                        title={materia.nombre}
                        onSelect={() => selectDestino('materiaId', String(materia.id))}
                      />
                    ))
                  )}
                </div>
              )}

              {destinoStep === 3 && (
                <div className="max-h-56 space-y-2 overflow-y-auto">
                  {opcionesIniciales.grados.length === 0 ? (
                    <p className="text-sm text-slate-600">No tienes grados asignados.</p>
                  ) : (
                    opcionesIniciales.grados.map((grado) => (
                      <OptionCard
                        key={grado.id}
                        selected={formData.gradoId === String(grado.id)}
                        title={grado.nombre}
                        subtitle={grado.nivel}
                        onSelect={() => selectDestino('gradoId', String(grado.id))}
                      />
                    ))
                  )}
                </div>
              )}

              {destinoStep === 4 && (
                <div className="max-h-56 space-y-2 overflow-y-auto">
                  {cursosFiltrados.length === 0 ? (
                    <p className="text-sm text-slate-600">No hay cursos para este grado.</p>
                  ) : (
                    cursosFiltrados.map((curso) => (
                      <OptionCard
                        key={curso.id}
                        selected={formData.cursoId === String(curso.id)}
                        title={curso.nombre}
                        subtitle={curso.jornada || undefined}
                        onSelect={() => selectDestino('cursoId', String(curso.id))}
                      />
                    ))
                  )}
                </div>
              )}

              {destinoStep === 5 && (
                <EstudiantesSelector
                  estudiantes={estudiantes}
                  value={estudiantesSeleccionados}
                  loading={cargandoEstudiantes}
                  loadError={estudiantesError}
                  onChange={setEstudiantesSeleccionados}
                />
              )}

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={destinoStep <= 1}
                  onClick={() => setDestinoStep((s) => (s > 1 ? ((s - 1) as DestinoStep) : s))}
                >
                  Anterior
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  disabled={destinoStep >= 5 || destinoStep >= maxUnlockedStep}
                  onClick={() =>
                    setDestinoStep((s) =>
                      s < 5 && s < maxUnlockedStep ? ((s + 1) as DestinoStep) : s
                    )
                  }
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </section>

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
                {selectedLabels.area} · {selectedLabels.materia} · {selectedLabels.grado} ·{' '}
                {selectedLabels.curso} · Fecha {formData.fecha} ·{' '}
                {estudiantesSeleccionados.length} destinatario
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
          Así verá el acudiente el mensaje de Copetón cuando envíes por correo.
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
