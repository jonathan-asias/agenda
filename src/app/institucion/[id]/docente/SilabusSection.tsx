'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { isPdfMime, SILABUS_MAX_BYTES } from '@/lib/security/silabus-upload';
import { showConfirm, showError, showSuccess } from '@/lib/notifications';
import {
  EMPTY_SILABUS_FORM,
  parseSilabusFormFields,
  SILABUS_FORM_LABELS,
  type SilabusFormFields,
  validateSilabusForm,
} from '@/lib/silabus/form-html';

export type SilabusItem = {
  id: number;
  materia_id: number;
  grado_id: number;
  curso_id: number;
  origen: 'formulario' | 'pdf' | string;
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
  );
}

function IconRefresh({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

function IconTrash({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

function IconUpload({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      />
    </svg>
  );
}

function IconX({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function IconSpinner({ className = 'w-4 h-4 animate-spin' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function IconEdit({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );
}

const FORM_FIELD_KEYS = Object.keys(SILABUS_FORM_LABELS) as Array<keyof SilabusFormFields>;

export default function DocenteSilabusSection({ asignaciones }: Props) {
  const [items, setItems] = useState<SilabusItem[]>([]);
  const [allowsPdf, setAllowsPdf] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sectionOpen, setSectionOpen] = useState(true);
  const [selectedKey, setSelectedKey] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editingForm, setEditingForm] = useState(false);
  const [formFields, setFormFields] = useState<SilabusFormFields>({ ...EMPTY_SILABUS_FORM });
  const [savingForm, setSavingForm] = useState(false);
  const [htmlViewer, setHtmlViewer] = useState<{
    id: number;
    title: string;
    html: string;
    pdfUrl: string | null;
    pdfName: string | null;
  } | null>(null);
  const [htmlDraft, setHtmlDraft] = useState('');
  const [editingHtml, setEditingHtml] = useState(false);
  const [savingHtml, setSavingHtml] = useState(false);
  const [pdfViewer, setPdfViewer] = useState<{
    url: string;
    nombre: string;
    mime: string;
  } | null>(null);
  const [viewerLoadingId, setViewerLoadingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
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

  const silabusBySlotKey = useMemo(() => {
    const map = new Map<string, SilabusItem>();
    for (const item of items) {
      map.set(`${item.curso_id}:${item.materia_id}`, item);
    }
    return map;
  }, [items]);

  const existingForSelected = selectedSlot
    ? silabusBySlotKey.get(selectedSlot.key) ?? null
    : null;

  const isDeletingSelected =
    existingForSelected != null && deletingId === existingForSelected.id;

  const showUploadZone = allowsPdf && (!existingForSelected || updating);
  const showFormEditor =
    !allowsPdf && (!existingForSelected || editingForm);

  const resetPendingFile = () => {
    setPendingFile(null);
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const cancelUpdating = () => {
    setUpdating(false);
    resetPendingFile();
    setError('');
  };

  const cancelFormEdit = () => {
    setEditingForm(false);
    setError('');
    if (existingForSelected?.contenido_json) {
      setFormFields(parseSilabusFormFields(existingForSelected.contenido_json));
    } else {
      setFormFields({ ...EMPTY_SILABUS_FORM });
    }
  };

  const loadSilabus = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/docentes/silabus');
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No se pudieron cargar los sílabus');
        setItems([]);
        return;
      }
      setAllowsPdf(Boolean(data.meta?.allows_pdf));
      setItems(data.data || []);
    } catch {
      setError('Error de conexión al cargar sílabus');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSilabus();
  }, []);

  useEffect(() => {
    if (slots.length > 0 && !selectedKey) {
      setSelectedKey(slots[0].key);
    }
  }, [slots, selectedKey]);

  useEffect(() => {
    if (existingForSelected?.origen === 'formulario' && existingForSelected.contenido_json) {
      setFormFields(parseSilabusFormFields(existingForSelected.contenido_json));
    } else if (!existingForSelected) {
      setFormFields({ ...EMPTY_SILABUS_FORM });
    }
    setEditingForm(false);
    setUpdating(false);
    resetPendingFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync form when course selection changes
  }, [selectedKey, existingForSelected?.id]);

  const selectPdfFile = (file: File | null | undefined) => {
    if (!file) return;
    const name = file.name.toLowerCase();
    const isPdf = name.endsWith('.pdf') || file.type === 'application/pdf';
    if (!isPdf) {
      setError('Solo se permiten archivos PDF');
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    if (file.size > SILABUS_MAX_BYTES) {
      setError('El archivo supera el tamaño máximo (10 MB)');
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setError('');
    setPendingFile(file);
  };

  const uploadFile = async () => {
    if (!selectedSlot || !pendingFile) return;
    setUploading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('materia_id', String(selectedSlot.materia_id));
      form.append('grado_id', String(selectedSlot.grado_id));
      form.append('curso_id', String(selectedSlot.curso_id));
      form.append('archivo', pendingFile);

      const res = await fetch('/api/docentes/silabus', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No se pudo subir el sílabus');
        return;
      }
      const next = data.data as SilabusItem;
      setItems((prev) => {
        const without = prev.filter(
          (p) => !(p.curso_id === next.curso_id && p.materia_id === next.materia_id)
        );
        return [next, ...without];
      });
      const wasUpdate = Boolean(existingForSelected);
      resetPendingFile();
      setUpdating(false);
      await showSuccess(
        wasUpdate ? 'Sílabus actualizado' : 'Sílabus cargado',
        'Se extrajo el texto del PDF. Puedes revisarlo y editarlo en formato web.'
      );
      if (next.contenido_html) {
        setHtmlViewer({
          id: next.id,
          title: `${next.grado.nombre} · ${next.curso.nombre} · ${next.materia.nombre}`,
          html: next.contenido_html,
          pdfUrl: next.has_file ? `/api/docentes/silabus/${next.id}/file` : null,
          pdfName: next.nombre_archivo,
        });
        setHtmlDraft(next.contenido_html);
        setEditingHtml(false);
      }
    } catch {
      setError('Error de conexión al subir el sílabus');
    } finally {
      setUploading(false);
    }
  };

  const saveForm = async () => {
    if (!selectedSlot) return;
    const validation = validateSilabusForm(formFields);
    if (validation) {
      setError(validation);
      return;
    }
    setSavingForm(true);
    setError('');
    try {
      const res = await fetch('/api/docentes/silabus', {
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
        setError(data.error || 'No se pudo guardar el sílabus');
        return;
      }
      const next = data.data as SilabusItem;
      setItems((prev) => {
        const without = prev.filter(
          (p) => !(p.curso_id === next.curso_id && p.materia_id === next.materia_id)
        );
        return [next, ...without];
      });
      setEditingForm(false);
      await showSuccess(
        existingForSelected ? 'Sílabus actualizado' : 'Sílabus guardado',
        'El formato se guardó y ya puedes visualizarlo en la web.'
      );
    } catch {
      setError('Error de conexión al guardar el sílabus');
    } finally {
      setSavingForm(false);
    }
  };

  const openHtmlViewer = async (item: SilabusItem) => {
    if (deletingId === item.id) return;
    setViewerLoadingId(item.id);
    setError('');
    try {
      const res = await fetch(`/api/docentes/silabus/${item.id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No se pudo abrir el sílabus');
        return;
      }
      const html = data.data?.contenido_html || item.contenido_html || '';
      if (!html) {
        setError('Este sílabus aún no tiene contenido web');
        return;
      }
      setHtmlViewer({
        id: item.id,
        title: `${item.grado.nombre} · ${item.curso.nombre} · ${item.materia.nombre}`,
        html,
        pdfUrl: data.data?.url || (item.has_file ? `/api/docentes/silabus/${item.id}/file` : null),
        pdfName: data.data?.nombre_archivo || item.nombre_archivo,
      });
      setHtmlDraft(html);
      setEditingHtml(false);
    } catch {
      setError('Error de conexión al abrir el sílabus');
    } finally {
      setViewerLoadingId(null);
    }
  };

  const openPdfViewer = async (item: SilabusItem) => {
    if (!item.has_file || deletingId === item.id) return;
    setViewerLoadingId(item.id);
    setError('');
    try {
      const res = await fetch(`/api/docentes/silabus/${item.id}`);
      const data = await res.json();
      if (!res.ok || !data.data?.url) {
        setError(data.error || 'No se pudo abrir el PDF');
        return;
      }
      setPdfViewer({
        url: data.data.url,
        nombre: data.data.nombre_archivo || 'silabus.pdf',
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
      const res = await fetch(`/api/docentes/silabus/${htmlViewer.id}`, {
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
        prev.map((p) =>
          p.id === htmlViewer.id ? { ...p, contenido_html: trimmed } : p
        )
      );
      setEditingHtml(false);
      await showSuccess('Contenido guardado', 'La versión web del sílabus se actualizó.');
    } catch {
      setError('Error de conexión al guardar el contenido');
    } finally {
      setSavingHtml(false);
    }
  };

  const deleteSilabus = async (item: SilabusItem) => {
    const label =
      item.nombre_archivo ||
      `${item.grado.nombre} · ${item.curso.nombre} · ${item.materia.nombre}`;

    const confirmed = await showConfirm({
      title: '¿Eliminar sílabus?',
      html: `
        <div style="text-align: left; margin-top: 0.5rem;">
          <p style="margin-bottom: 0.75rem; color: #334155; font-size: 0.875rem;">
            Estás a punto de eliminar el sílabus de
            <strong>${escapeHtml(`${item.grado.nombre} · ${item.curso.nombre} · ${item.materia.nombre}`)}</strong>.
          </p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 0.75rem; margin-bottom: 0.75rem;">
            <p style="margin: 0; color: #0f172a; font-size: 0.875rem; word-break: break-all;">
              ${escapeHtml(label)}
            </p>
          </div>
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
    setUpdating(false);
    setEditingForm(false);
    resetPendingFile();
    setError('');
    try {
      const res = await fetch(`/api/docentes/silabus/${item.id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data.error || 'No se pudo eliminar el sílabus';
        setError(message);
        await showError('No se pudo eliminar', message);
        return;
      }
      setItems((prev) => prev.filter((p) => p.id !== item.id));
      setHtmlViewer(null);
      setPdfViewer(null);
      if (existingForSelected?.id === item.id) {
        cancelUpdating();
        setEditingForm(false);
        setFormFields({ ...EMPTY_SILABUS_FORM });
      }
      await loadSilabus();
      await showSuccess('Sílabus eliminado', 'Se eliminó correctamente.');
    } catch {
      setError('Error de conexión al eliminar el sílabus');
      await showError('Sin conexión', 'No se pudo conectar con el servidor. Intenta de nuevo.');
    } finally {
      setDeletingId(null);
    }
  };

  const collapsedHint = allowsPdf
    ? items.length > 0
      ? `${items.length} sílabus · Plan Plus (PDF + web)`
      : 'Sube un PDF y genera la versión web'
    : items.length > 0
      ? `${items.length} sílabus · Plan Básico (formulario)`
      : 'Completa el formulario por curso';

  if (slots.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mb-8 overflow-hidden">
        <button
          type="button"
          onClick={() => setSectionOpen((open) => !open)}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50/80 transition-colors"
          aria-expanded={sectionOpen}
        >
          <h2 className="text-xl font-semibold text-slate-800">Sílabus</h2>
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
            <p className="pt-4 text-sm text-slate-600">
              Cuando tengas cursos asignados podrás cargar el sílabus de cada uno aquí.
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
          onClick={() => setSectionOpen((open) => !open)}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50/80 transition-colors"
          aria-expanded={sectionOpen}
        >
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Sílabus</h2>
            {!sectionOpen && (
              <p className="mt-0.5 text-sm text-slate-500">{collapsedHint}</p>
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
                  Plan Plus: sube el sílabus en{' '}
                  <span className="font-medium text-slate-800">PDF</span> (máx. 10 MB). Extraemos el
                  texto y lo mostramos en formato web editable.
                </>
              ) : (
                <>
                  Plan Básico: completa el{' '}
                  <span className="font-medium text-slate-800">formulario</span> por curso. Se genera
                  una versión web para visualizar.
                </>
              )}
            </p>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Curso</h3>

              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Seleccionar curso
              </label>
              <select
                value={selectedKey}
                disabled={isDeletingSelected}
                onChange={(e) => {
                  setSelectedKey(e.target.value);
                  cancelUpdating();
                  setEditingForm(false);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 mb-4 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
              >
                {slots.map((slot) => {
                  const hasSilabus = silabusBySlotKey.has(slot.key);
                  return (
                    <option key={slot.key} value={slot.key}>
                      {slot.gradoNombre} · {slot.cursoNombre} · {slot.materiaNombre}
                      {hasSilabus ? ' (con sílabus)' : ''}
                    </option>
                  );
                })}
              </select>

              {selectedSlot && (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                  {selectedSlot.areaNombre && (
                    <p>
                      <span className="font-medium text-slate-700">Área:</span>{' '}
                      {selectedSlot.areaNombre}
                    </p>
                  )}
                  <p>
                    <span className="font-medium text-slate-700">Grado:</span>{' '}
                    {selectedSlot.gradoNombre} ({selectedSlot.gradoNivel})
                  </p>
                  <p>
                    <span className="font-medium text-slate-700">Curso:</span>{' '}
                    {selectedSlot.cursoNombre}
                    {selectedSlot.cursoJornada ? ` · ${selectedSlot.cursoJornada}` : ''}
                  </p>
                  <p>
                    <span className="font-medium text-slate-700">Materia:</span>{' '}
                    {selectedSlot.materiaNombre}
                  </p>
                </div>
              )}
            </section>

            {loading ? (
              <p className="text-sm text-slate-500">Cargando…</p>
            ) : existingForSelected && !updating && !editingForm ? (
              <section>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Sílabus del curso</h3>
                <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">
                      {existingForSelected.grado.nombre} · {existingForSelected.curso.nombre} ·{' '}
                      {existingForSelected.materia.nombre}
                    </p>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {allowsPdf && existingForSelected.nombre_archivo
                        ? `${existingForSelected.nombre_archivo}${
                            existingForSelected.tamano_bytes
                              ? ` · ${formatBytes(existingForSelected.tamano_bytes)}`
                              : ''
                          }`
                        : 'Formulario guardado · versión web disponible'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="primary"
                      disabled={
                        isDeletingSelected || viewerLoadingId === existingForSelected.id
                      }
                      onClick={() => void openHtmlViewer(existingForSelected)}
                    >
                      {viewerLoadingId === existingForSelected.id ? (
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
                    {allowsPdf && existingForSelected.has_file && (
                      <Button
                        type="button"
                        variant="outline"
                        disabled={
                          isDeletingSelected || viewerLoadingId === existingForSelected.id
                        }
                        onClick={() => void openPdfViewer(existingForSelected)}
                      >
                        PDF original
                      </Button>
                    )}
                    {allowsPdf ? (
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isDeletingSelected || uploading}
                        onClick={() => {
                          setUpdating(true);
                          resetPendingFile();
                          setError('');
                        }}
                      >
                        <IconRefresh className="w-4 h-4 mr-2" />
                        Actualizar PDF
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isDeletingSelected || savingForm}
                        onClick={() => {
                          setEditingForm(true);
                          setFormFields(
                            parseSilabusFormFields(existingForSelected.contenido_json)
                          );
                          setError('');
                        }}
                      >
                        <IconEdit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isDeletingSelected || uploading || savingForm}
                      onClick={() => void deleteSilabus(existingForSelected)}
                      className="border-red-200 text-red-700 hover:bg-red-50"
                    >
                      {deletingId === existingForSelected.id ? (
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
                </div>
              </section>
            ) : showFormEditor ? (
              <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {editingForm ? 'Editar sílabus' : 'Completar sílabus'}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Los campos marcados son obligatorios. Se generará una vista web.
                    </p>
                  </div>
                  {editingForm && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelFormEdit}
                      disabled={savingForm}
                    >
                      <IconX className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {FORM_FIELD_KEYS.map((key) => {
                    const required = [
                      'objetivos_generales',
                      'contenidos',
                      'metodologia',
                      'evaluacion',
                    ].includes(key);
                    return (
                      <div key={key}>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          {SILABUS_FORM_LABELS[key]}
                          {required ? <span className="text-red-600"> *</span> : null}
                        </label>
                        <textarea
                          value={formFields[key]}
                          onChange={(e) =>
                            setFormFields((prev) => ({ ...prev, [key]: e.target.value }))
                          }
                          rows={key === 'contenidos' || key === 'bibliografia' ? 5 : 3}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
                          placeholder={`Escribe ${SILABUS_FORM_LABELS[key].toLowerCase()}…`}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    variant="primary"
                    disabled={savingForm}
                    onClick={() => void saveForm()}
                  >
                    {savingForm ? (
                      <>
                        <IconSpinner className="w-4 h-4 mr-2 animate-spin" />
                        Guardando…
                      </>
                    ) : (
                      <>
                        <IconUpload className="w-4 h-4 mr-2" />
                        {editingForm ? 'Guardar cambios' : 'Guardar sílabus'}
                      </>
                    )}
                  </Button>
                </div>
              </section>
            ) : showUploadZone ? (
              <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {updating ? 'Actualizar PDF' : 'Subir sílabus PDF'}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Solo PDF · Máximo 10 MB
                      {updating
                        ? ' · Se reemplazará el archivo y se volverá a extraer el texto'
                        : ' · Extraeremos el contenido a formato web'}
                    </p>
                  </div>
                  {updating && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelUpdating}
                      disabled={uploading}
                    >
                      <IconX className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="sr-only"
                  onChange={(e) => {
                    selectPdfFile(e.target.files?.[0] ?? null);
                  }}
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
                    e.stopPropagation();
                    setIsDragging(true);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                    setIsDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(false);
                    selectPdfFile(e.dataTransfer.files?.[0]);
                  }}
                  className={`mb-3 rounded-xl border-2 border-dashed px-4 py-8 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : pendingFile
                        ? 'border-blue-300 bg-white'
                        : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50'
                  }`}
                >
                  <svg
                    className={`mx-auto mb-2 h-9 w-9 ${isDragging ? 'text-blue-600' : 'text-slate-400'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  {pendingFile ? (
                    <>
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {pendingFile.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatBytes(pendingFile.size)}
                      </p>
                      <p className="mt-2 text-xs text-blue-700">
                        Arrastra otro PDF para reemplazarlo, o haz clic para elegir
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-slate-800">
                        {isDragging ? 'Suelta el PDF aquí' : 'Arrastra y suelta tu PDF aquí'}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        o haz clic para abrir el explorador de archivos
                      </p>
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <Button
                    type="button"
                    variant="primary"
                    disabled={!pendingFile || uploading}
                    onClick={() => void uploadFile()}
                  >
                    {uploading ? (
                      <>
                        <IconSpinner className="w-4 h-4 mr-2 animate-spin" />
                        {updating ? 'Extrayendo…' : 'Subiendo y extrayendo…'}
                      </>
                    ) : (
                      <>
                        <IconUpload className="w-4 h-4 mr-2" />
                        {updating ? 'Guardar y extraer' : 'Subir y extraer'}
                      </>
                    )}
                  </Button>
                </div>
              </section>
            ) : null}
          </div>
        )}
      </div>

      <Modal
        open={!!htmlViewer}
        onClose={() => {
          setHtmlViewer(null);
          setEditingHtml(false);
        }}
        title={htmlViewer?.title || 'Sílabus'}
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
                    {savingHtml ? (
                      <>
                        <IconSpinner className="w-4 h-4 mr-2 animate-spin" />
                        Guardando…
                      </>
                    ) : (
                      'Guardar HTML'
                    )}
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
                className="h-[70vh] w-full rounded-lg border border-slate-300 bg-white p-4 font-mono text-sm text-slate-900"
                spellCheck={false}
              />
            ) : (
              <div className="h-[70vh] overflow-auto rounded-lg border border-slate-200 bg-white p-6">
                <div
                  className="silabus-preview"
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
        title={pdfViewer?.nombre || 'PDF del sílabus'}
        size="full"
        className="max-w-6xl"
      >
        {pdfViewer && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <a
                href={pdfViewer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <IconEye className="w-4 h-4 mr-2" />
                Abrir en nueva pestaña
              </a>
              <a
                href={pdfViewer.url}
                download={pdfViewer.nombre}
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Descargar
              </a>
            </div>
            <div className="h-[70vh] overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              {isPdfMime(pdfViewer.mime, pdfViewer.nombre) ? (
                <iframe title={pdfViewer.nombre} src={pdfViewer.url} className="h-full w-full" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                  <p className="text-sm text-slate-600">
                    Este archivo no se puede previsualizar. Ábrelo o descárgalo para revisarlo.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
