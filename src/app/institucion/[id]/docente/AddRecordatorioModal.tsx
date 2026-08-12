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
import {
  getRecordatorioFormLabels,
  isRecordatorioTipo,
  RECORDATORIO_TIPO_LABELS,
  RECORDATORIO_TIPOS,
  type RecordatorioTipo,
} from '@/lib/recordatorios/tipos';
import {
  AUTORIZACION_MINUTOS_ANTES,
  computeAutorizacionVencimiento,
  formatDateInputFromDate,
  formatTimeInputFromDate,
  parseLocalDateTimeInput,
  validateAutorizacionVencimiento,
  validateHoraFin,
} from '@/lib/recordatorios/autorizacion';
import {
  CALENDARIO_EVENTO_CATEGORIA_LABELS,
  type CalendarioEvento,
} from '@/lib/calendario-academico/tipos';

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

type DestinoStep = 1 | 2 | 3 | 4 | 5 | 6;

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
  {
    id: 6,
    title: 'Crear recordatorio',
    short: 'Crear',
    tip: 'Revisa el resumen. El botón Crear solo se habilita cuando todos los campos anteriores están completos.',
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

function TipoRecordatorioIcon({ tipo }: { tipo: RecordatorioTipo }) {
  const className = 'h-5 w-5';

  switch (tipo) {
    case 'tarea':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      );
    case 'examen':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14v7M5 6.5V17a2 2 0 002 2h10a2 2 0 002-2V6.5"
          />
        </svg>
      );
    case 'evento':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      );
    case 'autorizacion':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      );
    case 'otro':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      );
  }
}

function TipoRecordatorioOption({
  tipo,
  label,
  selected,
  onSelect,
}: {
  tipo: RecordatorioTipo;
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      title={label}
      className={`flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-xl border-2 px-1.5 py-2.5 transition sm:px-2 sm:py-3 ${
        selected
          ? 'border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-200'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          selected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
        }`}
      >
        <TipoRecordatorioIcon tipo={tipo} />
      </span>
      <span
        className={`w-full text-center text-[10px] font-semibold leading-tight sm:text-xs ${
          selected ? 'text-blue-800' : 'text-slate-700'
        }`}
      >
        {label}
      </span>
    </button>
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
    eventoNombre: '',
    fechaEvento: '',
    horaEvento: '',
    horaFin: '',
    lugarEvento: '',
    horaVencimiento: '',
    calendarioEventoId: '' as string,
  });
  const [eventosCalendario, setEventosCalendario] = useState<CalendarioEvento[]>([]);
  const [cargandoEventosCalendario, setCargandoEventosCalendario] = useState(false);
  const [horaVencimientoInvalida, setHoraVencimientoInvalida] = useState(false);
  const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState<number[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cargandoEstudiantes, setCargandoEstudiantes] = useState(false);
  const [estudiantesError, setEstudiantesError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [modoEnvio, setModoEnvio] = useState<string[]>(['email']);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [destinoStep, setDestinoStep] = useState<DestinoStep>(1);

  const tiposRecordatorio = RECORDATORIO_TIPOS.map((value) => ({
    value,
    label: RECORDATORIO_TIPO_LABELS[value],
  }));
  const esAutorizacion = formData.tipo === 'autorizacion';
  const fieldLabels = isRecordatorioTipo(formData.tipo)
    ? getRecordatorioFormLabels(formData.tipo)
    : null;

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

  const syncVencimientoFromEvento = useCallback((fechaEvento: string, horaEvento: string) => {
    const evento = parseLocalDateTimeInput(fechaEvento, horaEvento);
    if (!evento) {
      return { fecha: '', horaVencimiento: '' };
    }
    const venc = computeAutorizacionVencimiento(evento);
    return {
      fecha: formatDateInputFromDate(venc),
      horaVencimiento: formatTimeInputFromDate(venc),
    };
  }, []);

  useEffect(() => {
    if (!esAutorizacion) {
      setHoraVencimientoInvalida(false);
      return;
    }
    if (!formData.fechaEvento || !formData.horaEvento) return;
    const synced = syncVencimientoFromEvento(formData.fechaEvento, formData.horaEvento);
    setFormData((prev) => {
      if (
        prev.fecha === synced.fecha &&
        prev.horaVencimiento === synced.horaVencimiento
      ) {
        return prev;
      }
      return { ...prev, ...synced };
    });
    setHoraVencimientoInvalida(false);
  }, [
    esAutorizacion,
    formData.fechaEvento,
    formData.horaEvento,
    syncVencimientoFromEvento,
  ]);

  const fechaSeleccionadaOk = useMemo(() => {
    if (!formData.fecha) return false;
    if (esAutorizacion) {
      if (
        !formData.horaVencimiento ||
        !formData.fechaEvento ||
        !formData.horaEvento ||
        !formData.horaFin
      ) {
        return false;
      }
      const inicio = parseLocalDateTimeInput(formData.fechaEvento, formData.horaEvento);
      const fin = parseLocalDateTimeInput(formData.fechaEvento, formData.horaFin);
      const vencimiento = parseLocalDateTimeInput(formData.fecha, formData.horaVencimiento);
      if (!inicio || !fin || !vencimiento) return false;
      const startToday = new Date();
      startToday.setHours(0, 0, 0, 0);
      if (vencimiento < startToday) return false;
      if (validateAutorizacionVencimiento(vencimiento, inicio)) return false;
      if (validateHoraFin(inicio, fin)) return false;
      return true;
    }
    const parsed = parseLocalDateInput(formData.fecha);
    if (!parsed) return false;
    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);
    return parsed >= startToday;
  }, [
    esAutorizacion,
    formData.fecha,
    formData.horaVencimiento,
    formData.fechaEvento,
    formData.horaEvento,
    formData.horaFin,
  ]);

  const fechaEventoOk = useMemo(() => {
    if (!esAutorizacion) return true;
    if (!formData.fechaEvento || !formData.horaEvento) return false;
    return Boolean(parseLocalDateTimeInput(formData.fechaEvento, formData.horaEvento));
  }, [esAutorizacion, formData.fechaEvento, formData.horaEvento]);

  const avisoBasicoCompleto =
    formData.nombre.trim().length > 0 &&
    formData.tipo.length > 0 &&
    formData.descripcion.trim().length > 0 &&
    fechaSeleccionadaOk &&
    modoEnvio.length > 0 &&
    (!esAutorizacion ||
      (Boolean(formData.calendarioEventoId) &&
        formData.eventoNombre.trim().length > 0 &&
        formData.lugarEvento.trim().length > 0 &&
        formData.horaFin.trim().length > 0 &&
        fechaEventoOk));

  const maxUnlockedStep: DestinoStep = useMemo(() => {
    // Los pasos de destino solo se habilitan tras completar los datos previos a la vista previa.
    if (!avisoBasicoCompleto) return 1;
    if (!formData.areaId) return 1;
    if (!formData.materiaId) return 2;
    if (!formData.gradoId) return 3;
    if (!formData.cursoId) return 4;
    if (estudiantesSeleccionados.length === 0) return 5;
    return 6;
  }, [
    avisoBasicoCompleto,
    formData.areaId,
    formData.materiaId,
    formData.gradoId,
    formData.cursoId,
    estudiantesSeleccionados.length,
  ]);

  useEffect(() => {
    if (!avisoBasicoCompleto) {
      if (destinoStep !== 1) setDestinoStep(1);
      return;
    }
    if (destinoStep > maxUnlockedStep) setDestinoStep(maxUnlockedStep);
  }, [avisoBasicoCompleto, destinoStep, maxUnlockedStep]);

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

  useEffect(() => {
    if (!esAutorizacion || !isOpen) {
      setEventosCalendario([]);
      return;
    }
    const controller = new AbortController();
    const cargar = async () => {
      setCargandoEventosCalendario(true);
      try {
        const res = await fetch(
          `/api/instituciones/${institucionId}/calendario-academico/para-autorizacion`,
          { signal: controller.signal }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setEventosCalendario([]);
          return;
        }
        setEventosCalendario(Array.isArray(data.eventos) ? data.eventos : []);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setEventosCalendario([]);
      } finally {
        if (!controller.signal.aborted) setCargandoEventosCalendario(false);
      }
    };
    void cargar();
    return () => controller.abort();
  }, [esAutorizacion, isOpen, institucionId]);

  const aplicarEventoCalendario = useCallback((ev: CalendarioEvento) => {
    const inicio = new Date(ev.fechaInicio);
    const fin = new Date(ev.fechaFin);
    const horaInicio = formatTimeInputFromDate(inicio);
    const horaFinVal = formatTimeInputFromDate(fin);
    const fechaEvento = formatDateInputFromDate(inicio);
    const venc = computeAutorizacionVencimiento(
      parseLocalDateTimeInput(fechaEvento, horaInicio) ?? inicio
    );
    setFormData((prev) => ({
      ...prev,
      calendarioEventoId: String(ev.id),
      eventoNombre: ev.titulo,
      lugarEvento: ev.lugar || '',
      fechaEvento,
      horaEvento: horaInicio,
      horaFin: horaFinVal,
      fecha: formatDateInputFromDate(venc),
      horaVencimiento: formatTimeInputFromDate(venc),
    }));
    setHoraVencimientoInvalida(false);
    if (error) setError('');
  }, [error]);

  const applyTipoChange = (value: string) => {
    setFormData((prev) => {
      const next = { ...prev, tipo: value };
      if (value !== 'autorizacion') {
        next.eventoNombre = '';
        next.fechaEvento = '';
        next.horaEvento = '';
        next.horaFin = '';
        next.lugarEvento = '';
        next.horaVencimiento = '';
        next.calendarioEventoId = '';
        next.fecha = prev.tipo === 'autorizacion' ? '' : next.fecha;
      }
      return next;
    });
    setEventosCalendario([]);
    if (error) setError('');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'tipo') {
      applyTipoChange(value);
      return;
    }
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'fechaEvento' || name === 'horaEvento') {
        const synced = syncVencimientoFromEvento(
          name === 'fechaEvento' ? value : next.fechaEvento,
          name === 'horaEvento' ? value : next.horaEvento
        );
        next.fecha = synced.fecha;
        next.horaVencimiento = synced.horaVencimiento;
      }
      if (name === 'horaVencimiento' || (name === 'fecha' && prev.tipo === 'autorizacion')) {
        const evento = parseLocalDateTimeInput(next.fechaEvento, next.horaEvento);
        if (evento) {
          const expected = syncVencimientoFromEvento(next.fechaEvento, next.horaEvento);
          if (next.fecha !== expected.fecha || next.horaVencimiento !== expected.horaVencimiento) {
            setHoraVencimientoInvalida(true);
            next.fecha = expected.fecha;
            next.horaVencimiento = expected.horaVencimiento;
          } else {
            setHoraVencimientoInvalida(false);
          }
        }
      }
      return next;
    });
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
    const labels = isRecordatorioTipo(formData.tipo)
      ? getRecordatorioFormLabels(formData.tipo)
      : null;

    if (!docenteId || docenteId <= 0) {
      setError('No se identificó tu sesión de docente. Recarga la página e inténtalo otra vez.');
      return false;
    }
    if (!formData.tipo) {
      setError('Elige el tipo: tarea, examen, evento, autorización u otro.');
      return false;
    }
    if (!formData.nombre.trim()) {
      setError(labels ? `Completa ${labels.nombre.toLowerCase()}.` : 'Escribe un nombre para el recordatorio.');
      return false;
    }
    if (!formData.descripcion.trim()) {
      setError(
        labels
          ? `Completa ${labels.descripcion.toLowerCase()}.`
          : 'Agrega una descripción para que el acudiente entienda el aviso.'
      );
      return false;
    }
    if (esAutorizacion) {
      if (!formData.calendarioEventoId) {
        setError('Selecciona un evento del calendario de tu sede.');
        return false;
      }
      if (!formData.eventoNombre.trim()) {
        setError(
          labels
            ? `Completa ${labels.eventoNombre.toLowerCase()}.`
            : 'Indica a qué evento pertenece la autorización.'
        );
        return false;
      }
      if (!formData.lugarEvento.trim()) {
        setError(
          labels
            ? `Completa ${labels.lugarEvento.toLowerCase()}.`
            : 'Indica el lugar del evento.'
        );
        return false;
      }
      if (!formData.fechaEvento) {
        setError('Selecciona la fecha del evento.');
        return false;
      }
      if (!formData.horaEvento) {
        setError('Indica la hora de inicio del evento.');
        return false;
      }
      if (!formData.horaFin) {
        setError(
          labels
            ? `Indica ${labels.horaFin.toLowerCase()}.`
            : 'Indica la hora de fin del evento.'
        );
        return false;
      }
      const eventoDt = parseLocalDateTimeInput(formData.fechaEvento, formData.horaEvento);
      if (!eventoDt) {
        setError('La fecha u hora de inicio no es válida.');
        return false;
      }
      const finDt = parseLocalDateTimeInput(formData.fechaEvento, formData.horaFin);
      if (!finDt) {
        setError('La hora de fin no es válida.');
        return false;
      }
      const finError = validateHoraFin(eventoDt, finDt);
      if (finError) {
        setError(finError);
        return false;
      }
      const synced = syncVencimientoFromEvento(formData.fechaEvento, formData.horaEvento);
      if (!synced.fecha || !synced.horaVencimiento) {
        setError('No se pudo calcular el vencimiento de la autorización.');
        return false;
      }
      const vencimientoDt = parseLocalDateTimeInput(synced.fecha, synced.horaVencimiento);
      if (!vencimientoDt) {
        setError('La fecha u hora de vencimiento no es válida.');
        return false;
      }
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (vencimientoDt < hoy) {
        setError('La fecha de vencimiento no puede ser anterior a hoy.');
        return false;
      }
      const vencError = validateAutorizacionVencimiento(vencimientoDt, eventoDt);
      if (vencError) {
        setError(vencError);
        return false;
      }
    }
    if (!formData.fecha) {
      setError(
        labels
          ? `Selecciona ${labels.fecha.toLowerCase()}.`
          : esAutorizacion
            ? 'Selecciona la fecha de vencimiento de la autorización.'
            : 'Selecciona la fecha del recordatorio.'
      );
      return false;
    }
    if (!formData.gradoId || !formData.cursoId || !formData.areaId || !formData.materiaId) {
      setError('Completa los pasos de destino: área, materia, grado, curso y estudiantes.');
      setDestinoStep(
        !formData.areaId ? 1 : !formData.materiaId ? 2 : !formData.gradoId ? 3 : !formData.cursoId ? 4 : 5
      );
      return false;
    }

    if (!esAutorizacion) {
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
    if (esAutorizacion) {
      const synced = syncVencimientoFromEvento(formData.fechaEvento, formData.horaEvento);
      const local = parseLocalDateTimeInput(synced.fecha, synced.horaVencimiento);
      if (local) return local.toISOString();
    }
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

  const fechaEventoIsoParaApi = (): string => {
    const local = parseLocalDateTimeInput(formData.fechaEvento, formData.horaEvento);
    return local ? local.toISOString() : formData.fechaEvento;
  };

  const horaFinIsoParaApi = (): string => {
    const local = parseLocalDateTimeInput(formData.fechaEvento, formData.horaFin);
    return local ? local.toISOString() : '';
  };

  const enviarRecordatorio = async () => {
    setSubmitting(true);
    setError('');
    try {
      const calendarioEventoId = formData.calendarioEventoId
        ? Number.parseInt(formData.calendarioEventoId, 10)
        : null;

      if (esAutorizacion && !calendarioEventoId) {
        setError('Selecciona un evento del calendario de tu sede.');
        setSubmitting(false);
        return;
      }

      const payloadBase = {
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
        eventoNombre: esAutorizacion ? formData.eventoNombre.trim() : '',
        fechaEvento: esAutorizacion ? fechaEventoIsoParaApi() : '',
        lugarEvento: esAutorizacion ? formData.lugarEvento.trim() : '',
        horaFin: esAutorizacion ? horaFinIsoParaApi() : '',
        calendarioEventoId: esAutorizacion ? calendarioEventoId : null,
      };

      const response = await fetch('/api/recordatorios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadBase),
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
        setDestinoStep(6);
        setSubmitting(false);
        return;
      }

      resetForm();
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error al crear recordatorio:', err);
      setError('No pudimos crear el recordatorio. Revisa tu conexión e inténtalo de nuevo.');
      setDestinoStep(6);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCrearRecordatorio = async () => {
    setError('');
    if (!validarFormulario()) return;

    const destinatarios =
      estudiantesSeleccionados.length === estudiantes.length
        ? `todos los acudientes del curso (${estudiantesSeleccionados.length})`
        : `${estudiantesSeleccionados.length} acudiente${estudiantesSeleccionados.length !== 1 ? 's' : ''}`;

    const canales = modoEnvio
      .map((m) => (m === 'email' ? 'correo electrónico' : m === 'whatsapp' ? 'WhatsApp' : m))
      .join(' y ');

    const confirmed = await showConfirm({
      title: fieldLabels?.crearConfirmTitulo ?? '¿Crear recordatorio?',
      text: `Se notificará a ${destinatarios} por ${canales}.`,
      confirmButtonText: fieldLabels?.crearBoton ?? 'Crear recordatorio',
      cancelButtonText: 'Volver a revisar',
      icon: 'question',
      confirmButtonColor: '#2563eb',
    });

    if (!confirmed) return;
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
      eventoNombre: '',
      fechaEvento: '',
      horaEvento: '',
      horaFin: '',
      lugarEvento: '',
      horaVencimiento: '',
      calendarioEventoId: '',
    });
    setEventosCalendario([]);
    setHoraVencimientoInvalida(false);
    setModoEnvio(['email']);
    setEstudiantes([]);
    setEstudiantesSeleccionados([]);
    setEstudiantesError('');
    setError('');
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
    const vencimiento = esAutorizacion
      ? parseLocalDateTimeInput(formData.fecha, formData.horaVencimiento)
      : (() => {
          const fecha = parseLocalDateInput(formData.fecha);
          return fecha
            ? new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 12))
            : null;
        })();
    const fechaEvento = parseLocalDateTimeInput(formData.fechaEvento, formData.horaEvento);
    const horaFin = parseLocalDateTimeInput(formData.fechaEvento, formData.horaFin);
    return buildReminderEmailHtml({
      institucionNombre,
      docenteNombre,
      titulo: formData.nombre.trim() || 'Título del recordatorio',
      descripcion:
        formData.descripcion.trim() ||
        (esAutorizacion
          ? 'Aquí aparecerá la descripción de la autorización.'
          : 'Aquí aparecerá la descripción que escribas para el acudiente.'),
      fechaLimite: vencimiento,
      baseUrl:
        typeof window !== 'undefined' ? window.location.origin : 'https://ahoritapp.com',
      copetonSrc: COPETON_PUBLIC_PATH,
      showActionButtons: false,
      autorizacion: esAutorizacion
        ? {
            eventoNombre: formData.eventoNombre.trim() || 'Nombre del evento',
            lugarEvento: formData.lugarEvento.trim() || 'Lugar del evento',
            fechaEvento,
            horaFin,
            fechaVencimiento: vencimiento,
          }
        : null,
      autorizacionHref: esAutorizacion
        ? `${typeof window !== 'undefined' ? window.location.origin : 'https://ahoritapp.com'}/autorizar-recordatorio`
        : null,
    });
  }, [
    formData.nombre,
    formData.descripcion,
    formData.fecha,
    formData.horaVencimiento,
    formData.eventoNombre,
    formData.fechaEvento,
    formData.horaEvento,
    formData.horaFin,
    formData.lugarEvento,
    esAutorizacion,
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
  const tipoSeleccionado = formData.tipo.length > 0;
  const currentStepMeta = DESTINO_STEPS.find((s) => s.id === destinoStep)!;

  // Vista previa: basta con correo activo y datos del aviso (no exige destino/estudiantes).
  const canPreviewEmail =
    emailSelected &&
    formData.nombre.trim().length > 0 &&
    formData.tipo.length > 0 &&
    formData.descripcion.trim().length > 0 &&
    (esAutorizacion
      ? Boolean(
          formData.calendarioEventoId &&
            formData.eventoNombre.trim() &&
            formData.lugarEvento.trim() &&
            formData.fechaEvento &&
            formData.horaEvento &&
            formData.horaFin
        )
      : Boolean(formData.fecha));

  const previewBlockedHint = !emailSelected
    ? 'Activa correo electrónico para ver la vista previa.'
    : !formData.tipo
      ? 'Selecciona el tipo de recordatorio.'
      : !formData.nombre.trim()
        ? `Completa ${fieldLabels?.nombre.toLowerCase() ?? 'el nombre'}.`
        : !formData.descripcion.trim()
          ? `Completa ${fieldLabels?.descripcion.toLowerCase() ?? 'la descripción'}.`
          : esAutorizacion && !formData.calendarioEventoId
            ? 'Selecciona un evento del calendario de tu sede.'
            : esAutorizacion && !formData.eventoNombre.trim()
              ? `Completa ${fieldLabels?.eventoNombre.toLowerCase() ?? 'el nombre del evento'}.`
              : esAutorizacion && !formData.lugarEvento.trim()
                ? `Completa ${fieldLabels?.lugarEvento.toLowerCase() ?? 'el lugar del evento'}.`
                : esAutorizacion &&
                    (!formData.fechaEvento || !formData.horaEvento || !formData.horaFin)
                  ? 'Completa fecha, hora de inicio y hora de fin.'
                  : !formData.fecha
                    ? `Completa ${fieldLabels?.fecha.toLowerCase() ?? 'la fecha'}.`
                    : 'Completa los datos del aviso para ver la vista previa.';

  const canCreateRecordatorio =
    avisoBasicoCompleto &&
    !!formData.areaId &&
    !!formData.materiaId &&
    !!formData.gradoId &&
    !!formData.cursoId &&
    estudiantesSeleccionados.length > 0;

  const destinoBlockedHint = !formData.tipo
    ? 'Selecciona el tipo de recordatorio.'
    : !formData.nombre.trim()
      ? `Completa ${fieldLabels?.nombre.toLowerCase() ?? 'el nombre'}.`
      : !formData.descripcion.trim()
        ? `Completa ${fieldLabels?.descripcion.toLowerCase() ?? 'la descripción'}.`
        : esAutorizacion && !formData.calendarioEventoId
          ? 'Selecciona un evento del calendario de tu sede.'
          : esAutorizacion && !formData.eventoNombre.trim()
              ? `Completa ${fieldLabels?.eventoNombre.toLowerCase() ?? 'el evento'}.`
              : esAutorizacion && !formData.lugarEvento.trim()
                ? `Completa ${fieldLabels?.lugarEvento.toLowerCase() ?? 'el lugar del evento'}.`
                : esAutorizacion && !formData.fechaEvento
                  ? `Selecciona ${fieldLabels?.fechaEvento.toLowerCase() ?? 'la fecha del evento'}.`
                  : esAutorizacion && !formData.horaEvento
                    ? `Indica ${fieldLabels?.horaInicio.toLowerCase() ?? 'la hora de inicio'}.`
                    : esAutorizacion && !formData.horaFin
                      ? `Indica ${fieldLabels?.horaFin.toLowerCase() ?? 'la hora de fin'}.`
                      : !formData.fecha
                          ? esAutorizacion
                            ? 'Completa fecha e inicio del evento para calcular el vencimiento.'
                            : `Selecciona ${fieldLabels?.fecha.toLowerCase() ?? 'la fecha'}.`
                          : !fechaSeleccionadaOk
                            ? esAutorizacion
                              ? `Revisa llegada, fin y vencimiento (vence ${AUTORIZACION_MINUTOS_ANTES} min antes del inicio).`
                              : 'La fecha no puede ser anterior a hoy.'
                            : modoEnvio.length === 0
                              ? 'Elige al menos un método de envío.'
                              : '';

  const createBlockedHint = !avisoBasicoCompleto
    ? `Completa ${fieldLabels?.nombre.toLowerCase() ?? 'nombre'}, ${fieldLabels?.descripcion.toLowerCase() ?? 'descripción'}, ${fieldLabels?.fecha.toLowerCase() ?? 'fecha'} y método de envío arriba.`
    : !formData.areaId
      ? 'Falta el paso 1: área.'
      : !formData.materiaId
        ? 'Falta el paso 2: materia.'
        : !formData.gradoId
          ? 'Falta el paso 3: grado.'
          : !formData.cursoId
            ? 'Falta el paso 4: curso.'
            : estudiantesSeleccionados.length === 0
              ? 'Falta el paso 5: selecciona al menos un estudiante.'
              : '';

  return (
    <>
      <Modal
        open={isOpen}
        onClose={handleClose}
        title="Agregar recordatorio"
        size="xl"
        className="max-w-5xl w-full"
      >
        <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
          Primero elige el tipo de recordatorio. Si es autorización: elige el evento, completa
          nombre y descripción, revisa los datos del evento y luego el canal de envío. Después se
          habilitan los 6 pasos de destino (área, materia, grado, curso, estudiantes y crear).
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="space-y-6"
        >
          <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
            <FieldLabel
              required
              tip="El tipo define qué campos necesitas y cómo se mostrará el aviso al acudiente. Elige tarea, examen, evento, autorización u otro."
            >
              Tipo de recordatorio
            </FieldLabel>
            <div className="mt-3 flex flex-nowrap gap-1.5 sm:gap-2">
              {tiposRecordatorio.map((tipo) => (
                <TipoRecordatorioOption
                  key={tipo.value}
                  tipo={tipo.value}
                  label={tipo.label}
                  selected={formData.tipo === tipo.value}
                  onSelect={() => applyTipoChange(tipo.value)}
                />
              ))}
            </div>
            {!tipoSeleccionado ? (
              <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                Selecciona un tipo para continuar con el formulario.
              </p>
            ) : null}
          </section>

          {tipoSeleccionado && fieldLabels ? (
          <div className="space-y-6">
          <p className="text-sm font-semibold text-slate-900">{fieldLabels.seccionTitulo}</p>

          {esAutorizacion ? (
            <>
              {/* 1. Elegir evento */}
              <div className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
                <div>
                  <p className="text-sm font-semibold text-emerald-900">
                    1. Elige el evento del calendario
                  </p>
                  <p className="mt-1 text-xs text-emerald-800/80">
                    Solo aparecen eventos de tu sede. Nombre, lugar y horario los define el
                    administrador.
                  </p>
                </div>

                <div className="space-y-2">
                  {cargandoEventosCalendario ? (
                    <p className="text-sm text-slate-500">Cargando eventos del calendario…</p>
                  ) : eventosCalendario.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-emerald-300 bg-white px-3 py-4 text-sm text-slate-600">
                      No hay eventos disponibles en el calendario de tu sede. Pide al administrador
                      que cree el evento (con lugar y horario) en el calendario académico.
                    </div>
                  ) : (
                    <ul className="max-h-56 space-y-2 overflow-y-auto">
                      {eventosCalendario.map((ev) => {
                        const selected = formData.calendarioEventoId === String(ev.id);
                        const catLabel = ev.categoria
                          ? CALENDARIO_EVENTO_CATEGORIA_LABELS[ev.categoria]
                          : 'Evento';
                        return (
                          <li key={ev.id}>
                            <button
                              type="button"
                              onClick={() => aplicarEventoCalendario(ev)}
                              className={`flex w-full flex-col gap-0.5 rounded-lg border px-3 py-2.5 text-left transition ${
                                selected
                                  ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-200'
                                  : 'border-slate-200 bg-white hover:border-emerald-300'
                              }`}
                            >
                              <span className="text-sm font-semibold text-slate-800">
                                {ev.titulo}
                              </span>
                              <span className="text-xs text-slate-500">
                                {catLabel}
                                {ev.lugar ? ` · ${ev.lugar}` : ''}
                                {' · '}
                                {new Date(ev.fechaInicio).toLocaleString('es-CO', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                })}
                                {' – '}
                                {new Date(ev.fechaFin).toLocaleTimeString('es-CO', {
                                  timeStyle: 'short',
                                })}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>

              {/* 2. Nombre y descripción de la autorización */}
              {formData.calendarioEventoId ? (
                <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    2. Datos de la autorización
                  </p>
                  <div>
                    <FieldLabel required tip={fieldLabels.nombreTip}>
                      {fieldLabels.nombre}
                    </FieldLabel>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      maxLength={255}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400"
                      placeholder={fieldLabels.nombrePlaceholder}
                    />
                  </div>
                  <div>
                    <FieldLabel required tip={fieldLabels.descripcionTip}>
                      {fieldLabels.descripcion}
                    </FieldLabel>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      maxLength={1000}
                      className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400"
                      placeholder={fieldLabels.descripcionPlaceholder}
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      {formData.descripcion.length}/1000 caracteres
                    </p>
                  </div>
                </div>
              ) : (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  Selecciona un evento para continuar con el nombre y la descripción de la
                  autorización.
                </p>
              )}

              {/* 3. Resumen del evento + plazo */}
              {formData.calendarioEventoId ? (
                <div className="space-y-4">
                  <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
                    <p className="text-sm font-semibold text-emerald-900">
                      3. Datos del evento (solo lectura)
                    </p>
                    <div className="grid gap-3 rounded-lg border border-emerald-200 bg-white p-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          {fieldLabels.eventoNombre}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-800">
                          {formData.eventoNombre}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          {fieldLabels.lugarEvento}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-800">
                          {formData.lugarEvento}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          {fieldLabels.fechaEvento}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-800">
                          {formData.fechaEvento}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500">Horario</p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-800">
                          {formData.horaEvento} – {formData.horaFin}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 sm:p-5">
                    <p className="text-sm font-semibold text-violet-900">Plazo para responder</p>
                    <p className="mt-1 mb-4 text-xs leading-relaxed text-violet-700">
                      Se calcula solo según el inicio del evento ({AUTORIZACION_MINUTOS_ANTES}{' '}
                      minutos antes). No es editable.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <FieldLabel
                          required
                          tip={fieldLabels.fechaVencimientoTip(AUTORIZACION_MINUTOS_ANTES)}
                        >
                          {fieldLabels.fechaVencimiento}
                        </FieldLabel>
                        <input
                          type="date"
                          name="fecha"
                          value={formData.fecha}
                          onChange={handleInputChange}
                          required
                          min={hoyStr}
                          max={formData.fechaEvento || undefined}
                          readOnly
                          className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 ${
                            horaVencimientoInvalida
                              ? 'border-red-500 bg-red-50'
                              : 'border-violet-200 bg-white/90'
                          }`}
                        />
                      </div>
                      <div>
                        <FieldLabel
                          required
                          tip={fieldLabels.horaVencimientoTip(AUTORIZACION_MINUTOS_ANTES)}
                        >
                          {fieldLabels.horaVencimiento}
                        </FieldLabel>
                        <input
                          type="time"
                          name="horaVencimiento"
                          value={formData.horaVencimiento}
                          onChange={handleInputChange}
                          required
                          readOnly
                          className={`w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 ${
                            horaVencimientoInvalida
                              ? 'border-red-500 bg-red-50'
                              : 'border-violet-200 bg-white/90'
                          }`}
                        />
                        {horaVencimientoInvalida ? (
                          <p className="mt-1 text-xs font-medium text-red-600">
                            Debe ser {AUTORIZACION_MINUTOS_ANTES} min antes del inicio. Ya la
                            corregimos.
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <>
              <div>
                <FieldLabel required tip={fieldLabels.nombreTip}>
                  {fieldLabels.nombre}
                </FieldLabel>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  maxLength={255}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400"
                  placeholder={fieldLabels.nombrePlaceholder}
                />
              </div>

              <div>
                <FieldLabel required tip={fieldLabels.descripcionTip}>
                  {fieldLabels.descripcion}
                </FieldLabel>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  maxLength={1000}
                  className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400"
                  placeholder={fieldLabels.descripcionPlaceholder}
                />
                <p className="mt-1 text-xs text-slate-500">
                  {formData.descripcion.length}/1000 caracteres
                </p>
              </div>

              <div>
                <FieldLabel required tip={fieldLabels.fechaTip}>
                  {fieldLabels.fecha}
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
            </>
          )}

          {(!esAutorizacion || Boolean(formData.calendarioEventoId)) && (
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

            {emailSelected ? (
              <div className="mt-4 flex flex-col items-center gap-2">
                <button
                  type="button"
                  disabled={!canPreviewEmail}
                  onClick={() => {
                    if (!canPreviewEmail) return;
                    setShowEmailPreview(true);
                  }}
                  title={canPreviewEmail ? 'Abrir vista previa del correo' : previewBlockedHint}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                    canPreviewEmail
                      ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98]'
                      : 'cursor-not-allowed bg-slate-300 opacity-70'
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
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
                  Ver vista previa del correo
                </button>
                <p className="max-w-md text-center text-xs text-slate-500">
                  {canPreviewEmail
                    ? 'Así verá el acudiente el mensaje de Copetón.'
                    : previewBlockedHint}
                </p>
              </div>
            ) : null}
          </div>
          )}

          {/* Destino en pasos */}
          <section
            className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${
              avisoBasicoCompleto
                ? 'border-slate-200'
                : 'border-slate-200 opacity-70'
            }`}
            aria-disabled={!avisoBasicoCompleto}
          >
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
                    Primero completa los datos del aviso y el canal de envío (incluidos los
                    necesarios para la vista previa). Luego estos 6 pasos se habilitan en orden.
                  </p>
                </InfoTooltip>
              </div>
              {!avisoBasicoCompleto ? (
                <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  {`Completa ${fieldLabels?.nombre.toLowerCase() ?? 'nombre'}, ${fieldLabels?.descripcion.toLowerCase() ?? 'descripción'}, ${fieldLabels?.fecha.toLowerCase() ?? 'fecha'} y método de envío${
                    emailSelected ? ' (puedes usar la vista previa)' : ''
                  } antes de elegir el destino.`}
                  {destinoBlockedHint ? ` ${destinoBlockedHint}` : ''}
                </p>
              ) : (
                <p className="mt-1 text-xs text-slate-500">
                  Paso {destinoStep} de 6 · {currentStepMeta.title}
                </p>
              )}

              <ol className="mt-4 flex items-center gap-1 sm:gap-2">
                {DESTINO_STEPS.map((step, index) => {
                  const done =
                    avisoBasicoCompleto &&
                    ((step.id === 1 && !!formData.areaId) ||
                      (step.id === 2 && !!formData.materiaId) ||
                      (step.id === 3 && !!formData.gradoId) ||
                      (step.id === 4 && !!formData.cursoId) ||
                      (step.id === 5 && estudiantesSeleccionados.length > 0) ||
                      (step.id === 6 && canCreateRecordatorio));
                  const unlocked = avisoBasicoCompleto && step.id <= maxUnlockedStep;
                  const active = avisoBasicoCompleto && step.id === destinoStep;
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
                            avisoBasicoCompleto && step.id < maxUnlockedStep
                              ? 'bg-emerald-400'
                              : 'bg-slate-200'
                          }`}
                          aria-hidden
                        />
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            </div>

            <div
              className={`space-y-4 px-4 py-4 sm:px-5 ${
                avisoBasicoCompleto ? '' : 'pointer-events-none select-none'
              }`}
            >
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

              {destinoStep === 6 && (
                <div className="space-y-4">
                  <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h4 className="text-sm font-semibold text-slate-900">Resumen</h4>
                    <p className="text-sm text-slate-800">
                      <strong>{formData.nombre || '—'}</strong>
                      {formData.tipo
                        ? ` · ${tiposRecordatorio.find((t) => t.value === formData.tipo)?.label}`
                        : ''}
                    </p>
                    <p className="whitespace-pre-wrap text-sm text-slate-600">
                      {formData.descripcion || 'Sin descripción'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {[
                        selectedLabels.area && `Área: ${selectedLabels.area}`,
                        selectedLabels.materia && `Materia: ${selectedLabels.materia}`,
                        selectedLabels.grado && `Grado: ${selectedLabels.grado}`,
                        selectedLabels.curso && `Curso: ${selectedLabels.curso}`,
                        formData.fecha && `Fecha: ${formData.fecha}`,
                        `${estudiantesSeleccionados.length} estudiante${estudiantesSeleccionados.length !== 1 ? 's' : ''}`,
                        modoEnvio
                          .map((m) =>
                            m === 'email' ? 'correo' : m === 'whatsapp' ? 'WhatsApp' : m
                          )
                          .join(' + '),
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>

                  {!canCreateRecordatorio ? (
                    <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                      {createBlockedHint ||
                        'Completa todos los pasos anteriores para habilitar la creación.'}
                    </p>
                  ) : (
                    <p className="text-sm text-emerald-700">
                      Todo listo. Puedes {fieldLabels?.crearBoton.toLowerCase() ?? 'crear el recordatorio'}.
                    </p>
                  )}

                  <Button
                    type="button"
                    variant="primary"
                    className="w-full"
                    disabled={!canCreateRecordatorio || submitting}
                    title={
                      canCreateRecordatorio
                        ? fieldLabels?.crearBoton ?? 'Crear recordatorio'
                        : createBlockedHint || 'Completa los pasos anteriores'
                    }
                    onClick={() => void handleCrearRecordatorio()}
                  >
                    {submitting
                      ? fieldLabels?.crearBotonEnProgreso ?? 'Creando…'
                      : fieldLabels?.crearBoton ?? 'Crear recordatorio'}
                  </Button>
                </div>
              )}

              <div
                className={`flex items-center gap-3 border-t border-slate-100 pt-3 ${
                  destinoStep === 1
                    ? 'justify-end'
                    : destinoStep === 6
                      ? 'justify-start'
                      : 'justify-between'
                }`}
              >
                {destinoStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDestinoStep((s) => (s > 1 ? ((s - 1) as DestinoStep) : s))}
                  >
                    Anterior
                  </Button>
                ) : null}
                {destinoStep < 6 ? (
                  <Button
                    type="button"
                    variant="primary"
                    disabled={destinoStep >= maxUnlockedStep}
                    onClick={() =>
                      setDestinoStep((s) =>
                        s < 6 && s < maxUnlockedStep ? ((s + 1) as DestinoStep) : s
                      )
                    }
                  >
                    Siguiente
                  </Button>
                ) : null}
              </div>
            </div>
          </section>
          </div>
          ) : null}

          {error && <ErrorBanner title={error} />}

          <div className="flex justify-end border-t border-[var(--color-border-light)] pt-4">
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
        size="full"
        className="!h-[calc(100dvh-2rem)] !max-h-[calc(100dvh-2rem)] !max-w-[min(100%,42rem)] overflow-hidden"
        zIndex={120}
        showCloseButton={false}
        contentClassName="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4 pt-3 sm:px-5"
      >
        <div className="mb-2 flex shrink-0 justify-center">
          <Button type="button" variant="primary" onClick={() => setShowEmailPreview(false)}>
            Cerrar vista previa
          </Button>
        </div>
        <p className="mb-3 shrink-0 text-center text-sm text-slate-600">
          Así verá el acudiente el mensaje de Copetón cuando envíes por correo.
        </p>
        {esAutorizacion ? (
          <div className="mb-3 shrink-0 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-sm font-semibold text-emerald-900">
              El correo incluirá el botón &quot;Ver autorización y responder&quot;
            </p>
            <p className="mt-1 text-xs text-emerald-800">
              Ese enlace llevará al acudiente a una pantalla donde verá el detalle y podrá
              marcar Se autorizó / No autorizó.
            </p>
          </div>
        ) : null}
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-[#e8eef5]">
          <iframe
            title="Vista previa correo recordatorio"
            srcDoc={emailPreviewHtml}
            className="absolute inset-0 h-full w-full border-0 bg-[#e8eef5]"
            sandbox=""
          />
        </div>
      </Modal>
    </>
  );
}
