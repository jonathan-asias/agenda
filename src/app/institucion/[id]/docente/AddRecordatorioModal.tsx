'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useMemo, useEffect } from 'react';
import { showConfirm } from '@/lib/notifications';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import ErrorBanner from '@/components/ui/ErrorBanner';
import type { AsignacionLike } from '@/types/docente';
import type { Estudiante } from '@/types/estudiante';

interface AddRecordatorioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  docenteId: number;
  institucionId: number;
  asignaciones?: AsignacionLike[];
}

export default function AddRecordatorioModal({
  isOpen,
  onClose,
  onSuccess,
  docenteId,
  institucionId,
  asignaciones = []
}: AddRecordatorioModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    descripcion: '',
    fecha: '',
    gradoId: '',
    cursoId: '',
    areaId: '',
    materiaId: ''
  });
  const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState<number[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cargandoEstudiantes, setCargandoEstudiantes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fase, setFase] = useState<'form' | 'preview'>('form');
  const [modoEnvio, setModoEnvio] = useState<string[]>([]);

  const opcionesModoEnvio = [
    { value: 'sms', label: 'SMS' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'email', label: 'Email' }
  ];

  const tiposRecordatorio = [
    { value: 'tarea', label: 'Tarea' },
    { value: 'examen', label: 'Examen' },
    { value: 'evento', label: 'Evento' },
    { value: 'otro', label: 'Otro' }
  ];

  // Extraer valores únicos iniciales de las asignaciones
  const opcionesIniciales = useMemo(() => {
    const gradosMap = new Map<number, { id: number; nombre: string; nivel: string }>();
    const areasMap = new Map<number, { id: number; nombre: string }>();

    asignaciones.forEach(asignacion => {
      // Grados
      const grado = asignacion.grado;
      if (grado?.id != null && !gradosMap.has(grado.id)) {
        gradosMap.set(grado.id, { id: grado.id, nombre: grado.nombre, nivel: grado.nivel });
      }

      // Áreas
      const area = asignacion.materia?.area;
      if (area?.id != null && !areasMap.has(area.id)) {
        areasMap.set(area.id, { id: area.id, nombre: area.nombre });
      }
    });

    return {
      grados: Array.from(gradosMap.values()),
      areas: Array.from(areasMap.values())
    };
  }, [asignaciones]);

  // Filtrar cursos basándose en el grado seleccionado
  const cursosFiltrados = useMemo(() => {
    if (!formData.gradoId) return [];
    
    const gradoIdNum = parseInt(formData.gradoId);
    const cursosMap = new Map<number, { id: number; nombre: string; jornada: string | null }>();
    
    asignaciones
      .filter(asignacion => asignacion.grado?.id === gradoIdNum)
      .forEach(asignacion => {
        const curso = asignacion.curso;
        if (curso?.id != null && !cursosMap.has(curso.id)) {
          cursosMap.set(curso.id, { id: curso.id, nombre: curso.nombre, jornada: curso.jornada ?? null });
        }
      });

    return Array.from(cursosMap.values());
  }, [asignaciones, formData.gradoId]);

  // Filtrar materias basándose en el área seleccionada
  const materiasFiltradas = useMemo(() => {
    if (!formData.areaId) return [];
    
    const areaIdNum = parseInt(formData.areaId);
    const materiasMap = new Map<number, { id: number; nombre: string }>();
    
    asignaciones
      .filter(asignacion => asignacion.materia?.area?.id === areaIdNum)
      .forEach(asignacion => {
        const materia = asignacion.materia;
        if (materia?.id != null && !materiasMap.has(materia.id)) {
          materiasMap.set(materia.id, {
            id: materia.id,
            nombre: materia.nombre
          });
        }
      });

    return Array.from(materiasMap.values());
  }, [asignaciones, formData.areaId]);

  // Cargar estudiantes cuando se selecciona un curso
  useEffect(() => {
    const cargarEstudiantes = async () => {
      if (!formData.cursoId) {
        setEstudiantes([]);
        setEstudiantesSeleccionados([]);
        return;
      }

      setCargandoEstudiantes(true);
      try {
        const response = await fetch(
          `/api/estudiantes/by-curso/${formData.cursoId}?institucionId=${institucionId}`
        );
        if (response.ok) {
          const data = await response.json();
          setEstudiantes(data.estudiantes || []);
        } else {
          console.error('Error al cargar estudiantes:', response.statusText);
          setEstudiantes([]);
        }
      } catch (error) {
        console.error('Error al cargar estudiantes:', error);
        setEstudiantes([]);
      } finally {
        setCargandoEstudiantes(false);
      }
    };

    cargarEstudiantes();
  }, [formData.cursoId, institucionId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error al escribir
    if (error) setError('');
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => {
      const newData: any = { ...prev, [name]: value };
      
      // Si se cambia el grado, limpiar curso y estudiantes
      if (name === 'gradoId') {
        newData.cursoId = '';
        setEstudiantes([]);
        setEstudiantesSeleccionados([]);
      }
      
      // Si se cambia el curso, limpiar estudiantes
      if (name === 'cursoId') {
        setEstudiantesSeleccionados([]);
      }
      
      // Si se cambia el área, limpiar materia
      if (name === 'areaId') {
        newData.materiaId = '';
      }
      
      return newData;
    });
    // Limpiar error al seleccionar
    if (error) setError('');
  };

  const handleEstudianteToggle = (estudianteId: number) => {
    setEstudiantesSeleccionados(prev => {
      if (prev.includes(estudianteId)) {
        return prev.filter(id => id !== estudianteId);
      } else {
        return [...prev, estudianteId];
      }
    });
    // Limpiar error al seleccionar
    if (error) setError('');
  };

  const handleSeleccionarTodos = () => {
    if (estudiantesSeleccionados.length === estudiantes.length) {
      setEstudiantesSeleccionados([]);
    } else {
      setEstudiantesSeleccionados(estudiantes.map(e => e.id));
    }
  };

  const validarFormulario = (): boolean => {
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
    const fechaSeleccionada = new Date(formData.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaSeleccionada < hoy) {
      setError('La fecha no puede ser anterior a hoy');
      return false;
    }
    if (modoEnvio.length === 0) {
      setError('Selecciona al menos un método de envío (SMS, WhatsApp o Email)');
      return false;
    }
    if (estudiantesSeleccionados.length === 0) {
      setError('Selecciona al menos un estudiante para enviar el recordatorio');
      return false;
    }
    return true;
  };

  const enviarRecordatorio = async () => {
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/recordatorios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          descripcion: formData.descripcion.trim(),
          fecha: formData.fecha,
          tipo: formData.tipo,
          modoEnvio: modoEnvio,
          docenteId: docenteId,
          gradoId: parseInt(formData.gradoId),
          cursoId: parseInt(formData.cursoId),
          areaId: parseInt(formData.areaId),
          materiaId: parseInt(formData.materiaId),
          estudiantesSeleccionados: estudiantesSeleccionados
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'No pudimos crear el recordatorio. Intenta de nuevo.');
        setSubmitting(false);
        return;
      }

      resetForm();
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error al crear recordatorio:', err);
      setError('No pudimos crear el recordatorio. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validarFormulario()) {
      return;
    }

    if (fase === 'form') {
      setFase('preview');
      return;
    }

    const destinatarios =
      estudiantesSeleccionados.length === estudiantes.length
        ? `todos los acudientes del curso (${estudiantesSeleccionados.length})`
        : `${estudiantesSeleccionados.length} acudiente${estudiantesSeleccionados.length !== 1 ? 's' : ''}`;

    const confirmed = await showConfirm({
      title: '¿Enviar recordatorio?',
      text: `Se notificará a ${destinatarios} por ${modoEnvio.join(', ')}.`,
      confirmButtonText: 'Enviar recordatorio',
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
      materiaId: ''
    });
    setModoEnvio([]);
    setEstudiantes([]);
    setEstudiantesSeleccionados([]);
    setError('');
    setFase('form');
  };

  const toggleModoEnvio = (value: string) => {
    setModoEnvio(prev =>
      prev.includes(value) ? prev.filter(m => m !== value) : [...prev, value]
    );
    if (error) setError('');
  };

  const handleClose = () => {
    resetForm();
    setFase('form');
    onClose();
  };

  if (!isOpen) return null;

  const hoy = new Date().toISOString().split('T')[0];

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Agregar recordatorio"
      size="xl"
      className="max-w-3xl"
    >
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">
        Crea un recordatorio para organizar tareas, exámenes o eventos con tus estudiantes.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre del Recordatorio */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Nombre del Recordatorio <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              maxLength={255}
              className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400"
              placeholder="Ej: Revisar exámenes de Matemáticas"
            />
          </div>

          {/* Tipo de Recordatorio */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Tipo de Recordatorio <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer pr-10"
              >
                <option value="">Selecciona un tipo</option>
                {tiposRecordatorio.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Selecciona el tipo de recordatorio
            </p>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              required
              rows={4}
              maxLength={1000}
              className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 resize-none"
              placeholder="Describe los detalles del recordatorio..."
            />
            <p className="text-xs text-slate-500">
              {formData.descripcion.length}/1000 caracteres
            </p>
          </div>

          {/* Fecha del Recordatorio */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Fecha del Recordatorio <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              required
              min={hoy}
              className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            <p className="text-xs text-slate-500">
              Selecciona la fecha para la cual es el recordatorio
            </p>
          </div>

          {/* Modo de envío del recordatorio */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Método de envío del recordatorio <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Elige cómo quieres que se envíe el recordatorio a los estudiantes (puedes seleccionar uno o varios).
            </p>
            <div className="flex flex-wrap gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              {opcionesModoEnvio.map((opcion) => (
                <label
                  key={opcion.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={modoEnvio.includes(opcion.value)}
                    onChange={() => toggleModoEnvio(opcion.value)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-slate-800 font-medium">{opcion.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Área */}
          {opcionesIniciales.areas.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Área <span className="text-red-500">*</span>
              </label>
              <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 space-y-2 max-h-48 overflow-y-auto">
                {opcionesIniciales.areas.map((area) => (
                  <label
                    key={area.id}
                    className="flex items-center p-3 rounded-lg hover:bg-white cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="areaId"
                      value={area.id.toString()}
                      checked={formData.areaId === area.id.toString()}
                      onChange={(e) => handleRadioChange('areaId', e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-3 text-slate-800">{area.nombre}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Materia - Solo aparece cuando se ha seleccionado un área */}
          {formData.areaId && materiasFiltradas.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Materia <span className="text-red-500">*</span>
              </label>
              <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 space-y-2 max-h-48 overflow-y-auto">
                {materiasFiltradas.map((materia) => (
                  <label
                    key={materia.id}
                    className="flex items-center p-3 rounded-lg hover:bg-white cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="materiaId"
                      value={materia.id.toString()}
                      checked={formData.materiaId === materia.id.toString()}
                      onChange={(e) => handleRadioChange('materiaId', e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-3 text-slate-800">{materia.nombre}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Grado */}
          {opcionesIniciales.grados.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Grado <span className="text-red-500">*</span>
              </label>
              <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 space-y-2 max-h-48 overflow-y-auto">
                {opcionesIniciales.grados.map((grado) => (
                  <label
                    key={grado.id}
                    className="flex items-center p-3 rounded-lg hover:bg-white cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="gradoId"
                      value={grado.id.toString()}
                      checked={formData.gradoId === grado.id.toString()}
                      onChange={(e) => handleRadioChange('gradoId', e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-3 text-slate-800">
                      {grado.nombre} <span className="text-slate-500 text-sm">({grado.nivel})</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Curso - Solo aparece cuando se ha seleccionado un grado */}
          {formData.gradoId && cursosFiltrados.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Curso <span className="text-red-500">*</span>
              </label>
              <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 space-y-2 max-h-48 overflow-y-auto">
                {cursosFiltrados.map((curso) => (
                  <label
                    key={curso.id}
                    className="flex items-center p-3 rounded-lg hover:bg-white cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="cursoId"
                      value={curso.id.toString()}
                      checked={formData.cursoId === curso.id.toString()}
                      onChange={(e) => handleRadioChange('cursoId', e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-3 text-slate-800">
                      {curso.nombre}
                      {curso.jornada && (
                        <span className="text-slate-500 text-sm"> ({curso.jornada})</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Estudiantes - Solo aparece cuando se ha seleccionado un curso */}
          {formData.cursoId && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700">
                  Estudiantes
                </label>
                {estudiantes.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSeleccionarTodos}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {estudiantesSeleccionados.length === estudiantes.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                  </button>
                )}
              </div>
              {cargandoEstudiantes ? (
                <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-slate-600 text-sm">Cargando estudiantes...</p>
                </div>
              ) : estudiantes.length > 0 ? (
                <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 space-y-2 max-h-64 overflow-y-auto">
                  {estudiantes.map((estudiante) => (
                    <label
                      key={estudiante.id}
                      className="flex items-center p-3 rounded-lg hover:bg-white cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={estudiantesSeleccionados.includes(estudiante.id)}
                        onChange={() => handleEstudianteToggle(estudiante.id)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded"
                      />
                      <span className="ml-3 text-slate-800 flex-1">
                        {estudiante.nombres} {estudiante.apellidos}
                        {estudiante.codigo_estudiantil && (
                          <span className="text-slate-500 text-sm ml-2">
                            ({estudiante.codigo_estudiantil})
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-center">
                  <p className="text-slate-600 text-sm">No hay estudiantes en este curso</p>
                </div>
              )}
              {estudiantesSeleccionados.length > 0 && (
                <p className="text-xs text-slate-500">
                  {estudiantesSeleccionados.length} estudiante{estudiantesSeleccionados.length !== 1 ? 's' : ''} seleccionado{estudiantesSeleccionados.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}
          
          {error && <ErrorBanner title={error} />}

          {fase === 'preview' && (
            <section className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface-nested)] p-4 space-y-2" aria-label="Vista previa del recordatorio">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Vista previa</h3>
              <p className="text-sm"><strong>{formData.nombre}</strong> · {tiposRecordatorio.find(t => t.value === formData.tipo)?.label}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">{formData.descripcion}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Fecha: {formData.fecha} · Envío: {modoEnvio.join(', ')} · {estudiantesSeleccionados.length} destinatario{estudiantesSeleccionados.length !== 1 ? 's' : ''}
              </p>
            </section>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[var(--color-border-light)]">
            {fase === 'preview' && (
              <Button type="button" variant="outline" onClick={() => setFase('form')}>
                Volver a editar
              </Button>
            )}
            <Button type="submit" variant="primary" disabled={submitting} className="flex-1">
              {submitting ? 'Enviando…' : fase === 'form' ? 'Revisar y enviar' : 'Confirmar envío'}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
          </div>
      </form>
    </Modal>
  );
}

