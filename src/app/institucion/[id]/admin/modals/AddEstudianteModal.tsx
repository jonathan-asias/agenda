'use client';

import { useState, useEffect } from 'react';

interface AddEstudianteModalProps {
  isOpen: boolean;
  onClose: () => void;
  institucionId: number;
  onSuccess: () => void;
}

interface Grado {
  id: number;
  nombre: string;
  nivel: string;
  cursos: Curso[];
}

interface Curso {
  id: number;
  nombre: string;
  jornada: string | null;
}

export default function AddEstudianteModal({ isOpen, onClose, institucionId, onSuccess }: AddEstudianteModalProps) {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    codigo_estudiantil: '',
    nombre_acudiente: '',
    correo_acudiente: '',
    telefono_acudiente: '',
    grado_id: 0,
    curso_id: 0
  });
  const [grados, setGrados] = useState<Grado[]>([]);
  const [cursosDisponibles, setCursosDisponibles] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingGrados, setLoadingGrados] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para validación secuencial
  const [erroresValidacion, setErroresValidacion] = useState<{[key: string]: string}>({});
  const [camposHabilitados, setCamposHabilitados] = useState<{[key: string]: boolean}>({
    nombres: true,
    apellidos: false,
    codigo_estudiantil: false,
    grado_id: false,
    curso_id: false,
    nombre_acudiente: false,
    telefono_acudiente: false,
    correo_acudiente: false
  });
  const [camposValidados, setCamposValidados] = useState<{[key: string]: boolean}>({
    nombres: false,
    apellidos: false,
    codigo_estudiantil: false,
    grado_id: false,
    curso_id: false,
    nombre_acudiente: false,
    telefono_acudiente: false,
    correo_acudiente: false
  });

  useEffect(() => {
    if (isOpen) {
      // Resetear formulario cuando se abre
      setFormData({ 
        nombres: '', 
        apellidos: '', 
        codigo_estudiantil: '', 
        nombre_acudiente: '', 
        correo_acudiente: '', 
        telefono_acudiente: '', 
        grado_id: 0, 
        curso_id: 0 
      });
      setError('');
      
      // Resetear validación secuencial
      setErroresValidacion({});
      setCamposHabilitados({
        nombres: true,
        apellidos: false,
        codigo_estudiantil: false,
        grado_id: false,
        curso_id: false,
        nombre_acudiente: false,
        telefono_acudiente: false,
        correo_acudiente: false
      });
      setCamposValidados({
        nombres: false,
        apellidos: false,
        codigo_estudiantil: false,
        grado_id: false,
        curso_id: false,
        nombre_acudiente: false,
        telefono_acudiente: false,
        correo_acudiente: false
      });
      
      fetchGrados();
    }
  }, [isOpen, institucionId]);

  // Función para validar email
  const validarEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para validar teléfono colombiano
  const validarTelefonoColombiano = (telefono: string) => {
    const telefonoLimpio = telefono.replace(/\s+/g, '').replace(/[^\d]/g, '');
    return telefonoLimpio.length === 10 && telefonoLimpio.startsWith('3');
  };

  // Función para validar campos secuencialmente
  const validarCampo = async (campo: string, valor: string | number) => {
    const errores = { ...erroresValidacion };
    const habilitados = { ...camposHabilitados };
    const validados = { ...camposValidados };
    
    switch (campo) {
      case 'nombres':
        if (valor && typeof valor === 'string' && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          errores[campo] = 'Solo se permiten letras y espacios';
          validados[campo] = false;
        } else if (valor && typeof valor === 'string' && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.apellidos = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'apellidos':
        if (valor && typeof valor === 'string' && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          errores[campo] = 'Solo se permiten letras y espacios';
          validados[campo] = false;
        } else if (valor && typeof valor === 'string' && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.codigo_estudiantil = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'codigo_estudiantil':
        if (valor && typeof valor === 'string' && valor.trim().length < 3) {
          errores[campo] = 'El código debe tener al menos 3 caracteres';
          validados[campo] = false;
        } else if (valor && typeof valor === 'string' && valor.trim().length >= 3) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.grado_id = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'grado_id':
        if (valor && typeof valor === 'number' && valor > 0) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.curso_id = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'curso_id':
        if (valor && typeof valor === 'number' && valor > 0) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.nombre_acudiente = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'nombre_acudiente':
        if (valor && typeof valor === 'string' && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          errores[campo] = 'Solo se permiten letras y espacios';
          validados[campo] = false;
        } else if (valor && typeof valor === 'string' && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.telefono_acudiente = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'telefono_acudiente':
        if (valor && typeof valor === 'string' && !validarTelefonoColombiano(valor.trim())) {
          errores[campo] = 'Número de celular colombiano inválido (10 dígitos empezando por 3)';
          validados[campo] = false;
        } else if (valor && typeof valor === 'string' && validarTelefonoColombiano(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.correo_acudiente = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'correo_acudiente':
        if (valor && typeof valor === 'string' && valor.trim() && !validarEmail(valor.trim())) {
          errores[campo] = 'Formato de email inválido';
          validados[campo] = false;
        } else if (valor && typeof valor === 'string' && (!valor.trim() || validarEmail(valor.trim()))) {
          delete errores[campo];
          validados[campo] = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
    }
    
    setErroresValidacion(errores);
    setCamposHabilitados(habilitados);
    setCamposValidados(validados);
  };

  const fetchGrados = async () => {
    setLoadingGrados(true);
    try {
      const response = await fetch(`/api/setup/grados/${institucionId}`);
      if (response.ok) {
        const data = await response.json();
        setGrados(data.grados || []);
      }
    } catch (error) {
      console.error('Error fetching grados:', error);
    } finally {
      setLoadingGrados(false);
    }
  };

  const handleGradoChange = (gradoId: number) => {
    const gradoSeleccionado = grados.find(g => g.id === gradoId);
    if (gradoSeleccionado) {
      setCursosDisponibles(gradoSeleccionado.cursos);
      setFormData({ ...formData, grado_id: gradoId, curso_id: 0 });
      validarCampo('grado_id', gradoId);
    } else {
      setCursosDisponibles([]);
      setFormData({ ...formData, grado_id: 0, curso_id: 0 });
      validarCampo('grado_id', 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validar que todos los campos estén completos y válidos
    if (!camposValidados.nombres || !camposValidados.apellidos || !camposValidados.codigo_estudiantil || 
        !camposValidados.grado_id || !camposValidados.curso_id || !camposValidados.nombre_acudiente || 
        !camposValidados.telefono_acudiente) {
      const camposFaltantes = [];
      if (!camposValidados.nombres) camposFaltantes.push('nombres');
      if (!camposValidados.apellidos) camposFaltantes.push('apellidos');
      if (!camposValidados.codigo_estudiantil) camposFaltantes.push('código estudiantil');
      if (!camposValidados.grado_id) camposFaltantes.push('grado');
      if (!camposValidados.curso_id) camposFaltantes.push('curso');
      if (!camposValidados.nombre_acudiente) camposFaltantes.push('nombre del acudiente');
      if (!camposValidados.telefono_acudiente) camposFaltantes.push('teléfono del acudiente');
      
      setError(`Por favor completa correctamente: ${camposFaltantes.join(', ')}`);
      setLoading(false);
      return;
    }

    // Validar que no haya errores de validación
    if (Object.keys(erroresValidacion).length > 0) {
      setError('Por favor corrige los errores antes de continuar');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/setup/estudiantes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          institucionId,
          estudiantes: [formData]
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al crear el estudiante');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Agregar Estudiante</h2>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                    disabled={!camposHabilitados.nombres}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 ${
                      erroresValidacion.nombres ? 'border-red-500' : 'border-slate-300'
                    } ${!camposHabilitados.nombres ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} placeholder-slate-500`}
                    placeholder="Nombres"
                    required
                  />
                  {erroresValidacion.nombres && (
                    <p className="text-red-500 text-xs mt-1">{erroresValidacion.nombres}</p>
                  )}
                  {camposValidados.nombres && !erroresValidacion.nombres && (
                    <p className="text-green-600 text-xs mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Nombres válidos
                    </p>
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
                    disabled={!camposHabilitados.apellidos}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 ${
                      erroresValidacion.apellidos ? 'border-red-500' : 'border-slate-300'
                    } ${!camposHabilitados.apellidos ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} placeholder-slate-500`}
                    placeholder="Apellidos"
                    required
                  />
                  {erroresValidacion.apellidos && (
                    <p className="text-red-500 text-xs mt-1">{erroresValidacion.apellidos}</p>
                  )}
                  {camposValidados.apellidos && !erroresValidacion.apellidos && (
                    <p className="text-green-600 text-xs mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Apellidos válidos
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Código Estudiantil *
                </label>
                <input
                  type="text"
                  value={formData.codigo_estudiantil}
                  onChange={(e) => {
                    setFormData({ ...formData, codigo_estudiantil: e.target.value });
                    validarCampo('codigo_estudiantil', e.target.value);
                  }}
                  disabled={!camposHabilitados.codigo_estudiantil}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 ${
                    erroresValidacion.codigo_estudiantil ? 'border-red-500' : 'border-slate-300'
                  } ${!camposHabilitados.codigo_estudiantil ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} placeholder-slate-500`}
                  placeholder="Ej: 2024001"
                  required
                />
                {erroresValidacion.codigo_estudiantil && (
                  <p className="text-red-500 text-xs mt-1">{erroresValidacion.codigo_estudiantil}</p>
                )}
                {camposValidados.codigo_estudiantil && !erroresValidacion.codigo_estudiantil && (
                  <p className="text-green-600 text-xs mt-1 flex items-center">
                    <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Código válido
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Grado *
                  </label>
                  {loadingGrados ? (
                    <div className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Cargando...
                    </div>
                  ) : (
                    <select
                      value={formData.grado_id}
                      onChange={(e) => handleGradoChange(parseInt(e.target.value))}
                      disabled={!camposHabilitados.grado_id}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 ${
                        erroresValidacion.grado_id ? 'border-red-500' : 'border-slate-300'
                      } ${!camposHabilitados.grado_id ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                      required
                    >
                      <option value={0}>Seleccionar grado</option>
                      {grados.map((grado) => (
                        <option key={grado.id} value={grado.id}>
                          {grado.nombre} - {grado.nivel}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Curso *
                  </label>
                  <select
                    value={formData.curso_id}
                    onChange={(e) => {
                      setFormData({ ...formData, curso_id: parseInt(e.target.value) });
                      validarCampo('curso_id', parseInt(e.target.value));
                    }}
                    disabled={!camposHabilitados.curso_id || cursosDisponibles.length === 0}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 ${
                      erroresValidacion.curso_id ? 'border-red-500' : 'border-slate-300'
                    } ${!camposHabilitados.curso_id ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                    required
                  >
                    <option value={0}>Seleccionar curso</option>
                    {cursosDisponibles.map((curso) => (
                      <option key={curso.id} value={curso.id}>
                        {curso.nombre} {curso.jornada ? `- ${curso.jornada}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-slate-700 mb-3">Información del Acudiente</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre del Acudiente *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre_acudiente}
                    onChange={(e) => {
                      setFormData({ ...formData, nombre_acudiente: e.target.value });
                      validarCampo('nombre_acudiente', e.target.value);
                    }}
                    disabled={!camposHabilitados.nombre_acudiente}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 ${
                      erroresValidacion.nombre_acudiente ? 'border-red-500' : 'border-slate-300'
                    } ${!camposHabilitados.nombre_acudiente ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} placeholder-slate-500`}
                    placeholder="Nombre completo del acudiente"
                    required
                  />
                  {erroresValidacion.nombre_acudiente && (
                    <p className="text-red-500 text-xs mt-1">{erroresValidacion.nombre_acudiente}</p>
                  )}
                  {camposValidados.nombre_acudiente && !erroresValidacion.nombre_acudiente && (
                    <p className="text-green-600 text-xs mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Nombre válido
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={formData.telefono_acudiente}
                      onChange={(e) => {
                        // Solo permitir números
                        const valorNumerico = e.target.value.replace(/[^\d]/g, '');
                        setFormData({ ...formData, telefono_acudiente: valorNumerico });
                        validarCampo('telefono_acudiente', valorNumerico);
                      }}
                      disabled={!camposHabilitados.telefono_acudiente}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 ${
                        erroresValidacion.telefono_acudiente ? 'border-red-500' : 'border-slate-300'
                      } ${!camposHabilitados.telefono_acudiente ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} placeholder-slate-500`}
                      placeholder="3001234567"
                      maxLength={10}
                      required
                    />
                    {erroresValidacion.telefono_acudiente && (
                      <p className="text-red-500 text-xs mt-1">{erroresValidacion.telefono_acudiente}</p>
                    )}
                    {camposValidados.telefono_acudiente && !erroresValidacion.telefono_acudiente && (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Teléfono válido
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.correo_acudiente}
                      onChange={(e) => {
                        setFormData({ ...formData, correo_acudiente: e.target.value });
                        validarCampo('correo_acudiente', e.target.value);
                      }}
                      disabled={!camposHabilitados.correo_acudiente}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 ${
                        erroresValidacion.correo_acudiente ? 'border-red-500' : 'border-slate-300'
                      } ${!camposHabilitados.correo_acudiente ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} placeholder-slate-500`}
                      placeholder="correo@ejemplo.com"
                    />
                    {erroresValidacion.correo_acudiente && (
                      <p className="text-red-500 text-xs mt-1">{erroresValidacion.correo_acudiente}</p>
                    )}
                    {camposValidados.correo_acudiente && !erroresValidacion.correo_acudiente && (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Email válido
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || loadingGrados}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-pink-400 transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  'Crear Estudiante'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
