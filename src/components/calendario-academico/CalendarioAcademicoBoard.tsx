'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Skeleton from '@/components/ui/Skeleton';
import {
  CALENDARIO_EVENTO_CATEGORIA_LABELS,
  CALENDARIO_EVENTO_CATEGORIAS,
  CALENDARIO_TIPO_COLORS,
  CALENDARIO_TIPO_LABELS,
  CALENDARIO_TIPOS,
  type CalendarioEvento,
  type CalendarioEventoCategoria,
  type CalendarioEventoTipo,
  type CalendarioVista,
} from '@/lib/calendario-academico/tipos';
import { showConfirm, showError, showSuccess } from '@/lib/notifications';

type SedeOption = { id: number; nombre: string };

type Props = {
  institucionId: number;
  /** true = perfil institución (todas las sedes); false = admin de sede */
  consolidado?: boolean;
  className?: string;
};

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function startOfWeekMonday(d: Date): Date {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = copy.getDay(); // 0 Sun
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return copy;
}

function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function eventOverlapsDay(evento: CalendarioEvento, day: Date): boolean {
  const start = new Date(evento.fechaInicio);
  const end = new Date(evento.fechaFin);
  const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0);
  const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999);
  return start.getTime() <= dayEnd.getTime() && end.getTime() >= dayStart.getTime();
}

function formatRangeLabel(cursor: Date, vista: CalendarioVista): string {
  if (vista === 'mes') {
    return cursor.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
  }
  if (vista === 'dia') {
    return cursor.toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  const start = startOfWeekMonday(cursor);
  const end = addDays(start, 6);
  const sameMonth = start.getMonth() === end.getMonth();
  if (sameMonth) {
    return `${start.getDate()} – ${end.getDate()} de ${start.toLocaleDateString('es-CO', {
      month: 'long',
      year: 'numeric',
    })}`;
  }
  return `${start.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString(
    'es-CO',
    { day: 'numeric', month: 'short', year: 'numeric' }
  )}`;
}

function toLocalInputDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function toLocalInputTime(iso: string): string {
  const d = new Date(iso);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function buildIso(dateStr: string, timeStr: string | null, endOfDay: boolean): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  if (timeStr) {
    const [hh, mm] = timeStr.split(':').map(Number);
    return new Date(y, m - 1, d, hh, mm, 0, 0).toISOString();
  }
  if (endOfDay) return new Date(y, m - 1, d, 23, 59, 59, 999).toISOString();
  return new Date(y, m - 1, d, 0, 0, 0, 0).toISOString();
}

type FormState = {
  id?: number;
  titulo: string;
  descripcion: string;
  tipo: CalendarioEventoTipo;
  categoria: CalendarioEventoCategoria | '';
  lugar: string;
  todoElDia: boolean;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  horaFin: string;
  sedeId: string; // '' | 'principal' | number as string
};

function emptyForm(dayKey: string, defaultSedeId: string): FormState {
  return {
    titulo: '',
    descripcion: '',
    tipo: 'otro',
    categoria: '',
    lugar: '',
    todoElDia: true,
    fechaInicio: dayKey,
    fechaFin: dayKey,
    horaInicio: '08:00',
    horaFin: '09:00',
    sedeId: defaultSedeId,
  };
}

function formFromEvento(evento: CalendarioEvento): FormState {
  return {
    id: evento.id,
    titulo: evento.titulo,
    descripcion: evento.descripcion || '',
    tipo: evento.tipo,
    categoria: evento.categoria || '',
    lugar: evento.lugar || '',
    todoElDia: evento.todoElDia,
    fechaInicio: toLocalInputDate(evento.fechaInicio),
    fechaFin: toLocalInputDate(evento.fechaFin),
    horaInicio: toLocalInputTime(evento.fechaInicio),
    horaFin: toLocalInputTime(evento.fechaFin),
    sedeId:
      evento.sedeId == null ? 'principal' : String(evento.sedeId),
  };
}

function CalendarioVistaSkeleton({ vista }: { vista: CalendarioVista }) {
  if (vista === 'dia') {
    return (
      <div
        className="rounded-xl border border-slate-200 bg-white p-4"
        aria-busy="true"
        aria-label="Cargando calendario"
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-11 w-48 rounded-xl" />
        </div>
        <ul className="space-y-2">
          {Array.from({ length: 4 }, (_, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-lg border border-slate-100 px-3 py-3"
            >
              <Skeleton className="mt-1 h-3 w-3 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3 max-w-[220px]" />
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-3 w-full max-w-md" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (vista === 'semana') {
    return (
      <div
        className="overflow-hidden rounded-xl border border-slate-200 bg-white"
        aria-busy="true"
        aria-label="Cargando calendario"
      >
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {WEEKDAYS.map((d) => (
            <div key={d} className="flex flex-col items-center gap-1.5 px-2 py-2">
              <span className="text-[11px] font-semibold uppercase text-slate-400">{d}</span>
              <Skeleton className="h-7 w-7 rounded-full" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="min-h-[220px] space-y-1.5 border-r border-slate-100 p-2">
              <Skeleton className="h-5 w-full rounded" />
              <Skeleton className="h-5 w-4/5 rounded" />
              <Skeleton className="h-5 w-3/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200 bg-white"
      aria-busy="true"
      aria-label="Cargando calendario"
    >
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="px-1 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: 42 }, (_, i) => (
          <div
            key={i}
            className="min-h-[88px] space-y-1 border-b border-r border-slate-100 p-1.5 sm:min-h-[104px]"
          >
            <Skeleton className="h-6 w-6 rounded-full" />
            {i % 3 !== 0 && <Skeleton className="h-3 w-full rounded" />}
            {i % 5 === 0 && <Skeleton className="h-3 w-4/5 rounded" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CalendarioAcademicoBoard({
  institucionId,
  consolidado = false,
  className = '',
}: Props) {
  const [vista, setVista] = useState<CalendarioVista>('mes');
  const [cursor, setCursor] = useState(() => new Date());
  const [eventos, setEventos] = useState<CalendarioEvento[]>([]);
  const [sedes, setSedes] = useState<SedeOption[]>([]);
  const [sedeFiltro, setSedeFiltro] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  /** Crear desde vista día: fecha fija; solo “todo el día” o horas. */
  const [formModoDia, setFormModoDia] = useState(false);
  /** true = formularios editables; false = solo lectura (actividad existente). */
  const [formEditing, setFormEditing] = useState(true);
  const [authInfo, setAuthInfo] = useState<{
    bloqueado: boolean;
    tieneAutorizaciones: boolean;
    tieneRespuestas: boolean;
    resumen: {
      autorizaron: number;
      noAutorizaron: number;
      pendientes: number;
      total: number;
      recordatorios: number;
    };
    recordatorios: Array<{
      id: number;
      nombre: string;
      gradoNombre: string;
      cursoNombre: string;
      docenteNombre: string;
      resumen: {
        autorizaron: number;
        noAutorizaron: number;
        pendientes: number;
        total: number;
      };
    }>;
  } | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [eventoOriginal, setEventoOriginal] = useState<CalendarioEvento | null>(null);
  const [form, setForm] = useState<FormState>(() => emptyForm(toDateKey(new Date()), ''));

  const range = useMemo(() => {
    if (vista === 'mes') {
      const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
      const gridStart = startOfWeekMonday(first);
      return { from: gridStart, to: addDays(gridStart, 41) };
    }
    if (vista === 'semana') {
      const start = startOfWeekMonday(cursor);
      return { from: start, to: addDays(start, 6) };
    }
    const day = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate());
    return { from: day, to: day };
  }, [cursor, vista]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const from = new Date(range.from);
      from.setHours(0, 0, 0, 0);
      const to = new Date(range.to);
      to.setHours(23, 59, 59, 999);
      const qs = new URLSearchParams({
        from: from.toISOString(),
        to: to.toISOString(),
      });
      if (consolidado && sedeFiltro !== 'all') qs.set('sedeId', sedeFiltro);

      const res = await fetch(
        `/api/instituciones/${institucionId}/calendario-academico?${qs.toString()}`
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        await showError('Error', data.error || 'No se pudo cargar el calendario');
        return;
      }
      setEventos(Array.isArray(data.eventos) ? data.eventos : []);
      if (Array.isArray(data.sedes)) setSedes(data.sedes);
    } catch (err) {
      console.error(err);
      await showError('Error', 'No se pudo cargar el calendario');
    } finally {
      setLoading(false);
    }
  }, [institucionId, range.from, range.to, consolidado, sedeFiltro]);

  useEffect(() => {
    void load();
  }, [load]);

  const defaultSedeForCreate = useMemo(() => {
    if (!consolidado) return '';
    if (sedeFiltro !== 'all') return sedeFiltro;
    if (sedes.length === 1) return String(sedes[0].id);
    if (sedes.length === 0) return 'principal';
    return '';
  }, [consolidado, sedeFiltro, sedes]);

  const openCreate = (day: Date) => {
    const desdeVistaDia = vista === 'dia';
    setFormModoDia(desdeVistaDia);
    setFormEditing(true);
    setAuthInfo(null);
    setEventoOriginal(null);
    setForm(emptyForm(toDateKey(day), defaultSedeForCreate));
    setFormOpen(true);
  };

  const loadAutorizacionesEvento = useCallback(
    async (eventId: number) => {
      setLoadingAuth(true);
      try {
        const res = await fetch(
          `/api/instituciones/${institucionId}/calendario-academico/${eventId}/autorizaciones`
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setAuthInfo(null);
          return;
        }
        setAuthInfo({
          bloqueado: Boolean(data.bloqueado),
          tieneAutorizaciones: Boolean(data.tieneAutorizaciones),
          tieneRespuestas: Boolean(data.tieneRespuestas),
          resumen: data.resumen ?? {
            autorizaron: 0,
            noAutorizaron: 0,
            pendientes: 0,
            total: 0,
            recordatorios: 0,
          },
          recordatorios: Array.isArray(data.recordatorios) ? data.recordatorios : [],
        });
      } catch (err) {
        console.error(err);
        setAuthInfo(null);
      } finally {
        setLoadingAuth(false);
      }
    },
    [institucionId]
  );

  const openEdit = (evento: CalendarioEvento) => {
    setFormModoDia(false);
    setFormEditing(false);
    setEventoOriginal(evento);
    setForm(formFromEvento(evento));
    setAuthInfo(null);
    setFormOpen(true);
    void loadAutorizacionesEvento(evento.id);
  };

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false);
    setFormEditing(true);
    setAuthInfo(null);
    setEventoOriginal(null);
  };

  const startEditing = () => {
    if (authInfo?.bloqueado) {
      void showError(
        'Edición bloqueada',
        'Este evento ya tiene autorizaciones vinculadas y no se puede modificar.'
      );
      return;
    }
    setFormEditing(true);
  };

  const cancelEditing = () => {
    if (eventoOriginal) {
      setForm(formFromEvento(eventoOriginal));
      setFormEditing(false);
    } else {
      closeForm();
    }
  };

  const navigate = (dir: -1 | 1) => {
    setLoading(true);
    setCursor((prev) => {
      if (vista === 'mes') {
        return new Date(prev.getFullYear(), prev.getMonth() + dir, 1);
      }
      if (vista === 'semana') return addDays(prev, dir * 7);
      return addDays(prev, dir);
    });
  };

  const goToday = () => {
    setLoading(true);
    setCursor(new Date());
  };

  const handleSave = async () => {
    if (authInfo?.bloqueado) {
      await showError(
        'Edición bloqueada',
        'Este evento ya tiene autorizaciones vinculadas y no se puede modificar.'
      );
      return;
    }
    if (form.tipo === 'evento' && !form.categoria) {
      await showError('Tipo de evento', 'Selecciona una opción (salida pedagógica, izada de bandera, etc.).');
      return;
    }
    if (form.tipo === 'evento' && !form.lugar.trim()) {
      await showError('Falta el lugar', 'Indica el lugar del evento.');
      return;
    }
    if (!form.titulo.trim() && form.tipo !== 'evento') {
      await showError('Falta el título', 'Escribe un título para la actividad.');
      return;
    }
    if (consolidado && !form.sedeId) {
      await showError('Selecciona la sede', 'Indica a qué sede pertenece el evento.');
      return;
    }

    const fechaDia = formModoDia ? form.fechaInicio : null;
    const fechaInicio = buildIso(
      fechaDia ?? form.fechaInicio,
      form.todoElDia ? null : form.horaInicio,
      false
    );
    const fechaFin = buildIso(
      fechaDia ?? form.fechaFin,
      form.todoElDia ? null : form.horaFin,
      form.todoElDia
    );

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        tipo: form.tipo,
        categoria: form.tipo === 'evento' ? form.categoria : null,
        lugar: form.tipo === 'evento' ? form.lugar.trim() : null,
        todoElDia: form.todoElDia,
        fechaInicio,
        fechaFin,
        color: CALENDARIO_TIPO_COLORS[form.tipo],
      };
      if (consolidado) {
        payload.sedeId =
          form.sedeId === 'principal' || form.sedeId === ''
            ? null
            : Number.parseInt(form.sedeId, 10);
      }

      const url = form.id
        ? `/api/instituciones/${institucionId}/calendario-academico/${form.id}`
        : `/api/instituciones/${institucionId}/calendario-academico`;
      const res = await fetch(url, {
        method: form.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        await showError('No se pudo guardar', data.error || 'Intenta de nuevo.');
        return;
      }
      setFormOpen(false);
      setFormEditing(true);
      setAuthInfo(null);
      setEventoOriginal(null);
      await showSuccess(
        form.id ? 'Actividad actualizada' : 'Actividad creada',
        form.titulo.trim() ||
          (form.categoria ? CALENDARIO_EVENTO_CATEGORIA_LABELS[form.categoria] : 'Actividad')
      );
      await load();
    } catch (err) {
      console.error(err);
      await showError('Error', 'No se pudo guardar la actividad.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!form.id) return;
    if (authInfo?.bloqueado) {
      await showError(
        'Eliminación bloqueada',
        'Este evento ya tiene autorizaciones vinculadas y no se puede eliminar.'
      );
      return;
    }
    const ok = await showConfirm({
      title: '¿Eliminar actividad?',
      text: `Se eliminará “${form.titulo}” del calendario.`,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
    });
    if (!ok) return;

    setSaving(true);
    try {
      const res = await fetch(
        `/api/instituciones/${institucionId}/calendario-academico/${form.id}`,
        { method: 'DELETE' }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        await showError('No se pudo eliminar', data.error || 'Intenta de nuevo.');
        return;
      }
      setFormOpen(false);
      setFormEditing(true);
      setAuthInfo(null);
      setEventoOriginal(null);
      await showSuccess('Actividad eliminada', form.titulo);
      await load();
    } catch (err) {
      console.error(err);
      await showError('Error', 'No se pudo eliminar la actividad.');
    } finally {
      setSaving(false);
    }
  };

  const monthCells = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const start = startOfWeekMonday(first);
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [cursor]);

  const weekDays = useMemo(() => {
    const start = startOfWeekMonday(cursor);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [cursor]);

  const today = new Date();

  const renderEventChip = (evento: CalendarioEvento, compact = false) => {
    const color = evento.color || CALENDARIO_TIPO_COLORS[evento.tipo];
    return (
      <button
        key={evento.id}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          openEdit(evento);
        }}
        className={`block w-full truncate rounded px-1.5 text-left font-medium text-white hover:opacity-90 ${
          compact ? 'py-0.5 text-[10px] leading-tight' : 'py-1 text-xs'
        }`}
        style={{ backgroundColor: color }}
        title={
          consolidado && evento.sedeNombre
            ? `${evento.titulo} · ${evento.sedeNombre}`
            : evento.titulo
        }
      >
        {consolidado && evento.sedeNombre ? (
          <span className="opacity-90">{evento.sedeNombre}: </span>
        ) : null}
        {evento.titulo}
      </button>
    );
  };

  const eventsForDay = (day: Date) => eventos.filter((ev) => eventOverlapsDay(ev, day));

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => navigate(-1)}>
            ←
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={goToday}>
            Hoy
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => navigate(1)}>
            →
          </Button>
          <h3 className="ml-1 text-base font-semibold capitalize text-slate-800 sm:text-lg">
            {formatRangeLabel(cursor, vista)}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {consolidado && sedes.length > 0 && (
            <select
              value={sedeFiltro}
              onChange={(e) => {
                setLoading(true);
                setSedeFiltro(e.target.value);
              }}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-800"
              aria-label="Filtrar por sede"
            >
              <option value="all">Todas las sedes</option>
              <option value="principal">Sede principal</option>
              {sedes.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.nombre}
                </option>
              ))}
            </select>
          )}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            {(['mes', 'semana', 'dia'] as CalendarioVista[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  if (v === vista) return;
                  setLoading(true);
                  setVista(v);
                }}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  vista === v
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white'
                }`}
              >
                {v === 'dia' ? 'día' : v}
              </button>
            ))}
          </div>
          {vista !== 'dia' && (
            <Button type="button" size="sm" onClick={() => openCreate(cursor)}>
              + Actividad
            </Button>
          )}
        </div>
      </div>

      {consolidado && (
        <p className="text-xs text-slate-500">
          Vista consolidada de todas las sedes. Cada actividad muestra a qué sede pertenece.
        </p>
      )}

      {loading ? (
        <CalendarioVistaSkeleton vista={vista} />
      ) : vista === 'mes' ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="px-1 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {monthCells.map((day) => {
              const inMonth = day.getMonth() === cursor.getMonth();
              const isToday = sameDay(day, today);
              const dayEvents = eventsForDay(day);
              return (
                <div
                  key={toDateKey(day)}
                  role="button"
                  tabIndex={0}
                  onClick={() => openCreate(day)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openCreate(day);
                    }
                  }}
                  className={`min-h-[88px] cursor-pointer border-b border-r border-slate-100 p-1.5 text-left align-top transition-colors hover:bg-sky-50/60 sm:min-h-[104px] ${
                    inMonth ? 'bg-white' : 'bg-slate-50/80'
                  }`}
                >
                  <span
                    className={`mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                      isToday
                        ? 'bg-sky-600 text-white'
                        : inMonth
                          ? 'text-slate-700'
                          : 'text-slate-400'
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 3).map((ev) => renderEventChip(ev, true))}
                    {dayEvents.length > 3 && (
                      <span className="block px-1 text-[10px] font-medium text-slate-500">
                        +{dayEvents.length - 3} más
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : vista === 'semana' ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {weekDays.map((day) => (
              <div key={toDateKey(day)} className="px-2 py-2 text-center">
                <div className="text-[11px] font-semibold uppercase text-slate-500">
                  {WEEKDAYS[day.getDay() === 0 ? 6 : day.getDay() - 1]}
                </div>
                <div
                  className={`mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                    sameDay(day, today) ? 'bg-sky-600 text-white' : 'text-slate-800'
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {weekDays.map((day) => (
              <div
                key={toDateKey(day)}
                role="button"
                tabIndex={0}
                onClick={() => openCreate(day)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openCreate(day);
                  }
                }}
                className="min-h-[220px] cursor-pointer border-r border-slate-100 p-2 text-left hover:bg-sky-50/50"
              >
                <div className="space-y-1">
                  {eventsForDay(day).map((ev) => renderEventChip(ev))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              {eventsForDay(cursor).length === 0
                ? 'No hay actividades este día.'
                : `${eventsForDay(cursor).length} actividad(es)`}
            </p>
            <button
              type="button"
              onClick={() => openCreate(cursor)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-sky-600/25 transition hover:bg-sky-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.25}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </span>
              Agregar a este día
            </button>
          </div>
          <ul className="space-y-2">
            {eventsForDay(cursor).map((ev) => (
              <li key={ev.id}>
                <button
                  type="button"
                  onClick={() => openEdit(ev)}
                  className="flex w-full items-start gap-3 rounded-lg border border-slate-200 px-3 py-3 text-left hover:border-sky-300 hover:bg-sky-50/40"
                >
                  <span
                    className="mt-0.5 h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: ev.color || CALENDARIO_TIPO_COLORS[ev.tipo] }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800">{ev.titulo}</p>
                    <p className="text-xs text-slate-500">
                      {ev.categoria
                        ? CALENDARIO_EVENTO_CATEGORIA_LABELS[ev.categoria]
                        : CALENDARIO_TIPO_LABELS[ev.tipo]}
                      {consolidado && ev.sedeNombre ? ` · ${ev.sedeNombre}` : ''}
                      {ev.todoElDia
                        ? ' · Todo el día'
                        : ` · ${toLocalInputTime(ev.fechaInicio)} – ${toLocalInputTime(ev.fechaFin)}`}
                    </p>
                    {ev.descripcion ? (
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{ev.descripcion}</p>
                    ) : null}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {CALENDARIO_TIPOS.map((tipo) => (
          <span
            key={tipo}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: CALENDARIO_TIPO_COLORS[tipo] }}
            />
            {CALENDARIO_TIPO_LABELS[tipo]}
          </span>
        ))}
      </div>

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={
          !form.id
            ? 'Nueva actividad'
            : formEditing
              ? 'Editar actividad'
              : 'Detalle de la actividad'
        }
        size="lg"
        className="max-w-lg"
        zIndex={140}
      >
        {form.id && !formEditing ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{form.titulo || 'Actividad'}</h3>
              <p className="mt-1 text-sm text-slate-600">
                {CALENDARIO_TIPO_LABELS[form.tipo]}
                {form.categoria
                  ? ` · ${CALENDARIO_EVENTO_CATEGORIA_LABELS[form.categoria]}`
                  : ''}
              </p>
            </div>

            <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
              {form.tipo === 'evento' && form.lugar ? (
                <div>
                  <p className="text-xs font-medium text-slate-500">Lugar</p>
                  <p className="text-sm font-semibold text-slate-800">{form.lugar}</p>
                </div>
              ) : null}
              <div>
                <p className="text-xs font-medium text-slate-500">Inicio</p>
                <p className="text-sm font-semibold text-slate-800">
                  {form.fechaInicio}
                  {!form.todoElDia ? ` · ${form.horaInicio}` : ' · Todo el día'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Fin</p>
                <p className="text-sm font-semibold text-slate-800">
                  {form.fechaFin}
                  {!form.todoElDia ? ` · ${form.horaFin}` : ' · Todo el día'}
                </p>
              </div>
              {form.descripcion ? (
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium text-slate-500">Descripción</p>
                  <p className="whitespace-pre-wrap text-sm text-slate-800">{form.descripcion}</p>
                </div>
              ) : null}
            </div>

            {loadingAuth ? (
              <div
                className="space-y-3 rounded-xl border-2 border-emerald-100 bg-emerald-50/40 p-4"
                aria-busy="true"
                aria-label="Cargando autorizaciones"
              >
                <Skeleton className="h-4 w-48" />
                <div className="rounded-lg border border-emerald-100 bg-white/70 px-3 py-3">
                  <Skeleton className="h-4 w-full max-w-sm" />
                </div>
                <ul className="space-y-2">
                  {[0, 1].map((i) => (
                    <li
                      key={i}
                      className="space-y-2 rounded-lg border border-emerald-50 bg-white px-3 py-2"
                    >
                      <Skeleton className="h-4 w-2/3 max-w-[200px]" />
                      <Skeleton className="h-3 w-40" />
                      <Skeleton className="h-3 w-full max-w-xs" />
                    </li>
                  ))}
                </ul>
              </div>
            ) : authInfo?.tieneAutorizaciones ? (
              <div className="space-y-3 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-4">
                <p className="text-sm font-semibold text-emerald-900">
                  Resumen de autorizaciones
                </p>
                <div className="rounded-lg border border-emerald-200 bg-white/70 px-3 py-2 text-sm text-emerald-900">
                  <span className="font-semibold">{authInfo.resumen.autorizaron}</span> autorizaron
                  · <span className="font-semibold">{authInfo.resumen.noAutorizaron}</span> no
                  autorizaron ·{' '}
                  <span className="font-semibold">{authInfo.resumen.pendientes}</span> pendientes
                  {authInfo.resumen.recordatorios > 0 ? (
                    <>
                      {' '}
                      ·{' '}
                      <span className="font-semibold">{authInfo.resumen.recordatorios}</span>{' '}
                      recordatorio(s)
                    </>
                  ) : null}
                </div>
                <ul className="max-h-40 space-y-2 overflow-y-auto">
                  {authInfo.recordatorios.map((rec) => (
                    <li
                      key={rec.id}
                      className="rounded-lg border border-emerald-100 bg-white px-3 py-2 text-sm"
                    >
                      <p className="font-semibold text-slate-800">{rec.nombre}</p>
                      <p className="text-xs text-slate-500">
                        {rec.gradoNombre} · {rec.cursoNombre} · {rec.docenteNombre}
                      </p>
                      <p className="mt-1 text-xs text-emerald-800">
                        {rec.resumen.autorizaron} autorizaron · {rec.resumen.noAutorizaron} no
                        autorizaron · {rec.resumen.pendientes} pendientes
                      </p>
                    </li>
                  ))}
                </ul>
                {authInfo.bloqueado ? (
                  <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    Este evento tiene autorizaciones en curso. Por seguridad no se puede editar ni
                    eliminar.
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500">
                Aún no hay autorizaciones vinculadas a este evento.
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={saving || Boolean(authInfo?.bloqueado)}
                onClick={() => void handleDelete()}
                title={
                  authInfo?.bloqueado
                    ? 'Bloqueado: hay autorizaciones vinculadas'
                    : 'Eliminar actividad'
                }
              >
                Eliminar
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" disabled={saving} onClick={closeForm}>
                  Cerrar
                </Button>
                <Button
                  type="button"
                  disabled={saving || Boolean(authInfo?.bloqueado) || loadingAuth}
                  onClick={startEditing}
                  title={
                    authInfo?.bloqueado
                      ? 'Bloqueado: hay autorizaciones vinculadas'
                      : 'Habilitar edición'
                  }
                >
                  Editar
                </Button>
              </div>
            </div>
          </div>
        ) : (
        <div className="space-y-4">
          {form.id && authInfo?.bloqueado ? (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              No se puede guardar: el evento quedó bloqueado por autorizaciones vinculadas.
            </p>
          ) : null}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Título</label>
            <input
              type="text"
              value={form.titulo}
              onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Ej. Inicio del primer periodo"
              maxLength={255}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Tipo</label>
            <select
              value={form.tipo}
              onChange={(e) => {
                const tipo = e.target.value as CalendarioEventoTipo;
                setForm((f) => ({
                  ...f,
                  tipo,
                  categoria: tipo === 'evento' ? f.categoria || '' : '',
                  lugar: tipo === 'evento' ? f.lugar : '',
                }));
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {CALENDARIO_TIPOS.map((t) => (
                <option key={t} value={t}>
                  {CALENDARIO_TIPO_LABELS[t]}
                </option>
              ))}
            </select>
          </div>

          {form.tipo === 'evento' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                ¿Qué tipo de evento? <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CALENDARIO_EVENTO_CATEGORIAS.map((cat) => {
                  const selected = form.categoria === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          categoria: cat,
                          titulo:
                            !f.titulo.trim() ||
                            Object.values(CALENDARIO_EVENTO_CATEGORIA_LABELS).includes(f.titulo)
                              ? CALENDARIO_EVENTO_CATEGORIA_LABELS[cat]
                              : f.titulo,
                        }))
                      }
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        selected
                          ? 'border-sky-600 bg-sky-600 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50'
                      }`}
                    >
                      {CALENDARIO_EVENTO_CATEGORIA_LABELS[cat]}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Lugar <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.lugar}
                  onChange={(e) => setForm((f) => ({ ...f, lugar: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Ej. Parque principal, patio central…"
                  maxLength={255}
                  required
                />
              </div>
            </div>
          )}

          {consolidado && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Sede</label>
              <select
                value={form.sedeId}
                onChange={(e) => setForm((f) => ({ ...f, sedeId: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Seleccionar…</option>
                {sedes.length === 0 && <option value="principal">Sede principal</option>}
                {sedes.map((s) => (
                  <option key={s.id} value={String(s.id)}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.todoElDia}
              onChange={(e) => {
                const todoElDia = e.target.checked;
                setForm((f) => ({
                  ...f,
                  todoElDia,
                  ...(formModoDia
                    ? { fechaInicio: f.fechaInicio, fechaFin: f.fechaInicio }
                    : {}),
                }));
              }}
              className="rounded border-slate-300"
            />
            Todo el día
          </label>

          {formModoDia ? (
            <div className="space-y-3">
              <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                Fecha:{' '}
                <span className="font-medium text-slate-800">
                  {parseDateKey(form.fechaInicio).toLocaleDateString('es-CO', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </p>
              {!form.todoElDia && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Hora inicio
                    </label>
                    <input
                      type="time"
                      value={form.horaInicio}
                      onChange={(e) => setForm((f) => ({ ...f, horaInicio: e.target.value }))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Hora fin
                    </label>
                    <input
                      type="time"
                      value={form.horaFin}
                      onChange={(e) => setForm((f) => ({ ...f, horaFin: e.target.value }))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Inicio</label>
                <input
                  type="date"
                  value={form.fechaInicio}
                  onChange={(e) => setForm((f) => ({ ...f, fechaInicio: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                {!form.todoElDia && (
                  <input
                    type="time"
                    value={form.horaInicio}
                    onChange={(e) => setForm((f) => ({ ...f, horaInicio: e.target.value }))}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Fin</label>
                <input
                  type="date"
                  value={form.fechaFin}
                  onChange={(e) => setForm((f) => ({ ...f, fechaFin: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                {!form.todoElDia && (
                  <input
                    type="time"
                    value={form.horaFin}
                    onChange={(e) => setForm((f) => ({ ...f, horaFin: e.target.value }))}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                )}
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Descripción (opcional)
            </label>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Notas adicionales…"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4">
            {form.id ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={saving || Boolean(authInfo?.bloqueado)}
                onClick={() => void handleDelete()}
              >
                Eliminar
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => (form.id ? cancelEditing() : closeForm())}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                disabled={saving || Boolean(authInfo?.bloqueado)}
                onClick={() => void handleSave()}
              >
                {saving ? 'Guardando…' : form.id ? 'Guardar cambios' : 'Crear actividad'}
              </Button>
            </div>
          </div>
        </div>
        )}
      </Modal>
    </div>
  );
}
