'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useMemo, useEffect } from 'react';

interface Asignacion {
  id: number;
  grado: {
    id: number;
    nombre: string;
    nivel: string;
  };
  curso: {
    id: number;
    nombre: string;
    jornada: string | null;
  };
  materia: {
    id: number;
    nombre: string;
    area: {
      id: number;
      nombre: string;
    };
  };
}

interface Estudiante {
  id: number;
  nombres: string;
  apellidos: string;
  codigo_estudiantil: string;
}

interface AddRecordatorioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  docenteId: number;
  institucionId: number;
  asignaciones?: Asignacion[];
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
      if (!gradosMap.has(asignacion.grado.id)) {
        gradosMap.set(asignacion.grado.id, asignacion.grado);
      }
      
      // Áreas
      if (!areasMap.has(asignacion.materia.area.id)) {
        areasMap.set(asignacion.materia.area.id, asignacion.materia.area);
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
      .filter(asignacion => asignacion.grado.id === gradoIdNum)
      .forEach(asignacion => {
        if (!cursosMap.has(asignacion.curso.id)) {
          cursosMap.set(asignacion.curso.id, asignacion.curso);
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
      .filter(asignacion => asignacion.materia.area.id === areaIdNum)
      .forEach(asignacion => {
        if (!materiasMap.has(asignacion.materia.id)) {
          materiasMap.set(asignacion.materia.id, {
            id: asignacion.materia.id,
            nombre: asignacion.materia.nombre
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Validaciones
    if (!formData.nombre.trim()) {
      setError('El nombre del recordatorio es requerido');
      setSubmitting(false);
      return;
    }

    if (!formData.tipo) {
      setError('El tipo de recordatorio es requerido');
      setSubmitting(false);
      return;
    }

    if (!formData.descripcion.trim()) {
      setError('La descripción es requerida');
      setSubmitting(false);
      return;
    }

    if (!formData.fecha) {
      setError('La fecha del recordatorio es requerida');
      setSubmitting(false);
      return;
    }

    // Validar que se seleccionen grado, curso, área y materia
    if (!formData.gradoId) {
      setError('Debes seleccionar un grado');
      setSubmitting(false);
      return;
    }

    if (!formData.cursoId) {
      setError('Debes seleccionar un curso');
      setSubmitting(false);
      return;
    }

    if (!formData.areaId) {
      setError('Debes seleccionar un área');
      setSubmitting(false);
      return;
    }

    if (!formData.materiaId) {
      setError('Debes seleccionar una materia');
      setSubmitting(false);
      return;
    }

    // Validar que la fecha no sea en el pasado
    const fechaSeleccionada = new Date(formData.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaSeleccionada < hoy) {
      setError('La fecha no puede ser anterior a hoy');
      setSubmitting(false);
      return;
    }

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
        setError(errorData.error || 'Error al crear el recordatorio. Por favor, intenta nuevamente.');
        setSubmitting(false);
        return;
      }

      resetForm();
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error al crear recordatorio:', err);
      setError('Error al crear el recordatorio. Por favor, intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
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
    setEstudiantes([]);
    setEstudiantesSeleccionados([]);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  // Obtener la fecha mínima (hoy)
  const hoy = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] flex flex-col">
        <div className="bg-white border-b border-slate-200 p-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">➕ Agregar Recordatorio</h2>
              <p className="text-slate-600">Crea un nuevo recordatorio para organizar tus actividades</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-7 h-7 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
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
          
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="flex space-x-4 pt-4 border-t border-slate-200 mt-6 flex-shrink-0">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Creando Recordatorio...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Crear Recordatorio
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-200 border-2 border-slate-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

