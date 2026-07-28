'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, type InputHTMLAttributes } from 'react';
import { showSuccess } from '@/lib/notifications';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import ErrorBanner from '@/components/ui/ErrorBanner';
import type { Docente, Grado } from '@/types';

interface Area {
  id: number;
  nombre: string;
  materias: { id: number; nombre: string }[];
}

interface EditDocenteModalProps {
  isOpen: boolean;
  onClose: () => void;
  docente: Docente | null;
  institucionId: number;
  onSuccess: () => void;
}

function BufferedEditInput({
  value,
  onCommit,
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onBlur'> & {
  value: string;
  onCommit: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  return (
    <input
      {...props}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => {
        if (draft !== value) onCommit(draft);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur();
      }}
      className={`form-quiet-focus ${className || ''}`.trim()}
    />
  );
}

export default function EditDocenteModal({ 
  isOpen, 
  onClose, 
  docente, 
  institucionId, 
  onSuccess 
}: EditDocenteModalProps) {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    telefono: ''
  });

  // Estados para asignaciones
  const [gradosSeleccionados, setGradosSeleccionados] = useState<number[]>([]);
  const [cursosPorGrado, setCursosPorGrado] = useState<{[gradoId: number]: number[]}>({});
  const [areasSeleccionadas, setAreasSeleccionadas] = useState<number[]>([]);
  const [materiasPorArea, setMateriasPorArea] = useState<{[areaId: number]: number[]}>({});
  
  // Estados para datos de la institución
  const [gradosInstitucion, setGradosInstitucion] = useState<Grado[]>([]);
  const [areasInstitucion, setAreasInstitucion] = useState<Area[]>([]);
  const [materiasInstitucion, setMateriasInstitucion] = useState<{[areaId: number]: any[]}>({});
  const [loadingData, setLoadingData] = useState(false);
  
  // Estados de validación
  const [erroresValidacion, setErroresValidacion] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos del docente cuando se abre el modal
  useEffect(() => {
    if (isOpen && docente) {
      setFormData({
        nombres: docente.nombres,
        apellidos: docente.apellidos,
        telefono: docente.telefono
      });

      setGradosSeleccionados([]);
      setCursosPorGrado({});
      setAreasSeleccionadas([]);
      setMateriasPorArea({});

      const loadAndMapAssignments = async () => {
        await cargarDatosInstitucion();

        if (docente.docenteAsignaciones && docente.docenteAsignaciones.length > 0) {
          const gradosIds = [...new Set(
            docente.docenteAsignaciones
              .map(a => a.grado?.id)
              .filter((id): id is number => id !== undefined)
          )];
          setGradosSeleccionados(gradosIds);

          const cursosMap: { [gradoId: number]: number[] } = {};
          docente.docenteAsignaciones.forEach(asignacion => {
            const gradoId = asignacion.grado?.id;
            const cursoId = asignacion.curso?.id;
            if (gradoId == null || cursoId == null) return;
            if (!cursosMap[gradoId]) {
              cursosMap[gradoId] = [];
            }
            if (!cursosMap[gradoId].includes(cursoId)) {
              cursosMap[gradoId].push(cursoId);
            }
          });
          setCursosPorGrado(cursosMap);

          const areasIds = [...new Set(
            docente.docenteAsignaciones
              .map(a => a.materia.area?.id)
              .filter((id): id is number => id !== undefined)
          )];
          setAreasSeleccionadas(areasIds);

          const materiasMap: { [areaId: number]: number[] } = {};
          docente.docenteAsignaciones.forEach(asignacion => {
            const areaId = asignacion.materia?.area?.id;
            const materiaId = asignacion.materia?.id;
            if (areaId != null && materiaId != null) {
              if (!materiasMap[areaId]) {
                materiasMap[areaId] = [];
              }
              if (!materiasMap[areaId].includes(materiaId)) {
                materiasMap[areaId].push(materiaId);
              }
            }
          });
          setMateriasPorArea(materiasMap);
        }
      };

      loadAndMapAssignments();
    }
  }, [isOpen, docente]);

  const cargarDatosInstitucion = async () => {
    setLoadingData(true);
    try {
      const response = await fetch(`/api/instituciones/${institucionId}/dashboard`);
      if (response.ok) {
        const data = await response.json();
        setGradosInstitucion(data.datos?.grados || []);
        setAreasInstitucion(data.datos?.areas || []);
        
        // Procesar materias por área
        const materiasPorAreaData: {[areaId: number]: any[]} = {};
        (data.datos?.areas || []).forEach((area: any) => {
          materiasPorAreaData[area.id] = area.materias || [];
        });
        setMateriasInstitucion(materiasPorAreaData);
      }
    } catch (error) {
      console.error('Error cargando datos de la institución:', error);
    } finally {
      setLoadingData(false);
    }
  };

  // Funciones para manejar grados y cursos
  const toggleGrado = (gradoId: number) => {
    const nuevoGradosSeleccionados = gradosSeleccionados.includes(gradoId)
      ? gradosSeleccionados.filter(id => id !== gradoId)
      : [...gradosSeleccionados, gradoId];
    
    setGradosSeleccionados(nuevoGradosSeleccionados);
    
    // Limpiar cursos del grado si se deselecciona
    if (!nuevoGradosSeleccionados.includes(gradoId)) {
      const nuevosCursos = { ...cursosPorGrado };
      delete nuevosCursos[gradoId];
      setCursosPorGrado(nuevosCursos);
    }
  };

  const toggleCurso = (gradoId: number, cursoId: number) => {
    const cursosDelGrado = cursosPorGrado[gradoId] || [];
    const nuevosCursos = cursosDelGrado.includes(cursoId)
      ? cursosDelGrado.filter(id => id !== cursoId)
      : [...cursosDelGrado, cursoId];
    
    setCursosPorGrado({
      ...cursosPorGrado,
      [gradoId]: nuevosCursos
    });
  };

  // Funciones para manejar áreas y materias
  const toggleArea = (areaId: number) => {
    const nuevasAreasSeleccionadas = areasSeleccionadas.includes(areaId)
      ? areasSeleccionadas.filter(id => id !== areaId)
      : [...areasSeleccionadas, areaId];
    
    setAreasSeleccionadas(nuevasAreasSeleccionadas);
    
    // Limpiar materias del área si se deselecciona
    if (!nuevasAreasSeleccionadas.includes(areaId)) {
      const nuevasMaterias = { ...materiasPorArea };
      delete nuevasMaterias[areaId];
      setMateriasPorArea(nuevasMaterias);
    }
  };

  const toggleMateria = (areaId: number, materiaId: number) => {
    const materiasDelArea = materiasPorArea[areaId] || [];
    const nuevasMaterias = materiasDelArea.includes(materiaId)
      ? materiasDelArea.filter(id => id !== materiaId)
      : [...materiasDelArea, materiaId];
    
    setMateriasPorArea({
      ...materiasPorArea,
      [areaId]: nuevasMaterias
    });
  };

  // Validación de campos
  const validarCampo = (campo: string, valor: string) => {
    const errores = { ...erroresValidacion };
    
    switch (campo) {
      case 'nombres':
        if (valor && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          errores[campo] = 'Solo se permiten letras y espacios';
        } else {
          delete errores[campo];
        }
        break;
      case 'apellidos':
        if (valor && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          errores[campo] = 'Solo se permiten letras y espacios';
        } else {
          delete errores[campo];
        }
        break;
      case 'telefono':
        const telefonoLimpio = valor.replace(/\s+/g, '').replace(/[^\d]/g, '');
        if (valor && telefonoLimpio.length !== 10) {
          errores[campo] = 'El teléfono debe tener 10 dígitos';
        } else if (valor && !telefonoLimpio.startsWith('3')) {
          errores[campo] = 'El teléfono debe empezar con 3';
        } else {
          delete errores[campo];
        }
        break;
    }
    
    setErroresValidacion(errores);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validar campos básicos
    if (!formData.nombres.trim() || !formData.apellidos.trim() || !formData.telefono.trim()) {
      setError('Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    // Validar que no haya errores de validación
    if (Object.keys(erroresValidacion).length > 0) {
      setError('Por favor corrige los errores antes de continuar');
      setLoading(false);
      return;
    }

    // Validar que se hayan seleccionado asignaciones
    if (gradosSeleccionados.length === 0) {
      setError('Debes seleccionar al menos un grado para asignar al docente');
      setLoading(false);
      return;
    }

    try {
      // Preparar asignaciones en el formato esperado por la API
      const materiasPorGrado: {[gradoId: number]: number[]} = {};
      
      // Para cada grado seleccionado, obtener todas las materias de las áreas seleccionadas
      gradosSeleccionados.forEach(gradoId => {
        const materiasDelGrado: number[] = [];
        
        // Obtener todas las materias de las áreas seleccionadas
        areasSeleccionadas.forEach(areaId => {
          const materiasDelArea = materiasPorArea[areaId] || [];
          materiasDelGrado.push(...materiasDelArea);
        });
        
        // Eliminar duplicados
        materiasPorGrado[gradoId] = [...new Set(materiasDelGrado)];
      });

      const asignaciones = {
        grados: gradosSeleccionados,
        cursos: cursosPorGrado,
        materias: materiasPorGrado
      };

      console.log('Enviando actualización:', { formData, asignaciones });

      const response = await fetch(`/api/docentes/${docente?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          asignaciones: asignaciones
        }),
      });

      if (response.ok) {
        await showSuccess('Docente actualizado', `Se actualizó a ${formData.nombres} ${formData.apellidos}.`);
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al actualizar el docente');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (!docente) return null;

  return (
    <Modal open={isOpen} onClose={onClose} title="Editar docente" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombres *
                </label>
                <BufferedEditInput
                  type="text"
                  value={formData.nombres}
                  onCommit={(value) => {
                    setFormData((prev) => ({ ...prev, nombres: value }));
                    validarCampo('nombres', value);
                  }}
                  className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 transition-all duration-200 placeholder:text-slate-400 ${
                    erroresValidacion.nombres ? 'border-[var(--color-danger-border-input)]' : ''
                  }`}
                  placeholder="Nombres"
                  required
                />
                {erroresValidacion.nombres && (
                  <p className="text-red-500 text-xs mt-1">{erroresValidacion.nombres}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Apellidos *
                </label>
                <BufferedEditInput
                  type="text"
                  value={formData.apellidos}
                  onCommit={(value) => {
                    setFormData((prev) => ({ ...prev, apellidos: value }));
                    validarCampo('apellidos', value);
                  }}
                  className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 transition-all duration-200 placeholder:text-slate-400 ${
                    erroresValidacion.apellidos ? 'border-[var(--color-danger-border-input)]' : ''
                  }`}
                  placeholder="Apellidos"
                  required
                />
                {erroresValidacion.apellidos && (
                  <p className="text-red-500 text-xs mt-1">{erroresValidacion.apellidos}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={docente.email}
                  disabled
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                  placeholder="Email (no editable)"
                />
                <p className="text-xs text-slate-500 mt-1">El email no se puede modificar</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Teléfono *
                </label>
                <BufferedEditInput
                  type="tel"
                  value={formData.telefono}
                  onCommit={(value) => {
                    const valorNumerico = value.replace(/[^\d]/g, '');
                    setFormData((prev) => ({ ...prev, telefono: valorNumerico }));
                    validarCampo('telefono', valorNumerico);
                  }}
                  maxLength={10}
                  className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 transition-all duration-200 placeholder:text-slate-400 ${
                    erroresValidacion.telefono ? 'border-[var(--color-danger-border-input)]' : ''
                  }`}
                  placeholder="3001234567"
                  required
                />
                {erroresValidacion.telefono && (
                  <p className="text-red-500 text-xs mt-1">{erroresValidacion.telefono}</p>
                )}
              </div>
            </div>
          </div>

          {/* Asignaciones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grados y Cursos */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Grados y Cursos
              </h3>
              {loadingData ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
                  {gradosInstitucion.map((grado) => (
                    <div key={grado.id} className="border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-slate-900">{grado.nombre}</span>
                          <span className="text-sm text-slate-600 ml-2">({grado.nivel})</span>
                        </div>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={gradosSeleccionados.includes(grado.id)}
                            onChange={() => toggleGrado(grado.id)}
                            className="form-quiet-focus h-4 w-4 rounded border-slate-300 text-indigo-600"
                          />
                          <span className="text-sm text-slate-600">Seleccionar</span>
                        </label>
                      </div>
                      
                      {gradosSeleccionados.includes(grado.id) && (
                        <div className="ml-7 space-y-2 mt-3">
                          <p className="text-xs text-slate-600 mb-2">Selecciona los cursos:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(grado.cursos ?? []).map((curso) => (
                              <label key={curso.id} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={cursosPorGrado[grado.id]?.includes(curso.id) || false}
                                  onChange={() => toggleCurso(grado.id, curso.id)}
                                  className="form-quiet-focus h-3 w-3 rounded border-slate-300 text-indigo-600"
                                />
                                <span className="text-xs text-slate-700">{curso.nombre}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Áreas y Materias */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Áreas y Materias
              </h3>
              {loadingData ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
                  {areasInstitucion.map((area) => (
                    <div key={area.id} className="border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-slate-900">{area.nombre}</span>
                        </div>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={areasSeleccionadas.includes(area.id)}
                            onChange={() => toggleArea(area.id)}
                            className="form-quiet-focus h-4 w-4 rounded border-slate-300 text-indigo-600"
                          />
                          <span className="text-sm text-slate-600">Seleccionar</span>
                        </label>
                      </div>
                      
                      {areasSeleccionadas.includes(area.id) && (
                        <div className="ml-7 space-y-2 mt-3">
                          <p className="text-xs text-slate-600 mb-2">Selecciona las materias:</p>
                          <div className="grid grid-cols-1 gap-2">
                            {materiasInstitucion[area.id]?.map((materia) => (
                              <label key={materia.id} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={materiasPorArea[area.id]?.includes(materia.id) || false}
                                  onChange={() => toggleMateria(area.id, materia.id)}
                                  className="form-quiet-focus h-3 w-3 rounded border-slate-300 text-indigo-600"
                                />
                                <span className="text-xs text-slate-700">{materia.nombre}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && <ErrorBanner title={error} />}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-[var(--color-border-light)]">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Guardando…' : 'Guardar cambios'}
            </Button>
          </div>
      </form>
    </Modal>
  );
}
