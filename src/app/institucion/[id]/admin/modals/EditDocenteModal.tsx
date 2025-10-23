'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface Docente {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  sede: { nombre: string } | null;
  docenteAsignaciones: {
    grado: { nombre: string; nivel: string };
    curso: { nombre: string };
    materia: { nombre: string };
  }[];
}

interface Grado {
  id: number;
  nombre: string;
  nivel: string;
  cursos: { id: number; nombre: string; jornada: string | null }[];
}

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

      // Procesar asignaciones existentes
      const gradosExistentes = [...new Set(docente.docenteAsignaciones.map(a => a.grado.nombre))];
      const areasExistentes = [...new Set(docente.docenteAsignaciones.map(a => a.materia.nombre))];
      
      // TODO: Mapear nombres a IDs cuando se carguen los datos de la institución
      setGradosSeleccionados([]);
      setAreasSeleccionadas([]);
      
      cargarDatosInstitucion();
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
        await Swal.fire({
          icon: 'success',
          title: '¡Docente Actualizado!',
          text: `El docente "${formData.nombres} ${formData.apellidos}" se ha actualizado exitosamente`,
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#f97316',
          timer: 3000,
          timerProgressBar: true
        });
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

  if (!isOpen || !docente) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Editar Docente
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                <input
                  type="text"
                  value={formData.nombres}
                  onChange={(e) => {
                    setFormData({ ...formData, nombres: e.target.value });
                    validarCampo('nombres', e.target.value);
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 ${
                    erroresValidacion.nombres ? 'border-red-500' : 'border-slate-300'
                  } bg-white placeholder-slate-500`}
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
                <input
                  type="text"
                  value={formData.apellidos}
                  onChange={(e) => {
                    setFormData({ ...formData, apellidos: e.target.value });
                    validarCampo('apellidos', e.target.value);
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 ${
                    erroresValidacion.apellidos ? 'border-red-500' : 'border-slate-300'
                  } bg-white placeholder-slate-500`}
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                  placeholder="Email (no editable)"
                />
                <p className="text-xs text-slate-500 mt-1">El email no se puede modificar</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => {
                    const valorNumerico = e.target.value.replace(/[^\d]/g, '');
                    setFormData({ ...formData, telefono: valorNumerico });
                    validarCampo('telefono', valorNumerico);
                  }}
                  maxLength={10}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 ${
                    erroresValidacion.telefono ? 'border-red-500' : 'border-slate-300'
                  } bg-white placeholder-slate-500`}
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
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm text-slate-600">Seleccionar</span>
                        </label>
                      </div>
                      
                      {gradosSeleccionados.includes(grado.id) && (
                        <div className="ml-7 space-y-2 mt-3">
                          <p className="text-xs text-slate-600 mb-2">Selecciona los cursos:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {grado.cursos.map((curso) => (
                              <label key={curso.id} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={cursosPorGrado[grado.id]?.includes(curso.id) || false}
                                  onChange={() => toggleCurso(grado.id, curso.id)}
                                  className="w-3 h-3 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
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
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
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
                                  className="w-3 h-3 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
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

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-orange-400 transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Actualizando...
                </>
              ) : (
                'Actualizar Docente'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
