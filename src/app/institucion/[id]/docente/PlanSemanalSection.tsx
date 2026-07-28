'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { isPdfMime, SILABUS_MAX_BYTES } from '@/lib/security/silabus-upload';
import { showConfirm, showError, showSuccess } from '@/lib/notifications';
import {
  EMPTY_PLAN_SEMANAL_FORM,
  parsePlanSemanalFormFields,
  PLAN_SEMANAL_FIELD_LABELS,
  type PlanSemanalClase,
  type PlanSemanalFormFields,
  validatePlanSemanalForm,
} from '@/lib/plan-semanal/form-html';

export type PlanSemanalItem = {
  id: number;
  materia_id: number;
  grado_id: number;
  curso_id: number;
  periodo_academico: string;
  semana: string;
  fecha_inicio: string;
  fecha_final: string;
  origen: string;
  contenido_html: string | null;
  contenido_json: unknown;
  nombre_archivo: string | null;
  mime_type: string | null;
  tamano_bytes: number | null;
  has_file: boolean;
  updated_at: string;
  materia: {
    id: number;
    nombre: string;
    area?: { id: number; nombre: string } | null;
  };
  grado: { id: number; nombre: string; nivel: string };
  curso: { id: number; nombre: string; jornada?: string | null };
};

type AsignacionSlot = {
  key: string;
  materia_id: number;
  grado_id: number;
  curso_id: number;
  materiaNombre: string;
  areaNombre?: string;
  gradoNombre: string;
  gradoNivel: string;
  cursoNombre: string;
  cursoJornada?: string | null;
};

type Props = {
  asignaciones: Array<{
    materia: { id?: number; nombre: string; area?: { id: number; nombre: string } };
    grado: { id?: number; nombre: string; nivel: string };
    curso: { id?: number; nombre: string; jornada?: string | null };
  }>;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function IconEye({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function IconTrash({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function IconEdit({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function IconUpload({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function IconSpinner({ className = 'w-4 h-4 animate-spin' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function IconPlus({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

type TextAreaKey =
  | 'unidad_eje'
  | 'tema_semana'
  | 'logro_objetivo'
  | 'competencias'
  | 'estandar_dba'
  | 'evidencia_esperada'
  | 'tarea_casa'
  | 'medio_entrega'
  | 'criterios_evaluacion'
  | 'actividades_no_desarrolladas'
  | 'ajustes_realizados'
  | 'estudiantes_seguimiento'
  | 'estrategias_apoyo'
  | 'evaluacion_realizada'
  | 'instrumento_utilizado'
  | 'resultados_generales'
  | 'dificultades'
  | 'acciones_siguiente_semana'
  | 'info_familias'
  | 'materiales_requeridos'
  | 'recomendaciones_casa'
  | 'evidencias_notas';

const PLANEACION_KEYS: TextAreaKey[] = [
  'unidad_eje',
  'tema_semana',
  'logro_objetivo',
  'competencias',
  'estandar_dba',
  'evidencia_esperada',
];
const TRABAJO_KEYS: TextAreaKey[] = ['tarea_casa', 'medio_entrega', 'criterios_evaluacion'];
const SEGUIMIENTO_KEYS: TextAreaKey[] = [
  'actividades_no_desarrolladas',
  'ajustes_realizados',
  'estudiantes_seguimiento',
  'estrategias_apoyo',
];
const EVAL_KEYS: TextAreaKey[] = [
  'evaluacion_realizada',
  'instrumento_utilizado',
  'resultados_generales',
  'dificultades',
  'acciones_siguiente_semana',
];
const COMUNICACION_KEYS: TextAreaKey[] = [
  'info_familias',
  'materiales_requeridos',
  'recomendaciones_casa',
  'evidencias_notas',
];

const FORM_STEPS_BASIC = [
  { id: 'info', title: 'Información general', description: 'Periodo, semana y fechas' },
  { id: 'planeacion', title: 'Planeación', description: 'Tema, logros y competencias' },
  { id: 'clases', title: 'Desarrollo de clases', description: 'Actividades de la semana' },
  { id: 'trabajo', title: 'Trabajo independiente', description: 'Tareas y entregas' },
  { id: 'seguimiento', title: 'Seguimiento', description: 'Ajustes y apoyo' },
  { id: 'cierre', title: 'Evaluación y familias', description: 'Resultados y comunicación' },
] as const;

const FORM_STEPS_PDF = [
  { id: 'info', title: 'Información general', description: 'Periodo, semana y fechas' },
  { id: 'archivo', title: 'Adjuntar PDF', description: 'Sube el plan semanal' },
] as const;

export default function DocentePlanSemanalSection({ asignaciones }: Props) {
  const [items, setItems] = useState<PlanSemanalItem[]>([]);
  const [allowsPdf, setAllowsPdf] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [composerError, setComposerError] = useState('');
  const [sectionOpen, setSectionOpen] = useState(true);
  const [selectedKey, setSelectedKey] = useState('');
  const [composerOpen, setComposerOpen] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [editingItem, setEditingItem] = useState<PlanSemanalItem | null>(null);
  const [formFields, setFormFields] = useState<PlanSemanalFormFields>({
    ...EMPTY_PLAN_SEMANAL_FORM,
  });
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [viewerLoadingId, setViewerLoadingId] = useState<number | null>(null);
  const [htmlViewer, setHtmlViewer] = useState<{
    id: number;
    title: string;
    html: string;
    pdfUrl: string | null;
  } | null>(null);
  const [htmlDraft, setHtmlDraft] = useState('');
  const [editingHtml, setEditingHtml] = useState(false);
  const [savingHtml, setSavingHtml] = useState(false);
  const [pdfViewer, setPdfViewer] = useState<{
    url: string;
    nombre: string;
    mime: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const slots = useMemo(() => {
    const map = new Map<string, AsignacionSlot>();
    for (const a of asignaciones) {
      const materiaId = a.materia.id;
      const gradoId = a.grado.id;
      const cursoId = a.curso.id;
      if (!materiaId || !gradoId || !cursoId) continue;
      const key = `${cursoId}:${materiaId}`;
      if (map.has(key)) continue;
      map.set(key, {
        key,
        materia_id: materiaId,
        grado_id: gradoId,
        curso_id: cursoId,
        materiaNombre: a.materia.nombre,
        areaNombre: a.materia.area?.nombre,
        gradoNombre: a.grado.nombre,
        gradoNivel: a.grado.nivel,
        cursoNombre: a.curso.nombre,
        cursoJornada: a.curso.jornada,
      });
    }
    return [...map.values()].sort((a, b) =>
      `${a.gradoNombre}-${a.cursoNombre}-${a.materiaNombre}`.localeCompare(
        `${b.gradoNombre}-${b.cursoNombre}-${b.materiaNombre}`,
        'es'
      )
    );
  }, [asignaciones]);

  const selectedSlot = slots.find((s) => s.key === selectedKey) ?? null;

  const itemsForSlot = useMemo(() => {
    if (!selectedSlot) return [];
    return items.filter(
      (i) => i.curso_id === selectedSlot.curso_id && i.materia_id === selectedSlot.materia_id
    );
  }, [items, selectedSlot]);

  const isBusyDeleting = deletingId != null;

  const resetComposer = () => {
    setComposerOpen(false);
    setEditingItem(null);
    setFormStep(0);
    setComposerError('');
    setFormFields({
      ...EMPTY_PLAN_SEMANAL_FORM,
      clases: EMPTY_PLAN_SEMANAL_FORM.clases.map((c) => ({ ...c })),
    });
    setPendingFile(null);
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formSteps = allowsPdf ? FORM_STEPS_PDF : FORM_STEPS_BASIC;
  const isLastStep = formStep >= formSteps.length - 1;

  const validateCurrentStep = (): string | null => {
    const stepId = formSteps[formStep]?.id;
    if (stepId === 'info') {
      if (!formFields.periodo_academico.trim()) return 'Completa el periodo académico';
      if (!formFields.semana.trim()) return 'Completa el número o nombre de la semana';
      if (!formFields.fecha_inicio.trim()) return 'Completa la fecha de inicio';
      if (!formFields.fecha_final.trim()) return 'Completa la fecha final';
      const start = Date.parse(formFields.fecha_inicio);
      const end = Date.parse(formFields.fecha_final);
      if (Number.isNaN(start) || Number.isNaN(end)) {
        return 'Las fechas de inicio y final deben ser válidas';
      }
      if (end < start) {
        return 'La fecha final no puede ser anterior a la fecha de inicio';
      }
      return null;
    }
    if (stepId === 'planeacion') {
      if (!formFields.tema_semana.trim()) return 'Completa el tema de la semana';
      if (!formFields.logro_objetivo.trim()) {
        return 'Completa el logro u objetivo de aprendizaje';
      }
      return null;
    }
    if (stepId === 'clases') {
      const hasClase = formFields.clases.some(
        (c) =>
          c.tema_especifico.trim() ||
          c.actividades.trim() ||
          c.recursos.trim() ||
          c.tiempo.trim() ||
          c.fecha.trim()
      );
      if (!hasClase) return 'Completa al menos una clase en el desarrollo semanal';
      return null;
    }
    if (stepId === 'archivo') {
      if (!pendingFile) return 'Selecciona un archivo PDF';
      return null;
    }
    return null;
  };

  const goNextStep = () => {
    const err = validateCurrentStep();
    if (err) {
      setComposerError(err);
      return;
    }
    setComposerError('');
    setFormStep((s) => Math.min(s + 1, formSteps.length - 1));
  };

  const goPrevStep = () => {
    setComposerError('');
    setFormStep((s) => Math.max(0, s - 1));
  };

  const loadPlans = async (slot?: AsignacionSlot | null) => {
    setLoading(true);
    setError('');
    try {
      const qs =
        slot != null
          ? `?curso_id=${slot.curso_id}&materia_id=${slot.materia_id}`
          : '';
      const res = await fetch(`/api/docentes/plan-semanal${qs}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No se pudieron cargar los planes semanales');
        setItems([]);
        return;
      }
      setAllowsPdf(Boolean(data.meta?.allows_pdf));
      setItems(data.data || []);
    } catch {
      setError('Error de conexión al cargar planes semanales');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPlans();
  }, []);

  useEffect(() => {
    if (slots.length > 0 && !selectedKey) {
      setSelectedKey(slots[0].key);
    }
  }, [slots, selectedKey]);

  useEffect(() => {
    if (!selectedSlot) return;
    void loadPlans(selectedSlot);
    resetComposer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey]);

  const openNew = () => {
    setEditingItem(null);
    setFormFields({
      ...EMPTY_PLAN_SEMANAL_FORM,
      clases: EMPTY_PLAN_SEMANAL_FORM.clases.map((c) => ({ ...c })),
    });
    setPendingFile(null);
    setFormStep(0);
    setComposerError('');
    setComposerOpen(true);
    setError('');
  };

  const openEditForm = (item: PlanSemanalItem) => {
    setEditingItem(item);
    if (item.contenido_json) {
      setFormFields(parsePlanSemanalFormFields(item.contenido_json));
    } else {
      setFormFields({
        ...EMPTY_PLAN_SEMANAL_FORM,
        periodo_academico: item.periodo_academico,
        semana: item.semana,
        fecha_inicio: item.fecha_inicio,
        fecha_final: item.fecha_final,
        clases: EMPTY_PLAN_SEMANAL_FORM.clases.map((c) => ({ ...c })),
      });
    }
    setPendingFile(null);
    setFormStep(0);
    setComposerError('');
    setComposerOpen(true);
    setError('');
  };

  const openReplacePdf = (item: PlanSemanalItem) => {
    setEditingItem(item);
    setFormFields({
      ...EMPTY_PLAN_SEMANAL_FORM,
      periodo_academico: item.periodo_academico,
      semana: item.semana,
      fecha_inicio: item.fecha_inicio,
      fecha_final: item.fecha_final,
      clases: EMPTY_PLAN_SEMANAL_FORM.clases.map((c) => ({ ...c })),
    });
    setPendingFile(null);
    setFormStep(0);
    setComposerError('');
    setComposerOpen(true);
    setError('');
  };

  const updateField = <K extends keyof PlanSemanalFormFields>(
    key: K,
    value: PlanSemanalFormFields[K]
  ) => {
    setFormFields((prev) => ({ ...prev, [key]: value }));
  };

  const updateClase = (index: number, patch: Partial<PlanSemanalClase>) => {
    setFormFields((prev) => ({
      ...prev,
      clases: prev.clases.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    }));
  };

  const selectPdfFile = (file: File | null | undefined) => {
    if (!file) return;
    const name = file.name.toLowerCase();
    const isPdf = name.endsWith('.pdf') || file.type === 'application/pdf';
    if (!isPdf) {
      setComposerError('Solo se permiten archivos PDF');
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    if (file.size > SILABUS_MAX_BYTES) {
      setComposerError('El archivo supera el tamaño máximo (10 MB)');
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setComposerError('');
    setPendingFile(file);
  };

  const saveForm = async () => {
    if (!selectedSlot) return;
    const stepErr = validateCurrentStep();
    if (stepErr) {
      setComposerError(stepErr);
      return;
    }
    const validation = validatePlanSemanalForm(formFields);
    if (validation) {
      setComposerError(validation);
      return;
    }
    setSaving(true);
    setComposerError('');
    try {
      const res = editingItem
        ? await fetch(`/api/docentes/plan-semanal/${editingItem.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ campos: formFields }),
          })
        : await fetch('/api/docentes/plan-semanal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              materia_id: selectedSlot.materia_id,
              grado_id: selectedSlot.grado_id,
              curso_id: selectedSlot.curso_id,
              campos: formFields,
            }),
          });
      const data = await res.json();
      if (!res.ok) {
        setComposerError(data.error || 'No se pudo guardar el plan semanal');
        return;
      }
      await showSuccess(
        editingItem ? 'Plan actualizado' : 'Plan guardado',
        'El plan semanal quedó registrado y disponible en vista web.'
      );
      resetComposer();
      await loadPlans(selectedSlot);
    } catch {
      setComposerError('Error de conexión al guardar el plan');
    } finally {
      setSaving(false);
    }
  };

  const savePdf = async () => {
    if (!selectedSlot) return;
    const stepErr = validateCurrentStep();
    if (stepErr) {
      setComposerError(stepErr);
      return;
    }
    if (!pendingFile) return;
    setSaving(true);
    setComposerError('');
    try {
      const form = new FormData();
      form.append('materia_id', String(selectedSlot.materia_id));
      form.append('grado_id', String(selectedSlot.grado_id));
      form.append('curso_id', String(selectedSlot.curso_id));
      form.append('periodo_academico', formFields.periodo_academico);
      form.append('semana', formFields.semana);
      form.append('fecha_inicio', formFields.fecha_inicio);
      form.append('fecha_final', formFields.fecha_final);
      form.append('archivo', pendingFile);

      const res = await fetch('/api/docentes/plan-semanal', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setComposerError(data.error || 'No se pudo subir el plan');
        return;
      }
      const next = data.data as PlanSemanalItem;
      await showSuccess(
        editingItem ? 'Plan actualizado' : 'Plan cargado',
        'Se extrajo el texto del PDF. Puedes revisarlo y editarlo en formato web.'
      );
      resetComposer();
      await loadPlans(selectedSlot);
      if (next.contenido_html) {
        setHtmlViewer({
          id: next.id,
          title: `Semana ${next.semana} · ${next.periodo_academico}`,
          html: next.contenido_html,
          pdfUrl: next.has_file ? `/api/docentes/plan-semanal/${next.id}/file` : null,
        });
        setHtmlDraft(next.contenido_html);
        setEditingHtml(false);
      }
    } catch {
      setComposerError('Error de conexión al subir el plan');
    } finally {
      setSaving(false);
    }
  };

  const openHtmlViewer = async (item: PlanSemanalItem) => {
    if (deletingId === item.id) return;
    setViewerLoadingId(item.id);
    setError('');
    try {
      const res = await fetch(`/api/docentes/plan-semanal/${item.id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No se pudo abrir el plan');
        return;
      }
      const html = data.data?.contenido_html || item.contenido_html || '';
      if (!html) {
        setError('Este plan aún no tiene contenido web');
        return;
      }
      setHtmlViewer({
        id: item.id,
        title: `Semana ${item.semana} · ${item.periodo_academico}`,
        html,
        pdfUrl: data.data?.url || (item.has_file ? `/api/docentes/plan-semanal/${item.id}/file` : null),
      });
      setHtmlDraft(html);
      setEditingHtml(false);
    } catch {
      setError('Error de conexión al abrir el plan');
    } finally {
      setViewerLoadingId(null);
    }
  };

  const openPdfViewer = async (item: PlanSemanalItem) => {
    if (!item.has_file || deletingId === item.id) return;
    setViewerLoadingId(item.id);
    setError('');
    try {
      const res = await fetch(`/api/docentes/plan-semanal/${item.id}`);
      const data = await res.json();
      if (!res.ok || !data.data?.url) {
        setError(data.error || 'No se pudo abrir el PDF');
        return;
      }
      setPdfViewer({
        url: data.data.url,
        nombre: data.data.nombre_archivo || 'plan-semanal.pdf',
        mime: data.data.mime_type || 'application/pdf',
      });
    } catch {
      setError('Error de conexión al abrir el PDF');
    } finally {
      setViewerLoadingId(null);
    }
  };

  const saveHtml = async () => {
    if (!htmlViewer) return;
    const trimmed = htmlDraft.trim();
    if (!trimmed) {
      setError('El contenido HTML no puede quedar vacío');
      return;
    }
    setSavingHtml(true);
    setError('');
    try {
      const res = await fetch(`/api/docentes/plan-semanal/${htmlViewer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido_html: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No se pudo guardar el contenido');
        return;
      }
      setHtmlViewer((prev) => (prev ? { ...prev, html: trimmed } : prev));
      setItems((prev) =>
        prev.map((p) => (p.id === htmlViewer.id ? { ...p, contenido_html: trimmed } : p))
      );
      setEditingHtml(false);
      await showSuccess('Contenido guardado', 'La versión web del plan se actualizó.');
    } catch {
      setError('Error de conexión al guardar el contenido');
    } finally {
      setSavingHtml(false);
    }
  };

  const deletePlan = async (item: PlanSemanalItem) => {
    const confirmed = await showConfirm({
      title: '¿Eliminar plan semanal?',
      html: `
        <div style="text-align: left; margin-top: 0.5rem;">
          <p style="margin-bottom: 0.75rem; color: #334155; font-size: 0.875rem;">
            Se eliminará el plan de
            <strong>${escapeHtml(`Semana ${item.semana} · ${item.periodo_academico}`)}</strong>
            (${escapeHtml(`${item.grado.nombre} · ${item.curso.nombre} · ${item.materia.nombre}`)}).
          </p>
          <p style="margin: 0; color: #b91c1c; font-size: 0.8125rem;">
            Esta acción no se puede deshacer.
          </p>
        </div>
      `,
      icon: 'warning',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
    });
    if (!confirmed) return;

    setDeletingId(item.id);
    setHtmlViewer(null);
    setPdfViewer(null);
    if (editingItem?.id === item.id) resetComposer();
    setError('');
    try {
      const res = await fetch(`/api/docentes/plan-semanal/${item.id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data.error || 'No se pudo eliminar el plan';
        setError(message);
        await showError('No se pudo eliminar', message);
        return;
      }
      setItems((prev) => prev.filter((p) => p.id !== item.id));
      await showSuccess('Plan eliminado', 'Se eliminó correctamente.');
    } catch {
      setError('Error de conexión al eliminar el plan');
      await showError('Sin conexión', 'No se pudo conectar con el servidor.');
    } finally {
      setDeletingId(null);
    }
  };

  const renderTextFields = (keys: TextAreaKey[], rows = 3) =>
    keys.map((key) => (
      <div key={key}>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {PLAN_SEMANAL_FIELD_LABELS[key]}
          {key === 'tema_semana' || key === 'logro_objetivo' ? (
            <span className="text-red-600"> *</span>
          ) : null}
        </label>
        <textarea
          value={formFields[key]}
          onChange={(e) => updateField(key, e.target.value)}
          rows={rows}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
        />
      </div>
    ));

  if (slots.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mb-8 overflow-hidden">
        <button
          type="button"
          onClick={() => setSectionOpen((o) => !o)}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50/80 transition-colors"
          aria-expanded={sectionOpen}
        >
          <h2 className="text-xl font-semibold text-slate-800">Plan de clases semanal</h2>
        </button>
        {sectionOpen && (
          <div className="px-6 pb-6 border-t border-slate-100">
            <p className="pt-4 text-sm text-slate-600">
              Cuando tengas cursos asignados podrás registrar el plan semanal de cada materia aquí.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mb-8 overflow-hidden">
        <button
          type="button"
          onClick={() => setSectionOpen((o) => !o)}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50/80 transition-colors"
          aria-expanded={sectionOpen}
        >
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Plan de clases semanal</h2>
            {!sectionOpen && (
              <p className="mt-0.5 text-sm text-slate-500">
                {allowsPdf
                  ? 'Plan Plus · PDF + versión web'
                  : 'Plan Básico · formulario detallado'}
              </p>
            )}
          </div>
          <svg
            className={`w-5 h-5 text-slate-500 transition-transform flex-shrink-0 ${sectionOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {sectionOpen && (
          <div className="px-6 pb-6 border-t border-slate-100">
            <p className="mt-4 mb-6 text-sm text-slate-600">
              {allowsPdf ? (
                <>
                  Plan Plus: adjunta el plan semanal en{' '}
                  <span className="font-medium text-slate-800">PDF</span>, lo convertimos a formato
                  web editable.
                </>
              ) : (
                <>
                  Plan Básico: completa el{' '}
                  <span className="font-medium text-slate-800">formulario semanal</span> por materia
                  (según la plantilla de seguimiento).
                </>
              )}
            </p>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Materia / curso
              </label>
              <select
                value={selectedKey}
                disabled={isBusyDeleting}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                {slots.map((slot) => (
                  <option key={slot.key} value={slot.key}>
                    {slot.gradoNombre} · {slot.cursoNombre} · {slot.materiaNombre}
                  </option>
                ))}
              </select>
              {selectedSlot && (
                <p className="mt-3 text-sm text-slate-600">
                  {selectedSlot.areaNombre ? `${selectedSlot.areaNombre} · ` : ''}
                  {selectedSlot.gradoNombre} ({selectedSlot.gradoNivel}) · {selectedSlot.cursoNombre}
                  {selectedSlot.cursoJornada ? ` · ${selectedSlot.cursoJornada}` : ''}
                </p>
              )}
            </section>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Planes de esta materia ({itemsForSlot.length})
              </h3>
              <Button
                type="button"
                variant="primary"
                disabled={isBusyDeleting || loading}
                onClick={openNew}
              >
                <IconPlus className="w-4 h-4 mr-2" />
                Nuevo plan semanal
              </Button>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500">Cargando…</p>
            ) : (
              <ul className="space-y-3 mb-6">
                {itemsForSlot.length === 0 && (
                  <li className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
                    Aún no hay planes semanales para esta materia.
                  </li>
                )}
                {itemsForSlot.map((item) => {
                  const deleting = deletingId === item.id;
                  return (
                    <li
                      key={item.id}
                      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">
                          Semana {item.semana} · {item.periodo_academico}
                        </p>
                        <p className="text-sm text-slate-600 mt-0.5">
                          {item.fecha_inicio} → {item.fecha_final}
                          {item.nombre_archivo
                            ? ` · ${item.nombre_archivo}${
                                item.tamano_bytes ? ` · ${formatBytes(item.tamano_bytes)}` : ''
                              }`
                            : ' · Formulario'}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <Button
                          type="button"
                          variant="primary"
                          disabled={deleting || viewerLoadingId === item.id}
                          onClick={() => void openHtmlViewer(item)}
                        >
                          {viewerLoadingId === item.id ? (
                            <>
                              <IconSpinner className="w-4 h-4 mr-2 animate-spin" />
                              Abriendo…
                            </>
                          ) : (
                            <>
                              <IconEye className="w-4 h-4 mr-2" />
                              Visualizar
                            </>
                          )}
                        </Button>
                        {allowsPdf && item.has_file && (
                          <Button
                            type="button"
                            variant="outline"
                            disabled={deleting || viewerLoadingId === item.id}
                            onClick={() => void openPdfViewer(item)}
                          >
                            PDF
                          </Button>
                        )}
                        {allowsPdf ? (
                          <Button
                            type="button"
                            variant="outline"
                            disabled={deleting || saving}
                            onClick={() => openReplacePdf(item)}
                          >
                            <IconUpload className="w-4 h-4 mr-2" />
                            Actualizar PDF
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            disabled={deleting || saving}
                            onClick={() => openEditForm(item)}
                          >
                            <IconEdit className="w-4 h-4 mr-2" />
                            Editar
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          disabled={deleting || saving}
                          onClick={() => void deletePlan(item)}
                          className="border-red-200 text-red-700 hover:bg-red-50"
                        >
                          {deleting ? (
                            <>
                              <IconSpinner className="w-4 h-4 mr-2 animate-spin" />
                              Eliminando…
                            </>
                          ) : (
                            <>
                              <IconTrash className="w-4 h-4 mr-2" />
                              Eliminar
                            </>
                          )}
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Composer moved to modal */}
          </div>
        )}
      </div>

      <Modal
        open={composerOpen && !!selectedSlot}
        onClose={() => {
          if (!saving) resetComposer();
        }}
        title={
          editingItem
            ? allowsPdf
              ? 'Actualizar PDF del plan'
              : 'Editar plan semanal'
            : allowsPdf
              ? 'Adjuntar plan semanal (PDF)'
              : 'Nuevo plan semanal'
        }
        size="full"
        className="max-w-3xl"
        closeOnOverlayClick={!saving}
      >
        {selectedSlot && (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">
              {selectedSlot.gradoNombre} · {selectedSlot.cursoNombre} ·{' '}
              {selectedSlot.materiaNombre}
            </p>

            <div>
              <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Paso {formStep + 1} de {formSteps.length}
                </span>
                <span className="font-medium text-slate-700">
                  {formSteps[formStep]?.title}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{
                    width: `${((formStep + 1) / formSteps.length) * 100}%`,
                  }}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {formSteps.map((step, idx) => (
                  <button
                    key={step.id}
                    type="button"
                    disabled={saving || idx > formStep}
                    onClick={() => {
                      if (idx <= formStep) {
                        setComposerError('');
                        setFormStep(idx);
                      }
                    }}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      idx === formStep
                        ? 'bg-blue-600 text-white'
                        : idx < formStep
                          ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {idx + 1}. {step.title}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {formSteps[formStep]?.description}
              </p>
            </div>

            {composerError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {composerError}
              </div>
            )}

            <div className="min-h-[280px]">
              {formSteps[formStep]?.id === 'info' && (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Periodo académico <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={formFields.periodo_academico}
                        onChange={(e) => updateField('periodo_academico', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                        placeholder="Ej. Periodo 2"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Semana <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={formFields.semana}
                        onChange={(e) => updateField('semana', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                        placeholder="Ej. 8"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Fecha inicio <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="date"
                        value={formFields.fecha_inicio}
                        onChange={(e) => updateField('fecha_inicio', e.target.value)}
                        disabled={Boolean(editingItem)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Fecha final <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="date"
                        value={formFields.fecha_final}
                        onChange={(e) => updateField('fecha_final', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  {!allowsPdf && (
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        N.º estudiantes
                      </label>
                      <input
                        type="text"
                        value={formFields.num_estudiantes}
                        onChange={(e) => updateField('num_estudiantes', e.target.value)}
                        className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                      />
                    </div>
                  )}
                </div>
              )}

              {formSteps[formStep]?.id === 'planeacion' && (
                <div className="space-y-3">{renderTextFields(PLANEACION_KEYS)}</div>
              )}

              {formSteps[formStep]?.id === 'clases' && (
                <div className="space-y-4">
                  {formFields.clases.map((clase, index) => (
                    <div
                      key={clase.numero}
                      className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Clase {clase.numero}
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-slate-600">
                            Fecha
                          </label>
                          <input
                            type="date"
                            value={clase.fecha}
                            onChange={(e) => updateClase(index, { fecha: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-slate-600">
                            Tiempo empleado
                          </label>
                          <input
                            type="text"
                            value={clase.tiempo}
                            onChange={(e) => updateClase(index, { tiempo: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                            placeholder="Ej. 45 min"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                          Tema específico
                        </label>
                        <input
                          type="text"
                          value={clase.tema_especifico}
                          onChange={(e) =>
                            updateClase(index, { tema_especifico: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                          Actividades realizadas
                        </label>
                        <textarea
                          value={clase.actividades}
                          onChange={(e) =>
                            updateClase(index, { actividades: e.target.value })
                          }
                          rows={2}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                          Recursos utilizados
                        </label>
                        <textarea
                          value={clase.recursos}
                          onChange={(e) => updateClase(index, { recursos: e.target.value })}
                          rows={2}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {formSteps[formStep]?.id === 'trabajo' && (
                <div className="space-y-3">
                  {renderTextFields(TRABAJO_KEYS)}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Fecha de entrega
                    </label>
                    <input
                      type="date"
                      value={formFields.fecha_entrega}
                      onChange={(e) => updateField('fecha_entrega', e.target.value)}
                      className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              )}

              {formSteps[formStep]?.id === 'seguimiento' && (
                <div className="space-y-3">{renderTextFields(SEGUIMIENTO_KEYS)}</div>
              )}

              {formSteps[formStep]?.id === 'cierre' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-slate-900">Evaluación</h4>
                    <div className="space-y-3">{renderTextFields(EVAL_KEYS)}</div>
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-slate-900">
                      Comunicación y evidencias
                    </h4>
                    <div className="space-y-3">{renderTextFields(COMUNICACION_KEYS)}</div>
                  </div>
                </div>
              )}

              {formSteps[formStep]?.id === 'archivo' && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="sr-only"
                    onChange={(e) => selectPdfFile(e.target.files?.[0])}
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                      setIsDragging(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      selectPdfFile(e.dataTransfer.files?.[0]);
                    }}
                    className={`rounded-xl border-2 border-dashed px-4 py-10 text-center cursor-pointer ${
                      isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-300 bg-white hover:border-blue-400'
                    }`}
                  >
                    {pendingFile ? (
                      <>
                        <p className="truncate text-sm font-medium text-slate-900">
                          {pendingFile.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatBytes(pendingFile.size)}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-slate-800">
                          Arrastra el PDF del plan semanal
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          o haz clic para elegir · máx. 10 MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                disabled={saving || formStep === 0}
                onClick={goPrevStep}
              >
                Anterior
              </Button>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  onClick={resetComposer}
                >
                  Cancelar
                </Button>
                {!isLastStep ? (
                  <Button type="button" variant="primary" disabled={saving} onClick={goNextStep}>
                    Siguiente
                  </Button>
                ) : allowsPdf ? (
                  <Button
                    type="button"
                    variant="primary"
                    disabled={!pendingFile || saving}
                    onClick={() => void savePdf()}
                  >
                    {saving ? (
                      <>
                        <IconSpinner className="mr-2 h-4 w-4 animate-spin" />
                        Extrayendo…
                      </>
                    ) : (
                      <>
                        <IconUpload className="mr-2 h-4 w-4" />
                        Subir y extraer
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    disabled={saving}
                    onClick={() => void saveForm()}
                  >
                    {saving ? (
                      <>
                        <IconSpinner className="mr-2 h-4 w-4 animate-spin" />
                        Guardando…
                      </>
                    ) : (
                      <>
                        <IconUpload className="mr-2 h-4 w-4" />
                        {editingItem ? 'Guardar cambios' : 'Guardar plan semanal'}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!htmlViewer}
        onClose={() => {
          setHtmlViewer(null);
          setEditingHtml(false);
        }}
        title={htmlViewer?.title || 'Plan semanal'}
        size="full"
        className="max-w-6xl"
      >
        {htmlViewer && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {!editingHtml ? (
                <Button type="button" variant="outline" onClick={() => setEditingHtml(true)}>
                  <IconEdit className="w-4 h-4 mr-2" />
                  Editar contenido web
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="primary"
                    disabled={savingHtml}
                    onClick={() => void saveHtml()}
                  >
                    {savingHtml ? 'Guardando…' : 'Guardar HTML'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={savingHtml}
                    onClick={() => {
                      setHtmlDraft(htmlViewer.html);
                      setEditingHtml(false);
                    }}
                  >
                    Cancelar
                  </Button>
                </>
              )}
              {htmlViewer.pdfUrl && (
                <a
                  href={htmlViewer.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Abrir PDF original
                </a>
              )}
            </div>
            {editingHtml ? (
              <textarea
                value={htmlDraft}
                onChange={(e) => setHtmlDraft(e.target.value)}
                className="h-[70vh] w-full rounded-lg border border-slate-300 bg-white p-4 font-mono text-sm"
                spellCheck={false}
              />
            ) : (
              <div className="h-[70vh] overflow-auto rounded-lg border border-slate-200 bg-white p-6">
                <div
                  className="plan-semanal-preview"
                  dangerouslySetInnerHTML={{ __html: htmlViewer.html }}
                />
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={!!pdfViewer}
        onClose={() => setPdfViewer(null)}
        title={pdfViewer?.nombre || 'PDF del plan'}
        size="full"
        className="max-w-6xl"
      >
        {pdfViewer && (
          <div className="h-[70vh] overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            {isPdfMime(pdfViewer.mime, pdfViewer.nombre) ? (
              <iframe title={pdfViewer.nombre} src={pdfViewer.url} className="h-full w-full" />
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-sm text-slate-600">
                No se puede previsualizar. Ábrelo o descárgalo.
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
