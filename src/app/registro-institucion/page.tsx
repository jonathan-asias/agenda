'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Sede {
  id: string;
  nombre: string;
  jornadas: string[];
}

export default function RegistroInstitucion() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion_principal: '',
    nit: '',
    nombre_contacto: '',
    telefono_contacto: '',
    email: '',
    password: '',
    tiene_sedes: false,
    jornadas: [] as string[]
  });

  const [sedes, setSedes] = useState<Sede[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [emailDuplicateError, setEmailDuplicateError] = useState<string>('');
  const [securityErrors, setSecurityErrors] = useState<{[key: string]: string}>({});

  const steps = [
    { id: 1, name: 'Información Básica', description: 'Datos principales de la institución' },
    { id: 2, name: 'Información de Contacto', description: 'Datos de contacto' },
    { id: 3, name: 'Configuración de Sedes', description: 'Jornadas y sedes' }
  ];

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  // Validación de email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validación de NIT (solo números, mínimo 9 dígitos)
  const isValidNIT = (nit: string): boolean => {
    const nitRegex = /^\d{9,}$/;
    return nitRegex.test(nit);
  };

  // Validación de teléfono (solo números, mínimo 10 dígitos)
  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10,}$/;
    return phoneRegex.test(phone);
  };

  // Validación de campos vacíos
  const hasEmptyFields = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.nombre.trim()) errors.push('El nombre de la institución es requerido');
    if (!formData.direccion_principal.trim()) errors.push('La dirección principal es requerida');
    if (!formData.nit.trim()) errors.push('El NIT es requerido');
    if (!formData.nombre_contacto.trim()) errors.push('El nombre de contacto es requerido');
    if (!formData.telefono_contacto.trim()) errors.push('El teléfono de contacto es requerido');
    if (!formData.email.trim()) errors.push('El correo electrónico es requerido');
    if (!formData.password.trim()) errors.push('La contraseña es requerida');
    
    return errors;
  };

  // Validación de email duplicado
  const checkEmailDuplicate = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/instituciones/by-email/${encodeURIComponent(email)}`);
      return response.ok; // Si la respuesta es ok, significa que el email ya existe
    } catch (error) {
      return false; // En caso de error, asumimos que no está duplicado
    }
  };

  // Validación de contraseña segura
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula');
    }
    
    if (!/\d/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('La contraseña debe contener al menos un carácter especial');
    }
    
    return errors;
  };

  // ========== FUNCIONES DE SEGURIDAD CONTRA INYECCIÓN ==========

  // Función para sanitizar entrada de texto
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remover < y >
      .replace(/javascript:/gi, '') // Remover javascript:
      .replace(/on\w+=/gi, '') // Remover event handlers (onclick, onload, etc.)
      .replace(/script/gi, '') // Remover script
      .replace(/iframe/gi, '') // Remover iframe
      .replace(/object/gi, '') // Remover object
      .replace(/embed/gi, '') // Remover embed
      .replace(/link/gi, '') // Remover link
      .replace(/meta/gi, '') // Remover meta
      .replace(/style/gi, '') // Remover style
      .replace(/expression/gi, '') // Remover expression
      .replace(/vbscript/gi, '') // Remover vbscript
      .replace(/data:/gi, '') // Remover data:
      .replace(/&lt;/g, '') // Remover &lt;
      .replace(/&gt;/g, '') // Remover &gt;
      .replace(/&amp;/g, '&') // Convertir &amp; a &
      .replace(/&quot;/g, '"') // Convertir &quot; a "
      .replace(/&#x27;/g, "'") // Convertir &#x27; a '
      .replace(/&#x2F;/g, '/') // Convertir &#x2F; a /
      .trim();
  };

  // Función para validar entrada segura
  const validateSecureInput = (input: string, fieldName: string): string => {
    const sanitized = sanitizeInput(input);
    
    // Detectar patrones de inyección comunes
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /<link/i,
      /<meta/i,
      /<style/i,
      /expression\s*\(/i,
      /vbscript:/i,
      /data:/i,
      /&lt;script/i,
      /&lt;iframe/i,
      /&lt;object/i,
      /&lt;embed/i,
      /&lt;link/i,
      /&lt;meta/i,
      /&lt;style/i,
      /&lt;expression/i,
      /&lt;vbscript/i,
      /&lt;data:/i
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(input)) {
        return `Entrada no válida detectada en ${fieldName}. Se han bloqueado caracteres potencialmente peligrosos.`;
      }
    }

    return '';
  };

  // Función para validar email seguro
  const validateSecureEmail = (email: string): string => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
      return 'Formato de email inválido';
    }

    // Verificar longitud máxima
    if (email.length > 254) {
      return 'El email es demasiado largo';
    }

    // Verificar caracteres peligrosos
    const dangerousChars = /[<>'"&]/;
    if (dangerousChars.test(email)) {
      return 'El email contiene caracteres no permitidos';
    }

    return '';
  };

  // Función para validar contraseña segura
  const validateSecurePassword = (password: string): string => {
    // Verificar longitud mínima y máxima
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (password.length > 128) {
      return 'La contraseña es demasiado larga';
    }

    // Verificar caracteres peligrosos
    const dangerousChars = /[<>'"&]/;
    if (dangerousChars.test(password)) {
      return 'La contraseña contiene caracteres no permitidos';
    }

    return '';
  };

  // Función para limpiar y validar entrada segura
  const handleSecureInputChange = (value: string, fieldName: string, setter: (value: string) => void) => {
    const sanitized = sanitizeInput(value);
    const error = validateSecureInput(value, fieldName);
    
    setter(sanitized);
    
    if (error) {
      setSecurityErrors(prev => ({ ...prev, [fieldName]: error }));
    } else {
      setSecurityErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.nombre.trim() && 
          formData.direccion_principal.trim() && 
          formData.nit.trim() && 
          isValidNIT(formData.nit)
        );
      case 2:
        const emailValid = formData.email && isValidEmail(formData.email) && !emailDuplicateError;
        const passwordValid = formData.password && validatePassword(formData.password).length === 0;
        const phoneValid = formData.telefono_contacto && isValidPhone(formData.telefono_contacto);
        return !!(
          formData.nombre_contacto.trim() && 
          formData.telefono_contacto.trim() && 
          phoneValid && 
          emailValid && 
          passwordValid
        );
      case 3:
        if (formData.tiene_sedes) {
          return sedes.length > 0 && sedes.every(sede => sede.nombre.trim() && sede.jornadas.length > 0);
        } else {
          return formData.jornadas.length > 0;
        }
      default:
        return false;
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    // Restricción para campos numéricos
    let processedValue = value;
    if (name === 'nit' || name === 'telefono_contacto') {
      // Solo permitir números
      processedValue = value.replace(/\D/g, '');
    }
    
    // Aplicar sanitización de seguridad a todos los campos de texto
    if (type !== 'checkbox' && name !== 'tiene_sedes') {
      processedValue = sanitizeInput(processedValue);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));

    // Validar contraseña en tiempo real
    if (name === 'password') {
      const errors = validatePassword(processedValue);
      setPasswordErrors(errors);
      
      // Validar seguridad de contraseña
      const securityError = validateSecurePassword(processedValue);
      if (securityError) {
        setSecurityErrors(prev => ({ ...prev, password: securityError }));
      } else {
        setSecurityErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.password;
          return newErrors;
        });
      }
    }

    // Validar email duplicado en tiempo real
    if (name === 'email' && processedValue && isValidEmail(processedValue)) {
      const isDuplicate = await checkEmailDuplicate(processedValue);
      if (isDuplicate) {
        setEmailDuplicateError('Este correo electrónico ya está registrado');
      } else {
        setEmailDuplicateError('');
      }
      
      // Validar seguridad de email
      const securityError = validateSecureEmail(processedValue);
      if (securityError) {
        setSecurityErrors(prev => ({ ...prev, email: securityError }));
      } else {
        setSecurityErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }
    } else if (name === 'email') {
      setEmailDuplicateError('');
    }

    // Validar seguridad de otros campos
    if (name !== 'password' && name !== 'email' && type !== 'checkbox' && name !== 'tiene_sedes') {
      const securityError = validateSecureInput(processedValue, name);
      if (securityError) {
        setSecurityErrors(prev => ({ ...prev, [name]: securityError }));
      } else {
        setSecurityErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleJornadaChange = (jornada: string, checked: boolean) => {
    setFormData(prev => {
      let newJornadas = [...prev.jornadas];
      
      if (checked) {
        // Si se selecciona jornada única, limpiar las otras
        if (jornada === 'única') {
          newJornadas = ['única'];
        } else {
          // Si se selecciona otra jornada, remover jornada única
          newJornadas = newJornadas.filter(j => j !== 'única');
          if (!newJornadas.includes(jornada)) {
            newJornadas.push(jornada);
          }
        }
      } else {
        // Remover la jornada del array
        newJornadas = newJornadas.filter(j => j !== jornada);
      }
      
      return {
        ...prev,
        jornadas: newJornadas
      };
    });
  };

  const addSede = () => {
    const newSede: Sede = {
      id: Date.now().toString(),
      nombre: '',
      jornadas: []
    };
    setSedes(prev => [...prev, newSede]);
  };

  const removeSede = (id: string) => {
    setSedes(prev => prev.filter(sede => sede.id !== id));
  };

  const updateSede = (id: string, field: keyof Sede, value: string | string[]) => {
    setSedes(prev => prev.map(sede => 
      sede.id === id ? { ...sede, [field]: value } : sede
    ));
  };

  const handleSedeJornadaChange = (sedeId: string, jornada: string, checked: boolean) => {
    setSedes(prev => prev.map(sede => {
      if (sede.id === sedeId) {
        let newJornadas = [...sede.jornadas];
        
        if (checked) {
          if (jornada === 'única') {
            newJornadas = ['única'];
          } else {
            newJornadas = newJornadas.filter(j => j !== 'única');
            if (!newJornadas.includes(jornada)) {
              newJornadas.push(jornada);
            }
          }
        } else {
          newJornadas = newJornadas.filter(j => j !== jornada);
        }
        
        return { ...sede, jornadas: newJornadas };
      }
      return sede;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // 1. Validar campos vacíos
      const emptyFields = hasEmptyFields();
      if (emptyFields.length > 0) {
        showToastMessage(`Campos requeridos: ${emptyFields.join(', ')}`, 'error');
        return;
      }

      // 2. Validar errores de seguridad
      if (Object.keys(securityErrors).length > 0) {
        const firstError = Object.values(securityErrors)[0];
        showToastMessage(`Error de seguridad: ${firstError}`, 'error');
        return;
      }

      // 3. Validar formato de NIT
      if (!isValidNIT(formData.nit)) {
        showToastMessage('El NIT debe contener al menos 9 dígitos numéricos', 'error');
        return;
      }

      // 4. Validar formato de teléfono
      if (!isValidPhone(formData.telefono_contacto)) {
        showToastMessage('El teléfono debe contener al menos 10 dígitos numéricos', 'error');
        return;
      }

      // 5. Validar formato de email
      if (!isValidEmail(formData.email)) {
        showToastMessage('Por favor ingrese un correo electrónico válido', 'error');
        return;
      }

      // 6. Validar contraseña
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        showToastMessage(`Contraseña inválida: ${passwordErrors.join(', ')}`, 'error');
        return;
      }

      // 7. Validar email duplicado
      const isEmailDuplicate = await checkEmailDuplicate(formData.email);
      if (isEmailDuplicate) {
        showToastMessage('Este correo electrónico ya está registrado. Use otro correo.', 'error');
        return;
      }

      // 8. Validar jornadas o sedes
      if (formData.tiene_sedes) {
        if (sedes.length === 0) {
          showToastMessage('Debe agregar al menos una sede', 'error');
          return;
        }
        const sedesInvalid = sedes.some(sede => !sede.nombre.trim() || sede.jornadas.length === 0);
        if (sedesInvalid) {
          showToastMessage('Todas las sedes deben tener nombre y al menos una jornada', 'error');
          return;
        }
      } else {
        if (formData.jornadas.length === 0) {
          showToastMessage('Debe seleccionar al menos una jornada', 'error');
          return;
        }
      }

      // 9. Sanitizar todos los datos antes del envío
      const sanitizedFormData = {
        ...formData,
        nombre: sanitizeInput(formData.nombre),
        direccion_principal: sanitizeInput(formData.direccion_principal),
        nombre_contacto: sanitizeInput(formData.nombre_contacto),
        email: sanitizeInput(formData.email),
        password: sanitizeInput(formData.password)
      };

      const sanitizedSedes = sedes.map(sede => ({
        ...sede,
        nombre: sanitizeInput(sede.nombre)
      }));

      // Si todas las validaciones pasan, proceder con el registro
      // Primero crear el usuario en Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: sanitizedFormData.email,
        password: sanitizedFormData.password,
      });

      if (authError) {
        showToastMessage(authError.message, 'error');
        return;
      }

      // Luego crear la institución en la base de datos
      const response = await fetch('/api/instituciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...sanitizedFormData,
          sedes: sanitizedSedes
        }),
      });

      if (response.ok) {
        const result = await response.json();
        showToastMessage('¡Institución registrada exitosamente! Revise su correo para confirmar la cuenta.', 'success');
        
        // Limpiar el formulario
        setFormData({
          nombre: '',
          direccion_principal: '',
          nit: '',
          nombre_contacto: '',
          telefono_contacto: '',
          email: '',
          password: '',
          tiene_sedes: false,
          jornadas: []
        });
        setSedes([]);
        setPasswordErrors([]);
        setEmailDuplicateError('');
        setSecurityErrors({});
        setCurrentStep(1);
        
        // Redirigir a la página de login después de 3 segundos
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else {
        const errorData = await response.json();
        showToastMessage(errorData.error || 'Error al registrar la institución', 'error');
      }
    } catch (error) {
      setMessage('Error de seguridad detectado. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-2">
                Nombre de la Institución *
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                value={formData.nombre}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 text-sm border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                  securityErrors.nombre ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'
                }`}
                placeholder="Ingrese el nombre de la institución"
                maxLength={255}
              />
              {securityErrors.nombre && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <svg className="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {securityErrors.nombre}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="direccion_principal" className="block text-sm font-medium text-slate-700 mb-2">
                Dirección Principal *
              </label>
              <input
                id="direccion_principal"
                name="direccion_principal"
                type="text"
                required
                value={formData.direccion_principal}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 text-sm border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                  securityErrors.direccion_principal ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'
                }`}
                placeholder="Ingrese la dirección principal"
                maxLength={500}
              />
              {securityErrors.direccion_principal && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <svg className="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {securityErrors.direccion_principal}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="nit" className="block text-sm font-medium text-slate-700 mb-2">
                NIT * (mínimo 9 dígitos)
              </label>
              <input
                id="nit"
                name="nit"
                type="text"
                required
                value={formData.nit}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 text-sm border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                  (formData.nit && !isValidNIT(formData.nit)) || securityErrors.nit
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-slate-200'
                }`}
                placeholder="Ingrese el NIT (solo números)"
                maxLength={20}
              />
              {formData.nit && !isValidNIT(formData.nit) && (
                <p className="mt-1 text-xs text-red-600">El NIT debe contener al menos 9 dígitos numéricos</p>
              )}
              {securityErrors.nit && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <svg className="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {securityErrors.nit}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="nombre_contacto" className="block text-sm font-medium text-slate-700 mb-2">
                Nombre de Contacto *
              </label>
              <input
                id="nombre_contacto"
                name="nombre_contacto"
                type="text"
                required
                value={formData.nombre_contacto}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 text-sm border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                  securityErrors.nombre_contacto ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'
                }`}
                placeholder="Ingrese el nombre del contacto"
                maxLength={255}
              />
              {securityErrors.nombre_contacto && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <svg className="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {securityErrors.nombre_contacto}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="telefono_contacto" className="block text-sm font-medium text-slate-700 mb-2">
                Teléfono de Contacto * (mínimo 10 dígitos)
              </label>
              <input
                id="telefono_contacto"
                name="telefono_contacto"
                type="tel"
                required
                value={formData.telefono_contacto}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 text-sm border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                  (formData.telefono_contacto && !isValidPhone(formData.telefono_contacto)) || securityErrors.telefono_contacto
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-slate-200'
                }`}
                placeholder="Ingrese el teléfono (solo números)"
                maxLength={20}
              />
              {formData.telefono_contacto && !isValidPhone(formData.telefono_contacto) && (
                <p className="mt-1 text-xs text-red-600">El teléfono debe contener al menos 10 dígitos numéricos</p>
              )}
              {securityErrors.telefono_contacto && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <svg className="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {securityErrors.telefono_contacto}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Correo Electrónico *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 text-sm border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                  (formData.email && !isValidEmail(formData.email)) || emailDuplicateError || securityErrors.email
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-slate-200'
                }`}
                placeholder="correo@ejemplo.com"
                maxLength={254}
              />
              {formData.email && !isValidEmail(formData.email) && (
                <p className="mt-1 text-xs text-red-600">Por favor ingrese un correo electrónico válido</p>
              )}
              {emailDuplicateError && (
                <p className="mt-1 text-xs text-red-600">{emailDuplicateError}</p>
              )}
              {securityErrors.email && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <svg className="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {securityErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 text-sm border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                    passwordErrors.length > 0 || securityErrors.password
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-slate-200'
                  }`}
                  placeholder="Ingrese una contraseña segura"
                  maxLength={128}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
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
              
              {/* Mostrar errores de contraseña */}
              {passwordErrors.length > 0 && (
                <div className="mt-2 space-y-1">
                  {passwordErrors.map((error, index) => (
                    <p key={index} className="text-xs text-red-600 flex items-center">
                      <svg className="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </p>
                  ))}
                </div>
              )}
              
              {/* Mostrar indicador de fortaleza de contraseña */}
              {formData.password && passwordErrors.length === 0 && !securityErrors.password && (
                <p className="mt-1 text-xs text-green-600 flex items-center">
                  <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Contraseña segura
                </p>
              )}
              
              {/* Mostrar error de seguridad de contraseña */}
              {securityErrors.password && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <svg className="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {securityErrors.password}
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="tiene_sedes"
                  checked={formData.tiene_sedes}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <span className="ml-3 text-sm font-medium text-slate-700">
                  ¿Tiene sedes?
                </span>
              </label>
            </div>

            {/* Jornadas - solo si no tiene sedes */}
            {!formData.tiene_sedes && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-800">Jornadas de la Institución</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={formData.jornadas.includes('única')}
                      onChange={(e) => handleJornadaChange('única', e.target.checked)}
                      disabled={formData.jornadas.some(j => j !== 'única')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded disabled:opacity-50"
                    />
                    <span className="ml-3 text-sm text-slate-700">Jornada Única</span>
                  </label>

                  <label className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={formData.jornadas.includes('mañana')}
                      onChange={(e) => handleJornadaChange('mañana', e.target.checked)}
                      disabled={formData.jornadas.includes('única')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded disabled:opacity-50"
                    />
                    <span className="ml-3 text-sm text-slate-700">Jornada Mañana</span>
                  </label>

                  <label className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={formData.jornadas.includes('tarde')}
                      onChange={(e) => handleJornadaChange('tarde', e.target.checked)}
                      disabled={formData.jornadas.includes('única')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded disabled:opacity-50"
                    />
                    <span className="ml-3 text-sm text-slate-700">Jornada Tarde</span>
                  </label>

                  <label className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={formData.jornadas.includes('nocturna')}
                      onChange={(e) => handleJornadaChange('nocturna', e.target.checked)}
                      disabled={formData.jornadas.includes('única')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded disabled:opacity-50"
                    />
                    <span className="ml-3 text-sm text-slate-700">Jornada Nocturna</span>
                  </label>
                </div>
              </div>
            )}

            {/* Gestión de sedes */}
            {formData.tiene_sedes && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-semibold text-slate-800">Sedes</h4>
                  <button
                    type="button"
                    onClick={addSede}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    + Agregar Sede
                  </button>
                </div>

                {sedes.map((sede, index) => (
                  <div key={sede.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h5 className="text-sm font-medium text-slate-700">Sede {index + 1}</h5>
                      <button
                        type="button"
                        onClick={() => removeSede(sede.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nombre de la Sede *
                      </label>
                      <input
                        type="text"
                        value={sede.nombre}
                        onChange={(e) => updateSede(sede.id, 'nombre', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white/50 backdrop-blur-sm transition-all duration-200"
                        placeholder="Nombre de la sede"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        Jornadas de la Sede *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-200">
                          <input
                            type="checkbox"
                            checked={sede.jornadas.includes('única')}
                            onChange={(e) => handleSedeJornadaChange(sede.id, 'única', e.target.checked)}
                            disabled={sede.jornadas.some(j => j !== 'única')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded disabled:opacity-50"
                          />
                          <span className="ml-2 text-sm text-slate-700">Jornada Única</span>
                        </label>
                        
                        <label className="flex items-center p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-200">
                          <input
                            type="checkbox"
                            checked={sede.jornadas.includes('mañana')}
                            onChange={(e) => handleSedeJornadaChange(sede.id, 'mañana', e.target.checked)}
                            disabled={sede.jornadas.includes('única')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded disabled:opacity-50"
                          />
                          <span className="ml-2 text-sm text-slate-700">Jornada Mañana</span>
                        </label>
                        
                        <label className="flex items-center p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-200">
                          <input
                            type="checkbox"
                            checked={sede.jornadas.includes('tarde')}
                            onChange={(e) => handleSedeJornadaChange(sede.id, 'tarde', e.target.checked)}
                            disabled={sede.jornadas.includes('única')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded disabled:opacity-50"
                          />
                          <span className="ml-2 text-sm text-slate-700">Jornada Tarde</span>
                        </label>
                        
                        <label className="flex items-center p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-200">
                          <input
                            type="checkbox"
                            checked={sede.jornadas.includes('nocturna')}
                            onChange={(e) => handleSedeJornadaChange(sede.id, 'nocturna', e.target.checked)}
                            disabled={sede.jornadas.includes('única')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded disabled:opacity-50"
                          />
                          <span className="ml-2 text-sm text-slate-700">Jornada Nocturna</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                {sedes.length === 0 && (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                    <p className="text-sm text-slate-500">
                      No hay sedes agregadas. Haga clic en "Agregar Sede" para comenzar.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Registrar Institución
          </h1>
          <p className="text-slate-600 mb-3">
            Complete los datos paso a paso
          </p>
          {/* Security Indicator */}
          <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Formulario Protegido
          </div>
        </div>

        <div className="flex gap-6">
          {/* Vertical Progress Bar */}
          <div className="w-72 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">Progreso</h3>
              <div className="text-xs text-slate-500 bg-slate-100 rounded-full px-3 py-1 inline-block">
                Paso {currentStep} de {steps.length}
              </div>
            </div>

            {/* Vertical Progress Steps */}
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl text-sm font-medium transition-all duration-300 ${
                      currentStep > step.id
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                        : currentStep === step.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg ring-4 ring-blue-200'
                        : 'bg-slate-100 text-slate-400 border-2 border-slate-200'
                    }`}>
                      {currentStep > step.id ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-1 h-8 mt-2 rounded-full transition-all duration-300 ${
                        currentStep > step.id ? 'bg-gradient-to-b from-emerald-500 to-teal-500' : 'bg-slate-200'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 pt-2">
                    <div className={`text-sm font-medium transition-colors duration-200 ${
                      currentStep >= step.id ? 'text-slate-800' : 'text-slate-500'
                    }`}>
                      {step.name}
                    </div>
                    <div className={`text-xs mt-1 transition-colors duration-200 ${
                      currentStep >= step.id ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="text-xs font-medium text-slate-700 mb-2">Progreso General</div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
              <div className="text-xs text-slate-500 mt-2 text-center">
                {Math.round((currentStep / steps.length) * 100)}% completado
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Step Content */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800">
                  {steps[currentStep - 1].name}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {steps[currentStep - 1].description}
                </p>
              </div>
              
              <div className="px-6 py-6">
                {renderStepContent()}
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                ← Anterior
              </button>
              
              <div className="flex space-x-3">
                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep(currentStep)}
                    className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Siguiente →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!validateStep(currentStep) || isSubmitting}
                    className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 border border-transparent rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isSubmitting ? 'Registrando...' : '✓ Registrar Institución'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-4 right-4 z-50 max-w-md w-full">
            <div className={`w-full bg-white shadow-2xl rounded-2xl pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border ${
              toastType === 'success' 
                ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50' 
                : 'border-red-200 bg-gradient-to-r from-red-50 to-rose-50'
            }`}>
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {toastType === 'success' ? (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${
                          toastType === 'success' ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {toastType === 'success' ? '¡Registro Exitoso!' : 'Error'}
                        </p>
                        <p className={`text-sm mt-1 ${
                          toastType === 'success' ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {toastMessage}
                        </p>
                        {toastType === 'success' && toastMessage.includes('correo') && (
                          <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs text-blue-800">
                              📧 Revise su bandeja de entrada y carpeta de spam para confirmar su cuenta.
                            </p>
                          </div>
                        )}
                      </div>
                      <button
                        className="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full p-1"
                        onClick={() => setShowToast(false)}
                      >
                        <span className="sr-only">Cerrar</span>
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
