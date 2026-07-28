'use client';

import { useEffect, useRef, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import ErrorBanner from '@/components/ui/ErrorBanner';

interface BulkUploadEstudiantesModalProps {
  isOpen: boolean;
  onClose: () => void;
  institucionId: number;
  onSuccess: () => void;
}

type ResultadoCarga = {
  totalFilas: number;
  exitosos: number;
  fallidos: number;
  estudiantesCreados: Array<{
    fila: number;
    id: number;
    codigo_estudiantil: string;
    nombres: string;
    apellidos: string;
  }>;
  errores: string[];
};

type ResultadoValidacion = {
  valido: boolean;
  totalFilas: number;
  filasValidas: number;
  filasConError: number;
  errores: string[];
  advertencias: string[];
  duplicadosEnArchivo: Array<{ codigo: string; filas: number[] }>;
  duplicadosEnSistema: string[];
  detalleFilas?: Array<{
    fila: number;
    codigo_estudiantil: string;
    nombres: string;
    apellidos: string;
    nombre_acudiente: string;
    telefono_acudiente: string;
    correo_acudiente: string | null;
    grado_id: number;
    grado_nombre: string | null;
    curso_id: number;
    curso_nombre: string | null;
    valida: boolean;
    errores: string[];
  }>;
};

export default function BulkUploadEstudiantesModal({
  isOpen,
  onClose,
  institucionId,
  onSuccess,
}: BulkUploadEstudiantesModalProps) {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [descargando, setDescargando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [comprobando, setComprobando] = useState(false);
  const [error, setError] = useState('');
  const [validacion, setValidacion] = useState<ResultadoValidacion | null>(null);
  const [resultado, setResultado] = useState<ResultadoCarga | null>(null);
  const [mostrarPreview, setMostrarPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const esArchivoExcel = (file: File) => {
    const name = file.name.toLowerCase();
    return (
      name.endsWith('.xlsx') ||
      name.endsWith('.xls') ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel'
    );
  };

  const seleccionarArchivo = (file: File | undefined | null) => {
    if (!file) return;
    if (!esArchivoExcel(file)) {
      setError('Formato no válido. Use un archivo .xlsx o .xls');
      return;
    }
    setArchivo(file);
    setError('');
    setValidacion(null);
    setResultado(null);
    setMostrarPreview(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    setArchivo(null);
    setError('');
    setValidacion(null);
    setResultado(null);
    setMostrarPreview(false);
    setIsDragging(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const body = document.body;
    const count = Number(body.dataset.modalCount || '0');
    body.dataset.modalCount = String(count + 1);
    body.classList.add('modal-open');
    return () => {
      const next = Math.max(Number(body.dataset.modalCount || '1') - 1, 0);
      if (next === 0) {
        body.classList.remove('modal-open');
        delete body.dataset.modalCount;
      } else {
        body.dataset.modalCount = String(next);
      }
    };
  }, [isOpen]);

  const descargarPlantilla = async () => {
    setDescargando(true);
    setError('');
    try {
      const response = await fetch(`/api/estudiantes/plantilla/${institucionId}`);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || 'No se pudo descargar la plantilla');
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plantilla-estudiantes-${institucionId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError('Error de conexión al descargar la plantilla');
    } finally {
      setDescargando(false);
    }
  };

  const comprobarArchivo = async () => {
    if (!archivo) {
      setError('Selecciona un archivo Excel primero');
      return;
    }

    setComprobando(true);
    setError('');
    setValidacion(null);
    setResultado(null);
    setMostrarPreview(false);

    try {
      const formData = new FormData();
      formData.append('archivo', archivo);
      formData.append('institucionId', String(institucionId));

      const response = await fetch('/api/estudiantes/validar-carga', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.data) {
        setValidacion(data.data as ResultadoValidacion);
      }

      if (!response.ok && !data.data) {
        setError(data.error || 'No se pudo comprobar el archivo');
        if (Array.isArray(data.errores)) {
          setValidacion({
            valido: false,
            totalFilas: 0,
            filasValidas: 0,
            filasConError: 0,
            errores: data.errores,
            advertencias: [],
            duplicadosEnArchivo: [],
            duplicadosEnSistema: [],
          });
        }
      }
    } catch {
      setError('Error de conexión al comprobar el archivo');
    } finally {
      setComprobando(false);
    }
  };

  const subirArchivo = async () => {
    if (!archivo) {
      setError('Selecciona un archivo Excel primero');
      return;
    }

    if (!validacion?.valido) {
      setError('Comprueba el archivo y corrige los errores antes de importar.');
      return;
    }

    setSubiendo(true);
    setError('');
    setResultado(null);

    try {
      const formData = new FormData();
      formData.append('archivo', archivo);
      formData.append('institucionId', String(institucionId));

      const response = await fetch('/api/estudiantes/carga-masiva', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.data) {
        setResultado(data.data as ResultadoCarga);
      }

      if (!response.ok && !data.data) {
        setError(data.error || 'Error al procesar el archivo');
        if (Array.isArray(data.errores)) {
          setResultado({
            totalFilas: 0,
            exitosos: 0,
            fallidos: data.errores.length,
            estudiantesCreados: [],
            errores: data.errores,
          });
        }
        return;
      }

      if (data.data?.exitosos > 0) {
        onSuccess();
      }
    } catch {
      setError('Error de conexión al subir el archivo');
    } finally {
      setSubiendo(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Carga masiva de estudiantes"
      size="xl"
      className="max-w-5xl"
    >
      <p className="text-sm text-[var(--color-text-secondary)] mb-5">
        Descarga la plantilla con grados, cursos y materias de su sede, complete los datos y súbala aquí.
      </p>

      <div className="space-y-6">
            <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-medium text-slate-900 mb-2">Paso 1 — Descargar plantilla</h3>
              <p className="text-sm text-slate-600 mb-3">
                El archivo Excel incluye hojas de referencia con los <strong>grados</strong>,{' '}
                <strong>cursos</strong> y <strong>materias</strong> disponibles en su sede. En la
                hoja &quot;Estudiantes&quot; use los IDs de grado y curso indicados en esas hojas.
              </p>
              <p className="text-sm text-slate-700 mb-4 rounded-md border border-slate-200 bg-white px-3 py-2">
                <strong>Recomendación:</strong> descargue siempre una plantilla nueva antes de
                cargar. No reutilice un Excel antiguo si ya agregó o modificó grados o cursos; la
                plantilla refleja la información actual de la sede en el momento de la descarga.
              </p>
              <Button type="button" variant="primary" onClick={descargarPlantilla} disabled={descargando}>
                {descargando ? 'Generando…' : 'Descargar plantilla (.xlsx)'}
              </Button>
            </section>

            <section className="rounded-lg border border-pink-200 bg-pink-50 p-4">
              <h3 className="font-medium text-pink-900 mb-2">Paso 2 — Completar y adjuntar</h3>
              <p className="text-sm text-pink-800 mb-3">
                Complete una fila por estudiante en la hoja &quot;Estudiantes&quot;. Luego adjunte
                el archivo y use <strong>Comprobar archivo</strong> antes de importar.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                onChange={(e) => seleccionarArchivo(e.target.files?.[0])}
                className="sr-only"
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
                  seleccionarArchivo(e.dataTransfer.files?.[0]);
                }}
                className={`relative rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-pink-500 bg-pink-100'
                    : archivo
                      ? 'border-pink-400 bg-white'
                      : 'border-pink-300 bg-white/80 hover:border-pink-400 hover:bg-white'
                }`}
              >
                <svg
                  className={`w-10 h-10 mx-auto mb-3 ${isDragging ? 'text-pink-600' : 'text-pink-400'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {archivo ? (
                  <>
                    <p className="text-sm font-medium text-pink-900">{archivo.name}</p>
                    <p className="text-xs text-pink-700 mt-1">
                      {(archivo.size / 1024).toFixed(1)} KB · Clic o arrastre otro archivo para reemplazar
                    </p>
                  </>
                ) : isDragging ? (
                  <p className="text-sm font-medium text-pink-800">Suelta el archivo aquí</p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-pink-900">
                      Arrastra y suelta tu archivo Excel aquí
                    </p>
                    <p className="text-xs text-pink-700 mt-1">
                      o haz clic para seleccionarlo (.xlsx, .xls)
                    </p>
                  </>
                )}
              </div>

              {archivo && (
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={comprobarArchivo}
                    disabled={comprobando || subiendo}
                    className="inline-flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-amber-300 transition-colors"
                  >
                    {comprobando ? (
                      <>
                        <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Comprobando...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Comprobar archivo
                      </>
                    )}
                  </button>
                </div>
              )}
            </section>

            {validacion && (
              <section
                className={`rounded-lg border p-4 ${
                  validacion.valido
                    ? 'border-green-200 bg-green-50'
                    : 'border-amber-200 bg-amber-50'
                }`}
              >
                <h3
                  className={`font-medium mb-2 ${
                    validacion.valido ? 'text-green-900' : 'text-amber-900'
                  }`}
                >
                  {validacion.valido
                    ? 'Archivo listo para importar'
                    : 'Se encontraron problemas en el archivo'}
                </h3>
                <p
                  className={`text-sm mb-3 ${
                    validacion.valido ? 'text-green-800' : 'text-amber-800'
                  }`}
                >
                  Filas detectadas: <strong>{validacion.totalFilas}</strong> · Válidas:{' '}
                  <strong>{validacion.filasValidas}</strong> · Con error:{' '}
                  <strong>{validacion.filasConError}</strong>
                </p>

                {validacion.duplicadosEnArchivo.length > 0 && (
                  <div className="mb-3 text-sm text-amber-900">
                    <p className="font-medium">Duplicados en el archivo:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {validacion.duplicadosEnArchivo.map((d) => (
                        <li key={d.codigo}>
                          Código &quot;{d.codigo}&quot; repetido en filas {d.filas.join(', ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {validacion.duplicadosEnSistema.length > 0 && (
                  <div className="mb-3 text-sm text-amber-900">
                    <p className="font-medium">Ya registrados en el sistema:</p>
                    <p className="mt-1">{validacion.duplicadosEnSistema.join(', ')}</p>
                  </div>
                )}

                {validacion.advertencias.length > 0 && (
                  <ul className="text-sm text-amber-800 mb-3 max-h-24 overflow-y-auto list-disc pl-5 space-y-1">
                    {validacion.advertencias.map((msg, i) => (
                      <li key={`adv-${i}`}>{msg}</li>
                    ))}
                  </ul>
                )}

                {validacion.errores.length > 0 && (
                  <ul className="text-sm text-red-700 max-h-40 overflow-y-auto list-disc pl-5 space-y-1" role="alert" aria-live="polite">
                    {validacion.errores.map((msg, i) => (
                      <li key={`err-${i}`}>{msg}</li>
                    ))}
                  </ul>
                )}

                {validacion.valido && (
                  <p className="text-sm text-green-700 mt-2">
                    Puede proceder con &quot;Importar estudiantes&quot;.
                  </p>
                )}

                {(validacion.detalleFilas?.length ?? 0) > 0 && (
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setMostrarPreview((v) => !v)}
                      className="border-slate-300 bg-white"
                    >
                      {mostrarPreview ? 'Ocultar previsualización' : 'Previsualizar'}
                    </Button>

                    {mostrarPreview && (
                      <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
                        <div className="max-h-80 overflow-auto">
                          <table className="min-w-full text-left text-sm">
                            <thead className="sticky top-0 bg-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-600">
                              <tr>
                                <th className="whitespace-nowrap px-3 py-2">Fila</th>
                                <th className="whitespace-nowrap px-3 py-2">Código</th>
                                <th className="whitespace-nowrap px-3 py-2">Estudiante</th>
                                <th className="whitespace-nowrap px-3 py-2">Grado</th>
                                <th className="whitespace-nowrap px-3 py-2">Curso</th>
                                <th className="whitespace-nowrap px-3 py-2">Acudiente</th>
                                <th className="whitespace-nowrap px-3 py-2">Tel. acudiente</th>
                                <th className="whitespace-nowrap px-3 py-2">Correo acudiente</th>
                                <th className="whitespace-nowrap px-3 py-2">Estado</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {validacion.detalleFilas!.map((fila) => (
                                <tr key={`${fila.fila}-${fila.codigo_estudiantil}`}>
                                  <td className="px-3 py-2 text-slate-500">{fila.fila}</td>
                                  <td className="px-3 py-2 font-medium text-slate-800">
                                    {fila.codigo_estudiantil}
                                  </td>
                                  <td className="px-3 py-2 text-slate-700">
                                    {fila.nombres} {fila.apellidos}
                                  </td>
                                  <td className="px-3 py-2 text-slate-700">
                                    {fila.grado_nombre ?? (
                                      <span className="text-red-600">ID {fila.grado_id}</span>
                                    )}
                                  </td>
                                  <td className="px-3 py-2 text-slate-700">
                                    {fila.curso_nombre ?? (
                                      <span className="text-red-600">ID {fila.curso_id}</span>
                                    )}
                                  </td>
                                  <td className="px-3 py-2 text-slate-700">
                                    {fila.nombre_acudiente || '—'}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                                    {fila.telefono_acudiente || '—'}
                                  </td>
                                  <td className="px-3 py-2 text-slate-700">
                                    {fila.correo_acudiente || '—'}
                                  </td>
                                  <td className="px-3 py-2">
                                    {fila.valida ? (
                                      <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                        Listo
                                      </span>
                                    ) : (
                                      <span
                                        className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800"
                                        title={fila.errores.join(' ')}
                                      >
                                        Error
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="border-t border-slate-100 px-3 py-2 text-xs text-slate-500">
                          {validacion.filasValidas} listo(s) para importar
                          {validacion.filasConError > 0
                            ? ` · ${validacion.filasConError} con error`
                            : ''}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            {error && <ErrorBanner title={error} className="mb-4" />}

            {resultado && (
              <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-medium text-slate-900 mb-2">Resultado de la importación</h3>
                <p className="text-sm text-slate-700 mb-3">
                  Importados: <strong>{resultado.exitosos}</strong> · Errores:{' '}
                  <strong>{resultado.errores.length}</strong>
                </p>
                {resultado.estudiantesCreados.length > 0 && (
                  <ul className="text-sm text-green-700 mb-3 max-h-32 overflow-y-auto space-y-1">
                    {resultado.estudiantesCreados.map((e) => (
                      <li key={e.id}>
                        Fila {e.fila}: {e.nombres} {e.apellidos} ({e.codigo_estudiantil})
                      </li>
                    ))}
                  </ul>
                )}
                {resultado.errores.length > 0 && (
                  <ul className="text-sm text-red-700 max-h-40 overflow-y-auto space-y-1 list-disc pl-5">
                    {resultado.errores.map((msg, i) => (
                      <li key={`${i}-${msg}`}>{msg}</li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </div>

      <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-[var(--color-border-light)]">
        <Button type="button" variant="outline" onClick={onClose}>
          {resultado?.exitosos ? 'Cerrar' : 'Cancelar'}
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={subirArchivo}
          disabled={!archivo || !validacion?.valido || subiendo || comprobando}
          title={!validacion?.valido ? 'Comprueba el archivo antes de importar' : undefined}
        >
          {subiendo ? 'Importando…' : 'Importar estudiantes'}
        </Button>
      </div>
    </Modal>
  );
}
