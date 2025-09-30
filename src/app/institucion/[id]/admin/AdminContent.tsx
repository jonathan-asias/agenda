'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../../contexts/AuthContext';

interface Administrador {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  cargo: string;
  institucion_id: number;
  sede_id?: number;
  created_at: string;
  updated_at: string;
  sede?: {
    id: number;
    nombre: string;
  };
}

interface Institucion {
  id: number;
  nombre: string;
  administradores: Administrador[];
  sedes: Sede[];
}

interface Sede {
  id: number;
  nombre: string;
  jornadas: string[];
}

export default function AdminContent() {
  const params = useParams();
  const router = useRouter();
  const { user, institutionId } = useAuth();
  const [institucion, setInstitucion] = useState<Institucion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    cargo: '',
    password: '',
    sede_id: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Administrador | null>(null);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailValidating, setEmailValidating] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [canProceedToPassword, setCanProceedToPassword] = useState(false);
  const emailTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Estados para validación secuencial
  const [nombreValid, setNombreValid] = useState(false);
  const [apellidoValid, setApellidoValid] = useState(false);
  const [telefonoValid, setTelefonoValid] = useState(false);
  const [cargoValid, setCargoValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Configurar automáticamente "Sede Principal" cuando no hay sedes
  useEffect(() => {
    if (institucion && institucion.sedes && institucion.sedes.length === 0) {
      setFormData(prev => ({
        ...prev,
        sede_id: 'principal'
      }));
    }
  }, [institucion]);

  // Cleanup del timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (emailTimeoutRef.current) {
        clearTimeout(emailTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchInstitucion = async () => {
      try {
        const response = await fetch(`/api/instituciones/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setInstitucion(data);
        } else {
          setError('Institución no encontrada');
        }
      } catch (err) {
        setError('Error al cargar la institución');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchInstitucion();
    }
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validación en tiempo real para el correo
    if (name === 'correo') {
      if (value.trim() && !validateEmail(value)) {
        setEmailError('Formato de correo inválido');
        setEmailAvailable(null);
        setCanProceedToPassword(false);
      } else {
        setEmailError('');
        // Limpiar timeout anterior
        if (emailTimeoutRef.current) {
          clearTimeout(emailTimeoutRef.current);
        }
        // Verificar disponibilidad del correo con debounce
        emailTimeoutRef.current = setTimeout(() => {
          checkEmailAvailability(value);
        }, 500);
      }
    }

    // Validación secuencial para cada campo
    if (name === 'nombre') {
      setNombreValid(validateNombre(value));
    }
    
    if (name === 'apellido') {
      setApellidoValid(validateApellido(value));
    }
    
    if (name === 'telefono') {
      setTelefonoValid(validateTelefono(value));
    }
    
    if (name === 'cargo') {
      setCargoValid(validateCargo(value));
    }

    // Validación en tiempo real para la contraseña
    if (name === 'password') {
      if (value.trim() && !validatePassword(value)) {
        setPasswordError('La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos');
        setPasswordValid(false);
      } else {
        setPasswordError('');
        setPasswordValid(validatePassword(value));
      }
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkEmailAvailability = async (email: string) => {
    if (!email.trim() || !validateEmail(email)) {
      setEmailAvailable(null);
      setCanProceedToPassword(false);
      return;
    }

    setEmailValidating(true);
    setEmailError('');

    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setEmailAvailable(data.available);
        setCanProceedToPassword(data.available);
        
        if (!data.available) {
          setEmailError(data.message);
        }
      } else {
        setEmailAvailable(false);
        setCanProceedToPassword(false);
        setEmailError('Error al verificar el correo');
      }
    } catch (error) {
      setEmailAvailable(false);
      setCanProceedToPassword(false);
      setEmailError('Error de conexión');
    } finally {
      setEmailValidating(false);
    }
  };

  const validatePassword = (password: string) => {
    // Mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un símbolo
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateNombre = (nombre: string) => {
    return nombre.trim().length >= 2;
  };

  const validateApellido = (apellido: string) => {
    return apellido.trim().length >= 2;
  };

  const validateTelefono = (telefono: string) => {
    const telefonoRegex = /^[\+]?[0-9\s\-\(\)]{7,15}$/;
    return telefonoRegex.test(telefono.trim());
  };

  const validateCargo = (cargo: string) => {
    return cargo.trim().length >= 2;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Validaciones del frontend
    if (!formData.nombre.trim()) {
      setError('El nombre es requerido');
      setSubmitting(false);
      return;
    }

    if (!formData.apellido.trim()) {
      setError('El apellido es requerido');
      setSubmitting(false);
      return;
    }

    if (!formData.correo.trim()) {
      setError('El correo es requerido');
      setSubmitting(false);
      return;
    }

    if (!validateEmail(formData.correo)) {
      setError('Por favor ingrese un correo electrónico válido');
      setSubmitting(false);
      return;
    }

    if (!formData.telefono.trim()) {
      setError('El teléfono es requerido');
      setSubmitting(false);
      return;
    }

    if (!formData.cargo.trim()) {
      setError('El cargo es requerido');
      setSubmitting(false);
      return;
    }

    if (!formData.sede_id) {
      setError('Debe seleccionar una sede');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/instituciones/${params.id}/administradores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Recargar la lista de administradores
        const updatedResponse = await fetch(`/api/instituciones/${params.id}`);
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setInstitucion(updatedData);
        }
        
        // Limpiar formulario y cerrar
        resetForm();
        setShowForm(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al crear administrador');
      }
    } catch (err) {
      setError('Error al crear administrador');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (admin: Administrador) => {
    setAdminToDelete(admin);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!adminToDelete) return;

    setDeletingId(adminToDelete.id);
    setError('');

    try {
      const response = await fetch(`/api/instituciones/${params.id}/administradores/${adminToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Recargar la lista de administradores
        const updatedResponse = await fetch(`/api/instituciones/${params.id}`);
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setInstitucion(updatedData);
        }
        
        setShowDeleteModal(false);
        setAdminToDelete(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al eliminar administrador');
      }
    } catch (err) {
      setError('Error al eliminar administrador');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setAdminToDelete(null);
  };

  const resetForm = () => {
    setFormData({ nombre: '', apellido: '', correo: '', telefono: '', cargo: '', password: '', sede_id: '' });
    setNombreValid(false);
    setApellidoValid(false);
    setTelefonoValid(false);
    setCargoValid(false);
    setPasswordValid(false);
    setEmailAvailable(null);
    setCanProceedToPassword(false);
    setEmailError('');
    setPasswordError('');
    setShowPassword(false);
    
    // Limpiar timeout del debounce
    if (emailTimeoutRef.current) {
      clearTimeout(emailTimeoutRef.current);
      emailTimeoutRef.current = null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando administradores...</p>
        </div>
      </div>
    );
  }

  if (error || !institucion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Error</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <Link 
            href={`/institucion/${params.id}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                👥 Gestionar Administradores
              </h1>
              <p className="text-slate-600">
                {institucion.nombre} - Administrar usuarios del sistema
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  if (showForm) {
                    // Si está cerrando el formulario, limpiar todo
                    resetForm();
                    setShowForm(false);
                  } else {
                    // Si está abriendo el formulario, limpiar y mostrar
                    resetForm();
                    setShowForm(true);
                  }
                }}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {showForm ? 'Cancelar' : 'Agregar Administrador'}
              </button>
              <Link
                href={`/institucion/${params.id}`}
                className="inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Formulario para Agregar Administrador */}
        {showForm && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">➕ Agregar Nuevo Administrador</h2>
                <p className="text-slate-600">Complete la información del nuevo administrador</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Nombre
                    {nombreValid && (
                      <span className="text-green-600 text-xs ml-2">✓</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      nombreValid
                        ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    placeholder="Nombre del administrador"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Apellido
                    {!nombreValid && (
                      <span className="text-slate-500 text-xs ml-2">(Completa el nombre primero)</span>
                    )}
                    {apellidoValid && (
                      <span className="text-green-600 text-xs ml-2">✓</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
                    disabled={!nombreValid}
                    className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      !nombreValid
                        ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                        : apellidoValid
                        ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    placeholder={
                      !nombreValid 
                        ? "Primero completa el nombre"
                        : "Apellido del administrador"
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Correo
                    {!apellidoValid && (
                      <span className="text-slate-500 text-xs ml-2">(Completa el apellido primero)</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      required
                      disabled={!apellidoValid}
                      className={`w-full px-4 py-3 pr-12 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        !apellidoValid
                          ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                          : emailError 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : emailAvailable === true
                          ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      placeholder={
                        !apellidoValid 
                          ? "Primero completa el apellido"
                          : "correo@ejemplo.com"
                      }
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {emailValidating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
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
                  {emailError && (
                    <p className="text-red-600 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      {emailError}
                    </p>
                  )}
                  {emailAvailable === true && !emailError && (
                    <p className="text-green-600 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Correo disponible
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Teléfono
                    {!canProceedToPassword && (
                      <span className="text-slate-500 text-xs ml-2">(Completa el correo primero)</span>
                    )}
                    {telefonoValid && (
                      <span className="text-green-600 text-xs ml-2">✓</span>
                    )}
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required
                    disabled={!canProceedToPassword}
                    className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      !canProceedToPassword
                        ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                        : telefonoValid
                        ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    placeholder={
                      !canProceedToPassword 
                        ? "Primero verifica que el correo esté disponible"
                        : "+57 300 123 4567"
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Cargo
                    {!telefonoValid && (
                      <span className="text-slate-500 text-xs ml-2">(Completa el teléfono primero)</span>
                    )}
                    {cargoValid && (
                      <span className="text-green-600 text-xs ml-2">✓</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleInputChange}
                    required
                    disabled={!telefonoValid}
                    className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      !telefonoValid
                        ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                        : cargoValid
                        ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    placeholder={
                      !telefonoValid 
                        ? "Primero completa el teléfono"
                        : "Director, Coordinador, etc."
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Contraseña
                    {!cargoValid && (
                      <span className="text-slate-500 text-xs ml-2">(Completa el cargo primero)</span>
                    )}
                    {passwordValid && (
                      <span className="text-green-600 text-xs ml-2">✓</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={!cargoValid}
                      className={`w-full px-4 py-3 pr-12 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        !cargoValid
                          ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                          : passwordError
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : passwordValid
                          ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      placeholder={
                        !cargoValid 
                          ? "Primero completa el cargo"
                          : "Mínimo 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos"
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={!cargoValid}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {passwordError ? (
                    <p className="text-red-600 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      {passwordError}
                    </p>
                  ) : cargoValid ? (
                    <p className="text-xs text-slate-500">
                      La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400">
                      Completa el cargo para continuar
                    </p>
                  )}
                </div>
              </div>

              {/* Campo de Sede */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Sede</label>
                <select
                  name="sede_id"
                  value={formData.sede_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Seleccione una sede</option>
                  {institucion.sedes && institucion.sedes.length > 0 ? (
                    institucion.sedes.map((sede) => (
                      <option key={sede.id} value={sede.id} className="text-slate-800">
                        {sede.nombre}
                      </option>
                    ))
                  ) : (
                    <option value="principal" className="text-slate-800">
                      Sede Principal
                    </option>
                  )}
                </select>
                {institucion.sedes && institucion.sedes.length === 0 && (
                  <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                    ℹ️ Esta institución no tiene sedes configuradas. El administrador se asignará a la sede principal.
                  </p>
                )}
              </div>
              
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

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting || !(nombreValid && apellidoValid && canProceedToPassword && telefonoValid && cargoValid && passwordValid)}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creando Administrador...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Crear Administrador
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-200 border-2 border-slate-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Administradores */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">👥 Administradores Actuales</h2>
          
          {institucion.administradores && institucion.administradores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {institucion.administradores.map((admin) => (
                <div key={admin.id} className="border border-slate-200 rounded-xl p-5 bg-white/50 hover:bg-white/70 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 text-lg">
                        {admin.nombre} {admin.apellido}
                      </h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 bg-green-100 text-green-800">
                        Activo
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(admin)}
                      disabled={deletingId === admin.id}
                      className="ml-3 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Eliminar administrador"
                    >
                      {deletingId === admin.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-slate-600">
                      <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      {admin.correo}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {admin.telefono}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                      </svg>
                      {admin.cargo}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {admin.sede ? admin.sede.nombre : 'Sede Principal'}
                    </div>
                    <div className="flex items-center text-xs text-slate-400">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Creado: {new Date(admin.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <p className="text-slate-500 mb-4">No hay administradores registrados</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Agregar Primer Administrador
              </button>
            </div>
          )}
        </div>

        {/* Modal de Confirmación de Eliminación */}
        {showDeleteModal && adminToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Confirmar Eliminación</h3>
                  <p className="text-sm text-slate-600">Esta acción no se puede deshacer</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-slate-700 mb-2">
                  ¿Está seguro de que desea eliminar al administrador?
                </p>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="font-medium text-slate-800">
                    {adminToDelete.nombre} {adminToDelete.apellido}
                  </p>
                  <p className="text-sm text-slate-600">{adminToDelete.correo}</p>
                  <p className="text-sm text-slate-500">{adminToDelete.cargo}</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deletingId === adminToDelete.id}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === adminToDelete.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </>
                  )}
                </button>
                <button
                  onClick={handleDeleteCancel}
                  disabled={deletingId === adminToDelete.id}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
