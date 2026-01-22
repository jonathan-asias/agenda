'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface AddDocenteModalProps {
  isOpen: boolean;
  onClose: () => void;
  institucionId: number;
  onSuccess: () => void;
}

// Grados predeterminados del sistema
const gradosPredeterminados = [
  // Educación Inicial
  { id: 1, nombre: 'PÁRVULOS', nivel: 'Educación Inicial', orden: 1 },
  { id: 2, nombre: 'PRE-JARDÍN', nivel: 'Educación Inicial', orden: 2 },
  { id: 3, nombre: 'JARDÍN', nivel: 'Educación Inicial', orden: 3 },
  { id: 4, nombre: 'TRANSICIÓN', nivel: 'Educación Inicial', orden: 4 },
  
  // Primaria
  { id: 5, nombre: '1°', nivel: 'Primaria', orden: 5 },
  { id: 6, nombre: '2°', nivel: 'Primaria', orden: 6 },
  { id: 7, nombre: '3°', nivel: 'Primaria', orden: 7 },
  { id: 8, nombre: '4°', nivel: 'Primaria', orden: 8 },
  { id: 9, nombre: '5°', nivel: 'Primaria', orden: 9 },
  
  // Secundaria
  { id: 10, nombre: '6°', nivel: 'Secundaria', orden: 10 },
  { id: 11, nombre: '7°', nivel: 'Secundaria', orden: 11 },
  { id: 12, nombre: '8°', nivel: 'Secundaria', orden: 12 },
  { id: 13, nombre: '9°', nivel: 'Secundaria', orden: 13 },
  
  // Media
  { id: 14, nombre: '10°', nivel: 'Media', orden: 14 },
  { id: 15, nombre: '11°', nivel: 'Media', orden: 15 }
];

// Áreas predeterminadas del sistema
const areasPredeterminadas = [
  { id: 1, nombre: 'Ciencias naturales y educación ambiental', es_opcional: false, orden: 1 },
  { id: 2, nombre: 'Ciencias sociales, historia, geografía, constitución política y democracia', es_opcional: false, orden: 2 },
  { id: 3, nombre: 'Educación artística y cultural', es_opcional: false, orden: 3 },
  { id: 4, nombre: 'Educación ética y en valores humanos', es_opcional: false, orden: 4 },
  { id: 5, nombre: 'Educación física, recreación y deportes', es_opcional: false, orden: 5 },
  { id: 6, nombre: 'Educación religiosa', es_opcional: false, orden: 6 },
  { id: 7, nombre: 'Humanidades, lengua castellana e idiomas extranjeros', es_opcional: false, orden: 7 },
  { id: 8, nombre: 'Matemáticas', es_opcional: false, orden: 8 },
  { id: 9, nombre: 'Tecnología e informática', es_opcional: false, orden: 9 },
  { id: 10, nombre: 'Filosofía', es_opcional: true, orden: 10 },
  { id: 11, nombre: 'Educación sexual', es_opcional: true, orden: 11 },
  { id: 12, nombre: 'Cátedras y emprendimiento', es_opcional: true, orden: 12 },
  { id: 13, nombre: 'Comportamiento y disciplina', es_opcional: true, orden: 13 }
];


export default function AddDocenteModal({ isOpen, onClose, institucionId, onSuccess }: AddDocenteModalProps) {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    telefono: '',
    email: '',
    password: ''
  });

  // Estados para asignaciones
  const [asignacionesGradoCurso, setAsignacionesGradoCurso] = useState<{
    gradoId: number;
    cursoId: number;
    gradoNombre: string;
    cursoNombre: string;
    materiasSeleccionadas: number[];
  }[]>([]);

  const [gradosSeleccionados, setGradosSeleccionados] = useState<number[]>([]);
  const [cursosPorGrado, setCursosPorGrado] = useState<{[gradoId: number]: number[]}>({});
  const [areasSeleccionadas, setAreasSeleccionadas] = useState<number[]>([]);
  const [materiasPorArea, setMateriasPorArea] = useState<{[areaId: number]: number[]}>({});
  
  // Estados adicionales
  const [gradosInstitucion, setGradosInstitucion] = useState<any[]>([]);
  const [cursosInstitucion, setCursosInstitucion] = useState<{[gradoId: number]: any[]}>({});
  const [areasInstitucion, setAreasInstitucion] = useState<any[]>([]);
  const [materiasInstitucion, setMateriasInstitucion] = useState<{[areaId: number]: any[]}>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [verificandoEmail, setVerificandoEmail] = useState(false);
  const [emailVerificado, setEmailVerificado] = useState(false);
  
  // Estados para validación secuencial
  const [erroresValidacion, setErroresValidacion] = useState<{[key: string]: string}>({});
  const [camposHabilitados, setCamposHabilitados] = useState<{[key: string]: boolean}>({
    nombres: true,
    apellidos: false,
    telefono: false,
    email: false,
    password: false
  });
  const [camposValidados, setCamposValidados] = useState<{[key: string]: boolean}>({
    nombres: false,
    apellidos: false,
    telefono: false,
    email: false,
    password: false
  });

  const generarPassword = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    setFormData({ ...formData, password });
    // Validar automáticamente la contraseña generada
    validarCampo('password', password);
  };

  // Función para validar email
  const validarEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para validar teléfono celular colombiano
  const validarTelefonoColombiano = (telefono: string) => {
    // Remover espacios y caracteres especiales
    const telefonoLimpio = telefono.replace(/\s+/g, '').replace(/[^\d]/g, '');
    
    // Validar que tenga 10 dígitos y empiece con 3
    if (telefonoLimpio.length === 10 && telefonoLimpio.startsWith('3')) {
      return true;
    }
    
    // También aceptar formato con código de país +57
    if (telefonoLimpio.length === 12 && telefonoLimpio.startsWith('573')) {
      return true;
    }
    
    return false;
  };

  // Función para verificar si el email ya existe en Supabase Auth
  const verificarEmailExistente = async (email: string) => {
    if (!email.trim() || !validarEmail(email.trim())) {
      return false;
    }

    setVerificandoEmail(true);
    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });
      
      const data = await response.json();
      return data.exists || false;
    } catch (error) {
      console.error('Error verificando email:', error);
      return false;
    } finally {
      setVerificandoEmail(false);
    }
  };

  // Función para verificar manualmente el email
  const verificarEmailManual = async () => {
    if (!formData.email.trim() || !validarEmail(formData.email.trim())) {
      await Swal.fire({
        icon: 'warning',
        title: 'Email Inválido',
        text: 'Por favor ingresa un email válido primero',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#f59e0b',
        timer: 3000,
        timerProgressBar: true
      });
      return;
    }

    setVerificandoEmail(true);
    setEmailVerificado(false);
    
    try {
      const emailExiste = await verificarEmailExistente(formData.email.trim());
      
      if (emailExiste) {
        setError('Este email ya está registrado en el sistema');
        setEmailVerificado(false);
        await Swal.fire({
          icon: 'error',
          title: 'Email No Disponible',
          text: 'Este email ya está registrado. Por favor usa otro email.',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#ef4444',
          timer: 4000,
          timerProgressBar: true
        });
      } else {
        setError('');
        setEmailVerificado(true);
        await Swal.fire({
          icon: 'success',
          title: 'Email Disponible',
          text: 'El email está disponible. Puedes continuar.',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#10b981',
          timer: 3000,
          timerProgressBar: true
        });
      }
    } catch (error) {
      setError('Error verificando el email');
      setEmailVerificado(false);
      await Swal.fire({
        icon: 'error',
        title: 'Error de Verificación',
        text: 'Hubo un error verificando el email. Inténtalo de nuevo.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ef4444',
        timer: 4000,
        timerProgressBar: true
      });
    } finally {
      setVerificandoEmail(false);
    }
  };

  // Función para validar campos secuencialmente
  const validarCampo = async (campo: string, valor: string) => {
    const errores = { ...erroresValidacion };
    const habilitados = { ...camposHabilitados };
    const validados = { ...camposValidados };
    
    switch (campo) {
      case 'nombres':
        if (valor.trim() && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          errores[campo] = 'Solo se permiten letras y espacios';
          validados[campo] = false;
        } else if (valor.trim() && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.apellidos = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'apellidos':
        if (valor.trim() && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          errores[campo] = 'Solo se permiten letras y espacios';
          validados[campo] = false;
        } else if (valor.trim() && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.telefono = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'telefono':
        if (valor.trim() && !validarTelefonoColombiano(valor.trim())) {
          errores[campo] = 'Número de celular colombiano inválido';
          validados[campo] = false;
        } else if (valor.trim() && validarTelefonoColombiano(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.email = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'email':
        if (valor.trim() && !validarEmail(valor.trim())) {
          errores[campo] = 'Formato de email inválido';
          validados[campo] = false;
          setEmailVerificado(false);
        } else if (valor.trim() && validarEmail(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          // No resetear emailVerificado si ya estaba verificado
          // setEmailVerificado(false);
        } else {
          delete errores[campo];
          validados[campo] = false;
          setEmailVerificado(false);
        }
        break;
      case 'password':
        if (valor.trim() && valor.length < 8) {
          errores[campo] = 'La contraseña debe tener al menos 8 caracteres';
          validados[campo] = false;
        } else if (valor.trim() && valor.length >= 8) {
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

  // Función para determinar si el campo de contraseña debe estar habilitado
  const campoPasswordHabilitado = () => {
    return camposValidados.email && !erroresValidacion.email && !verificandoEmail && emailVerificado;
  };

  const cargarDatosInstitucion = async () => {
    setLoadingData(true);
    try {
      // Cargar datos del dashboard
      const response = await fetch(`/api/instituciones/${institucionId}/dashboard`);
      if (response.ok) {
        const data = await response.json();
        console.log('Datos cargados:', data);
        
        // Usar los datos del dashboard directamente
        setGradosInstitucion(data.datos?.grados || []);
        setAreasInstitucion(data.datos?.areas || []);
        
        // Para cursos, usar los cursos que vienen en el dashboard
        const cursosData: {[gradoId: number]: any[]} = {};
        if (data.datos?.grados) {
          for (const grado of data.datos.grados) {
            // Buscar cursos que pertenecen a este grado
            const cursosDelGrado = data.datos?.cursos?.filter((curso: any) => curso.grado_id === grado.id) || [];
            cursosData[grado.id] = cursosDelGrado;
          }
        }
        setCursosInstitucion(cursosData);
        
        // Para materias, usar las materias que vienen en el dashboard
        const materiasData: {[areaId: number]: any[]} = {};
        if (data.datos?.areas) {
          for (const area of data.datos.areas) {
            // Buscar materias que pertenecen a esta área
            const materiasDelArea = data.datos?.materias?.filter((materia: any) => materia.area_id === area.id) || [];
            materiasData[area.id] = materiasDelArea;
          }
        }
        setMateriasInstitucion(materiasData);
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
      setCursosPorGrado(prev => {
        const nuevo = { ...prev };
        delete nuevo[gradoId];
        return nuevo;
      });
    }
  };

  const toggleCurso = (gradoId: number, cursoId: number) => {
    setCursosPorGrado(prev => {
      const cursosDelGrado = prev[gradoId] || [];
      const nuevoCursos = cursosDelGrado.includes(cursoId)
        ? cursosDelGrado.filter(id => id !== cursoId)
        : [...cursosDelGrado, cursoId];
      
      return {
        ...prev,
        [gradoId]: nuevoCursos
      };
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
      setMateriasPorArea(prev => {
        const nuevo = { ...prev };
        delete nuevo[areaId];
        return nuevo;
      });
    }
  };

  const toggleMateria = (areaId: number, materiaId: number) => {
    setMateriasPorArea(prev => {
      const materiasDelArea = prev[areaId] || [];
      const nuevasMaterias = materiasDelArea.includes(materiaId)
        ? materiasDelArea.filter(id => id !== materiaId)
        : [...materiasDelArea, materiaId];
      
      return {
        ...prev,
        [areaId]: nuevasMaterias
      };
    });
  };

  useEffect(() => {
    if (isOpen) {
      // Resetear formulario cuando se abre
      setFormData({ 
        nombres: '', 
        apellidos: '', 
        telefono: '', 
        email: '', 
        password: ''
      });
      setError('');
      setEmailVerificado(false);
      setVerificandoEmail(false);
      
      // Resetear validación secuencial
      setErroresValidacion({});
      setCamposHabilitados({
        nombres: true,
        apellidos: false,
        telefono: false,
        email: false,
        password: false
      });
      setCamposValidados({
        nombres: false,
        apellidos: false,
        telefono: false,
        email: false,
        password: false
      });
      
      // Resetear asignaciones
      setGradosSeleccionados([]);
      setCursosPorGrado({});
      setAreasSeleccionadas([]);
      setMateriasPorArea({});
      setAsignacionesGradoCurso([]);
      
      // Cargar datos de la institución
      cargarDatosInstitucion();
    }
  }, [isOpen, institucionId]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Debug: Mostrar estado de validación
    console.log('Estado de validación:', {
      camposValidados,
      erroresValidacion,
      emailVerificado,
      formData
    });

    // Validar que todos los campos estén completos y válidos
    if (!camposValidados.nombres || !camposValidados.apellidos || !camposValidados.telefono || !camposValidados.email || !camposValidados.password) {
      const camposFaltantes = [];
      if (!camposValidados.nombres) camposFaltantes.push('nombres');
      if (!camposValidados.apellidos) camposFaltantes.push('apellidos');
      if (!camposValidados.telefono) camposFaltantes.push('telefono');
      if (!camposValidados.email) camposFaltantes.push('email');
      if (!camposValidados.password) camposFaltantes.push('password');
      
      setError(`Por favor completa correctamente: ${camposFaltantes.join(', ')}`);
      setLoading(false);
      return;
    }

    // Validar que el email esté verificado
    if (!emailVerificado) {
      setError('Debes verificar la disponibilidad del email antes de continuar');
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
      // Las materias deben estar organizadas por grado, no por área
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

      console.log('Enviando asignaciones:', asignaciones);
      console.log('Grados seleccionados:', gradosSeleccionados);
      console.log('Cursos por grado:', cursosPorGrado);
      console.log('Materias por grado:', materiasPorGrado);

      const response = await fetch('/api/setup/docentes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          institucionId,
          docentes: [formData],
          asignaciones: asignaciones
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al crear el docente');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Agregar Docente</h2>
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
                    className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                      erroresValidacion.nombres ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                    } ${!camposHabilitados.nombres ? 'bg-slate-100' : ''}`}
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
                    className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-400 ${
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
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Email *
                  </label>
                  <button
                    type="button"
                    onClick={verificarEmailManual}
                    disabled={!camposValidados.email || verificandoEmail}
                    className={`px-3 py-1 rounded-lg font-medium text-xs transition-colors ${
                      camposValidados.email && !verificandoEmail
                        ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                  >
                    {verificandoEmail ? (
                      <div className="flex items-center">
                        <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verificando...
                      </div>
                    ) : (
                      'Verificar'
                    )}
                  </button>
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    validarCampo('email', e.target.value);
                    // Resetear verificación cuando cambia el email
                    if (emailVerificado) {
                      setEmailVerificado(false);
                    }
                    if (error.includes('email')) {
                      setError('');
                    }
                  }}
                  disabled={!camposHabilitados.email}
                  className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                    erroresValidacion.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                  } ${!camposHabilitados.email ? 'bg-slate-100' : ''}`}
                  placeholder="correo@ejemplo.com"
                  required
                />
                {erroresValidacion.email && (
                  <p className="text-red-500 text-xs mt-1">{erroresValidacion.email}</p>
                )}
                {error && error.includes('email') && (
                  <p className="text-red-500 text-xs mt-1">{error}</p>
                )}
                {verificandoEmail && (
                  <p className="text-blue-600 text-xs mt-1 flex items-center">
                    <svg className="w-3 h-3 mr-1 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verificando disponibilidad del email...
                  </p>
                )}
                {emailVerificado && !error && !verificandoEmail && (
                  <p className="text-green-600 text-xs mt-1 flex items-center">
                    <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Email disponible
                  </p>
                )}
                {camposValidados.email && !emailVerificado && !erroresValidacion.email && !error && !verificandoEmail && (
                  <p className="text-amber-600 text-xs mt-1 flex items-center">
                    <svg className="w-3 h-3 mr-1 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Email válido. Haz clic en &quot;Verificar&quot; para comprobar disponibilidad
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => {
                    // Solo permitir números
                    const valorNumerico = e.target.value.replace(/[^\d]/g, '');
                    setFormData({ ...formData, telefono: valorNumerico });
                    validarCampo('telefono', valorNumerico);
                  }}
                  disabled={!camposHabilitados.telefono}
                  className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                    erroresValidacion.telefono ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                  } ${!camposHabilitados.telefono ? 'bg-slate-100' : ''}`}
                  placeholder="3001234567"
                  maxLength={12}
                  required
                />
                {erroresValidacion.telefono && (
                  <p className="text-red-500 text-xs mt-1">{erroresValidacion.telefono}</p>
                )}
                {camposValidados.telefono && !erroresValidacion.telefono && (
                  <p className="text-green-600 text-xs mt-1 flex items-center">
                    <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Teléfono válido
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Contraseña *
                  </label>
                  <button
                    type="button"
                    onClick={generarPassword}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Generar
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={mostrarPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      validarCampo('password', e.target.value);
                    }}
                    disabled={!campoPasswordHabilitado()}
                    className={`w-full px-4 py-2.5 pr-10 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                      erroresValidacion.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                    } ${!campoPasswordHabilitado() ? 'bg-slate-100' : ''}`}
                    placeholder="Mínimo 8 caracteres"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {mostrarPassword ? (
                      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {erroresValidacion.password && (
                  <p className="text-red-500 text-xs mt-1">{erroresValidacion.password}</p>
                )}
                {camposValidados.password && !erroresValidacion.password && (
                  <p className="text-green-600 text-xs mt-1 flex items-center">
                    <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Contraseña válida
                  </p>
                )}
              </div>

              {/* Indicador de progreso de validación */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Progreso de validación:</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Nombres:</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      camposValidados.nombres ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {camposValidados.nombres ? '✓ Válido' : '✗ Pendiente'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Apellidos:</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      camposValidados.apellidos ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {camposValidados.apellidos ? '✓ Válido' : '✗ Pendiente'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Teléfono:</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      camposValidados.telefono ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {camposValidados.telefono ? '✓ Válido' : '✗ Pendiente'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Email:</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      camposValidados.email && emailVerificado ? 'bg-green-100 text-green-700' : 
                      camposValidados.email ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {camposValidados.email && emailVerificado ? '✓ Verificado' : 
                       camposValidados.email ? '⚠ Válido, verificar' : '✗ Pendiente'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Contraseña:</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      camposValidados.password ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {camposValidados.password ? '✓ Válido' : '✗ Pendiente'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sección de Grados y Cursos */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Grados y Cursos</h3>
                {loadingData ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-3 text-slate-600">Cargando grados y cursos...</span>
                  </div>
                ) : gradosInstitucion.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No hay grados configurados en esta institución.</p>
                    <p className="text-sm text-slate-400 mt-2">Primero debes configurar los grados en el Setup Wizard.</p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {gradosInstitucion.map((grado) => (
                    <div key={grado.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={gradosSeleccionados.includes(grado.id)}
                            onChange={() => toggleGrado(grado.id)}
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm font-medium text-slate-900">
                            {grado.nombre} - {grado.nivel}
                          </span>
                        </label>
                      </div>
                      
                      {gradosSeleccionados.includes(grado.id) && (
                        <div className="ml-7 space-y-2">
                          <p className="text-xs text-slate-600 mb-2">Selecciona los cursos:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {cursosInstitucion[grado.id]?.map((curso) => (
                              <label key={curso.id} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={cursosPorGrado[grado.id]?.includes(curso.id) || false}
                                  onChange={() => toggleCurso(grado.id, curso.id)}
                                  className="w-3 h-3 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-xs text-slate-700">{curso.nombre}</span>
                              </label>
                            )) || (
                              <p className="text-xs text-slate-500 col-span-2">No hay cursos disponibles para este grado</p>
                            )}
                          </div>
                        </div>
                      )}
                      </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sección de Áreas y Materias */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Áreas y Materias</h3>
                {loadingData ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-3 text-slate-600">Cargando áreas y materias...</span>
                  </div>
                ) : areasInstitucion.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No hay áreas configuradas en esta institución.</p>
                    <p className="text-sm text-slate-400 mt-2">Primero debes configurar las áreas en el Setup Wizard.</p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {areasInstitucion.map((area) => (
                    <div key={area.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={areasSeleccionadas.includes(area.id)}
                            onChange={() => toggleArea(area.id)}
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm font-medium text-slate-900">
                            {area.nombre} {area.es_opcional && <span className="text-xs text-slate-500">(Opcional)</span>}
                          </span>
                        </label>
                      </div>
                      
                      {areasSeleccionadas.includes(area.id) && (
                        <div className="ml-7 space-y-2">
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
                            )) || (
                              <p className="text-xs text-slate-500">No hay materias disponibles para esta área</p>
                            )}
                          </div>
                        </div>
                      )}
                      </div>
                      ))}
                    </div>
                  </div>
                )}
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
                disabled={loading || !emailVerificado || !camposValidados.nombres || !camposValidados.apellidos || !camposValidados.telefono || !camposValidados.email || !camposValidados.password}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  'Crear Docente'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
