'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import PhoneInput, { isValidPhoneNumber, getCountries } from 'react-phone-number-input';
import es from 'react-phone-number-input/locale/es.json';
import 'react-phone-number-input/style.css';

const COUNTRY_OPTIONS_ORDER: ReturnType<typeof getCountries> = [...getCountries()].sort(
  (a, b) => (es[a as keyof typeof es] as string || a).localeCompare((es[b as keyof typeof es] as string) || b, 'es')
);

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

  // Secuencial: verificación de correo y habilitación de contraseña
  const [emailValidating, setEmailValidating] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [emailError, setEmailError] = useState('');
  const [canProceedToPassword, setCanProceedToPassword] = useState(false);

  const validarEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkEmailAvailability = async (email: string) => {
    if (!email.trim() || !validarEmail(email)) {
      setEmailAvailable(null);
      setCanProceedToPassword(false);
      return;
    }
    setEmailValidating(true);
    setEmailError('');
    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        const available = !data.exists;
        setEmailAvailable(available);
        setCanProceedToPassword(available);
        if (!available) setEmailError('Este correo ya está registrado');
      } else {
        setEmailAvailable(false);
        setCanProceedToPassword(false);
        setEmailError(data.error || 'Error al verificar el correo');
      }
    } catch (err) {
      setEmailAvailable(false);
      setCanProceedToPassword(false);
      setEmailError('Error de conexión');
    } finally {
      setEmailValidating(false);
    }
  };

  const handleVerifyEmail = () => {
    if (!formData.email.trim()) {
      setEmailError('El correo es requerido');
      setCanProceedToPassword(false);
      return;
    }
    if (!validarEmail(formData.email)) {
      setEmailError('Formato de correo inválido');
      setCanProceedToPassword(false);
      return;
    }
    checkEmailAvailability(formData.email.trim());
  };

  const isPhoneValid = (phone: string) => !!phone && isValidPhoneNumber(phone);

  const getPasswordRequirements = (password: string) => ({
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[@$!%*?&]/.test(password),
  });

  const validatePassword = (password: string) => {
    const reqs = getPasswordRequirements(password);
    return Object.values(reqs).every(Boolean);
  };

  const generarPassword = () => {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghijkmnpqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '!@#$%^&*()_+-=[]{};:,.?';
    const all = upper + lower + numbers + symbols;
    const pick = (pool: string) => pool[Math.floor(Math.random() * pool.length)];
    let password = [pick(upper), pick(lower), pick(numbers), pick(symbols)];
    for (let i = password.length; i < 12; i += 1) password.push(pick(all));
    password = password.sort(() => Math.random() - 0.5);
    const generated = password.join('');
    setFormData((prev) => ({ ...prev, password: generated }));
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
      setEmailAvailable(null);
      setEmailError('');
      setCanProceedToPassword(false);
      
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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones básicas
    if (!formData.nombres.trim() || !formData.apellidos.trim() || !formData.telefono.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Por favor completa todos los campos obligatorios');
      setLoading(false);
      return;
    }

    if (!validarEmail(formData.email.trim())) {
      setError('Por favor ingresa un email válido');
      setLoading(false);
      return;
    }

    if (!isPhoneValid(formData.telefono)) {
      setError('Por favor ingresa un número de teléfono válido con indicativo de país');
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('La contraseña debe cumplir todos los requisitos (8 caracteres, mayúscula, minúscula, número y símbolo)');
      setLoading(false);
      return;
    }

    if (!canProceedToPassword) {
      setError('Debe verificar el correo antes de continuar');
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
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nombres *</label>
                  <input
                    type="text"
                    value={formData.nombres}
                    onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-400"
                    placeholder="Nombres"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Apellidos *</label>
                  <input
                    type="text"
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    disabled={!formData.nombres.trim()}
                    className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-400 ${
                      !formData.nombres.trim() ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed' : 'border-slate-300'
                    }`}
                    placeholder="Apellidos"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Teléfono * (con indicativo de país)
                </label>
                <PhoneInput
                  international
                  defaultCountry="CO"
                  countries={COUNTRY_OPTIONS_ORDER}
                  labels={es}
                  placeholder="Ej: 300 123 4567"
                  value={formData.telefono || undefined}
                  onChange={(value) => setFormData((prev) => ({ ...prev, telefono: value || '' }))}
                  disabled={!formData.apellidos.trim()}
                  className={`w-full ${!formData.apellidos.trim() ? 'PhoneInput--disabled' : ''} ${
                    formData.telefono && !isPhoneValid(formData.telefono) ? 'PhoneInput--error' : ''
                  }`}
                  numberInputProps={{
                    className: `flex-1 px-4 py-2.5 text-sm border rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-400 min-w-0 ${
                      !formData.apellidos.trim()
                        ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                        : formData.telefono && !isPhoneValid(formData.telefono)
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-slate-300'
                    }`,
                    required: true,
                    disabled: !formData.apellidos.trim(),
                    'aria-label': 'Número de teléfono',
                  }}
                />
                {formData.telefono && !isPhoneValid(formData.telefono) && (
                  <p className="mt-1 text-xs text-red-600">Ingrese un número de teléfono válido con indicativo de país</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setEmailAvailable(null);
                      setEmailError('');
                      setCanProceedToPassword(false);
                    }}
                    disabled={!isPhoneValid(formData.telefono)}
                    className={`w-full px-4 py-2.5 pr-12 text-sm border rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-400 ${
                      !isPhoneValid(formData.telefono)
                        ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                        : emailError
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : emailAvailable === true
                        ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                        : 'border-slate-300'
                    }`}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {emailValidating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600" />
                    ) : emailAvailable === true ? (
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : emailAvailable === false ? (
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : null}
                  </div>
                </div>
                {emailError && <p className="mt-1 text-xs text-red-600">{emailError}</p>}
                {emailAvailable === true && !emailError && (
                  <p className="mt-1 text-xs text-green-600">Correo disponible. Ya puede definir la contraseña.</p>
                )}
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleVerifyEmail}
                    disabled={!isPhoneValid(formData.telefono) || !formData.email.trim() || emailValidating || !!emailError}
                    className="text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {emailValidating ? 'Verificando...' : 'Verificar correo'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña *</label>
                <div className="relative">
                  <input
                    type={mostrarPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={!canProceedToPassword}
                    className={`w-full px-4 py-2.5 pr-10 text-sm border rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-400 ${
                      !canProceedToPassword
                        ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                        : validatePassword(formData.password)
                        ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                        : 'border-slate-300'
                    }`}
                    placeholder="Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    disabled={!canProceedToPassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed"
                  >
                    {mostrarPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={generarPassword}
                  disabled={!canProceedToPassword}
                  className="mt-2 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Generar contraseña
                </button>
                {canProceedToPassword && (
                  <div className="mt-2 text-xs text-slate-500 space-y-1">
                    {(() => {
                      const reqs = getPasswordRequirements(formData.password);
                      const item = (ok: boolean, label: string) => (
                        <p key={label} className={ok ? 'text-green-600' : 'text-slate-500'}>
                          {ok ? '✓' : '•'} {label}
                        </p>
                      );
                      return (
                        <>
                          {item(reqs.length, 'Al menos 8 caracteres')}
                          {item(reqs.upper, 'Una letra mayúscula')}
                          {item(reqs.lower, 'Una letra minúscula')}
                          {item(reqs.number, 'Un número')}
                          {item(reqs.symbol, 'Un símbolo (@$!%*?&)')}
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Sección de Grados y Cursos */}
              <div className={`border-t pt-6 transition-opacity duration-200 ${!validatePassword(formData.password) ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
                <h3 className="text-lg font-medium text-slate-900 mb-4">Grados y Cursos</h3>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 mb-4">
                  <p className="text-sm text-slate-700">
                    Seleccione a qué <strong>grado</strong> y <strong>curso</strong> debe vincularse el docente. Marque primero el grado y luego los cursos correspondientes en los que impartirá clase.
                  </p>
                </div>
                {!validatePassword(formData.password) && (
                  <p className="text-sm text-slate-500 mb-3">Complete la contraseña con todos los requisitos para habilitar esta sección.</p>
                )}
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
              <div className={`border-t pt-6 transition-opacity duration-200 ${!(gradosSeleccionados.length > 0 && Object.values(cursosPorGrado).some((arr) => arr.length > 0)) ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
                <h3 className="text-lg font-medium text-slate-900 mb-4">Áreas y Materias</h3>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 mb-4">
                  <p className="text-sm text-slate-700">
                    Seleccione a qué <strong>área</strong> y <strong>materia</strong> debe vincularse el docente. Marque primero el área y luego las materias que impartirá en los cursos asignados.
                  </p>
                </div>
                {!(gradosSeleccionados.length > 0 && Object.values(cursosPorGrado).some((arr) => arr.length > 0)) && (
                  <p className="text-sm text-slate-500 mb-3">Seleccione al menos un grado y un curso arriba para habilitar esta sección.</p>
                )}
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
                disabled={loading}
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
