'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import PhoneInputField, { isPhoneValid } from '@/components/ui/PhoneInputField';
import type { Sede } from '@/types/sede';

export default function RegistroInstitucion() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion_principal: '',
    nit: '',
    nombre_contacto: '',
    telefono_contacto: '', // E.164: ej. +573001234567
    email: '',
    password: '',
    confirm_password: '',
    tiene_sedes: false,
    jornadas: [] as string[],
    color_primario: '#2563eb',
    color_secundario: '#0f172a'
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
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [securityErrors, setSecurityErrors] = useState<{[key: string]: string}>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [fileErrors, setFileErrors] = useState<{ logo?: string; banner?: string }>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState('');

  const steps = [
    { id: 1, name: 'Información Básica', description: 'Datos principales de la institución' },
    { id: 2, name: 'Información de Contacto', description: 'Datos de contacto' },
    { id: 3, name: 'Configuración de Sedes', description: 'Jornadas y sedes' },
    { id: 4, name: 'Personalización', description: 'Logo, banner y colores institucionales' }
  ];

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccessModalMessage(message);
      setShowSuccessModal(true);
      return;
    }
    setToastMessage(message);
    setToastType('error');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const closeSuccessModalAndRedirect = () => {
    setShowSuccessModal(false);
    window.location.href = '/login';
  };

  const obtainSupabaseClient = () => {
    if (!isSupabaseConfigured()) {
      showToastMessage(
        'El servicio de autenticación no está configurado. Contacta al administrador del sistema.',
        'error'
      );
      return null;
    }
    try {
      return getSupabaseClient();
    } catch (error) {
      console.error('No se pudo inicializar Supabase:', error);
      showToastMessage('No se pudo conectar con el servicio de autenticación. Intenta más tarde.', 'error');
      return null;
    }
  };

  // Validación de email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validación de NIT (exactamente 9 dígitos, sin dígito de verificación)
  const isValidNIT = (nit: string): boolean => {
    const nitRegex = /^\d{9}$/;
    return nitRegex.test(nit);
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
    if (!formData.confirm_password.trim()) errors.push('Debe repetir la contraseña');
    if (!formData.color_primario.trim()) errors.push('El color primario es requerido');
    if (!formData.color_secundario.trim()) errors.push('El color secundario es requerido');
    
    return errors;
  };

  // Validación de email duplicado
  const checkEmailDuplicate = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/instituciones/by-email/${encodeURIComponent(email)}`);
      if (!response.ok) {
        return false;
      }
      const data = await response.json();
      return Boolean(data?.exists);
    } catch (error) {
      return false; // En caso de error, asumimos que no está duplicado
    }
  };

  const handleVerifyEmail = async () => {
    if (!formData.email || !isValidEmail(formData.email)) {
      setEmailDuplicateError('Ingrese un correo electrónico válido');
      setIsEmailVerified(false);
      return;
    }

    if (securityErrors.email) {
      setIsEmailVerified(false);
      return;
    }

    setIsCheckingEmail(true);
    const isDuplicate = await checkEmailDuplicate(formData.email);
    if (isDuplicate) {
      setEmailDuplicateError('Este correo electrónico ya está registrado');
      setIsEmailVerified(false);
    } else {
      setEmailDuplicateError('');
      setIsEmailVerified(true);
    }
    setIsCheckingEmail(false);
  };

  // Requisitos de contraseña para mostrar lista y marcar en verde al cumplirse
  const PASSWORD_REQUIREMENTS = [
    { id: 'length', label: 'Al menos 8 caracteres', check: (p: string) => p.length >= 8 },
    { id: 'upper', label: 'Al menos una letra mayúscula', check: (p: string) => /[A-Z]/.test(p) },
    { id: 'lower', label: 'Al menos una letra minúscula', check: (p: string) => /[a-z]/.test(p) },
    { id: 'number', label: 'Al menos un número', check: (p: string) => /\d/.test(p) },
    { id: 'special', label: 'Al menos un carácter especial (!@#$%^&*(), etc.)', check: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ] as const;

  // Validación de contraseña segura
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('La contraseña debe tener al menos 8 caracteres');
    if (!/[A-Z]/.test(password)) errors.push('La contraseña debe contener al menos una letra mayúscula');
    if (!/[a-z]/.test(password)) errors.push('La contraseña debe contener al menos una letra minúscula');
    if (!/\d/.test(password)) errors.push('La contraseña debe contener al menos un número');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('La contraseña debe contener al menos un carácter especial');
    return errors;
  };

  const generateStrongPassword = () => {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghijkmnpqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '!@#$%^&*()_+-=[]{};:,.?';
    const all = upper + lower + numbers + symbols;
    const length = 12;

    const pick = (pool: string) => pool[Math.floor(Math.random() * pool.length)];
    let password = [
      pick(upper),
      pick(lower),
      pick(numbers),
      pick(symbols),
    ];

    for (let i = password.length; i < length; i += 1) {
      password.push(pick(all));
    }

    // Shuffle
    password = password.sort(() => Math.random() - 0.5);

    const generated = password.join('');
    setFormData(prev => ({
      ...prev,
      password: generated,
      confirm_password: generated
    }));

    const errors = validatePassword(generated);
    setPasswordErrors(errors);

    const securityError = validateSecurePassword(generated);
    if (securityError) {
      setSecurityErrors(prev => ({ ...prev, password: securityError }));
    } else {
      setSecurityErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.password;
        return newErrors;
      });
    }
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
      ;
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
        const phoneValid = formData.telefono_contacto && isPhoneValid(formData.telefono_contacto);
        const passwordMatch = formData.password && formData.confirm_password && formData.password === formData.confirm_password;
        return !!(
          formData.nombre_contacto.trim() && 
          formData.telefono_contacto.trim() && 
          phoneValid && 
          emailValid && 
          isEmailVerified &&
          passwordValid &&
          passwordMatch
        );
      case 3:
        if (formData.tiene_sedes) {
          return sedes.length > 0 && sedes.every(sede => sede.nombre.trim() && sede.jornadas.length > 0);
        } else {
          return formData.jornadas.length > 0;
        }
      case 4:
        return !!(
          logoFile &&
          bannerFile &&
          !fileErrors.logo &&
          !fileErrors.banner &&
          formData.color_primario.trim() &&
          formData.color_secundario.trim()
        );
      default:
        return false;
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    // Restricción para campos numéricos
    let processedValue = value;
    if (name === 'nit') {
      processedValue = value.replace(/\D/g, '').slice(0, 9);
    }
    // telefono_contacto lo gestiona PhoneInput (valor E.164), no handleInputChange
    
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

    // Validar seguridad de email
    if (name === 'email') {
      setIsEmailVerified(false);
      setEmailDuplicateError('');
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
    setSedes(prev => prev.filter(sede => String(sede.id) !== id));
  };

  const updateSede = (id: string, field: keyof Sede, value: string | string[]) => {
    setSedes(prev => prev.map(sede => 
      String(sede.id) === id ? { ...sede, [field]: value } : sede
    ));
  };

  const handleSedeJornadaChange = (sedeId: string, jornada: string, checked: boolean) => {
    setSedes(prev => prev.map(sede => {
      if (String(sede.id) === sedeId) {
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

  const isAllowedImageFile = (file: File): boolean => {
    const allowedTypes = ['image/png', 'image/svg+xml'];
    if (allowedTypes.includes(file.type)) {
      return true;
    }
    const lowerName = file.name.toLowerCase();
    return lowerName.endsWith('.png') || lowerName.endsWith('.svg');
  };

  const parseSvgDimensions = (svgText: string): { width: number; height: number } | null => {
    const widthMatch = svgText.match(/width="([\d.]+)(px)?"/i);
    const heightMatch = svgText.match(/height="([\d.]+)(px)?"/i);
    if (widthMatch && heightMatch) {
      const width = Number.parseFloat(widthMatch[1]);
      const height = Number.parseFloat(heightMatch[1]);
      if (Number.isFinite(width) && Number.isFinite(height)) {
        return { width, height };
      }
    }

    const viewBoxMatch = svgText.match(/viewBox="([\d.\s]+)"/i);
    if (viewBoxMatch) {
      const parts = viewBoxMatch[1].trim().split(/\s+/).map(Number);
      if (parts.length === 4 && parts.every(value => Number.isFinite(value))) {
        return { width: parts[2], height: parts[3] };
      }
    }

    return null;
  };

  const getImageDimensions = async (file: File): Promise<{ width: number; height: number } | null> => {
    const lowerName = file.name.toLowerCase();
    const isSvg = file.type === 'image/svg+xml' || lowerName.endsWith('.svg');
    if (isSvg) {
      try {
        const svgText = await file.text();
        const parsed = parseSvgDimensions(svgText);
        if (parsed) {
          return parsed;
        }
      } catch (error) {
        return null;
      }
    }

    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const dimensions = { width: img.naturalWidth, height: img.naturalHeight };
        URL.revokeObjectURL(url);
        resolve(dimensions.width && dimensions.height ? dimensions : null);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    kind: 'logo' | 'banner'
  ) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setFileErrors(prev => ({ ...prev, [kind]: undefined }));
      if (kind === 'logo') {
        setLogoFile(null);
      } else {
        setBannerFile(null);
      }
      return;
    }

    if (!isAllowedImageFile(file)) {
      setFileErrors(prev => ({
        ...prev,
        [kind]: 'Solo se permiten archivos PNG o SVG'
      }));
      if (kind === 'logo') {
        setLogoFile(null);
      } else {
        setBannerFile(null);
      }
      return;
    }

    setFileErrors(prev => ({ ...prev, [kind]: undefined }));
    if (kind === 'logo') {
      setLogoFile(file);
    } else {
      setBannerFile(file);
    }
  };

  const uploadInstitutionAsset = async (
    supabaseClient: ReturnType<typeof getSupabaseClient>,
    institucionId: number,
    file: File,
    kind: 'logo' | 'banner'
  ): Promise<string | null> => {
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'instituciones';
    const extension = file.name.split('.').pop()?.toLowerCase() || (file.type === 'image/svg+xml' ? 'svg' : 'png');
    const fileName = `${kind}.${extension}`;
    const filePath = `instituciones/${institucionId}/${fileName}`;

    const { error } = await supabaseClient.storage.from(bucket).upload(filePath, file, {
      upsert: true,
      contentType: file.type || undefined,
      cacheControl: '3600'
    });

    if (error) {
      console.error(`Error subiendo ${kind}:`, error);
      showToastMessage(
        `No se pudo subir el ${kind}. ${error.message || 'Verifique el bucket y las policies.'}`,
        'error'
      );
      return null;
    }

    return filePath;
  };

  const validateSelectedImages = async (): Promise<boolean> => {
    const newErrors: { logo?: string; banner?: string } = {};

    if (!logoFile) {
      newErrors.logo = 'Debe adjuntar un logo válido';
    }
    if (!bannerFile) {
      newErrors.banner = 'Debe adjuntar un banner válido';
    }

    setFileErrors(newErrors);
    return !newErrors.logo && !newErrors.banner;
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
        showToastMessage('El NIT debe contener exactamente 9 dígitos numéricos (sin dígito de verificación)', 'error');
        return;
      }

      // 4. Validar formato de teléfono (E.164)
      if (!formData.telefono_contacto || !isPhoneValid(formData.telefono_contacto)) {
        showToastMessage('Ingrese un número de teléfono válido con indicativo de país', 'error');
        return;
      }

      // 5. Validar formato de email
      if (!isValidEmail(formData.email)) {
        showToastMessage('Por favor ingrese un correo electrónico válido', 'error');
        return;
      }

      // 6. Validar verificación de email
      if (!isEmailVerified) {
        showToastMessage('Debe verificar el correo antes de continuar', 'error');
        return;
      }

      // 7. Validar contraseña
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        showToastMessage(`Contraseña inválida: ${passwordErrors.join(', ')}`, 'error');
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

      // 9. Validar personalización requerida
      const imagesValid = await validateSelectedImages();
      if (!imagesValid) {
        showToastMessage('Corrija los errores del logo o banner antes de continuar', 'error');
        return;
      }

      // 10. Sanitizar todos los datos antes del envío (telefono_contacto ya en E.164)
      const { confirm_password, ...baseFormData } = formData;
      const sanitizedFormData = {
        ...baseFormData,
        nombre: sanitizeInput(formData.nombre).trim(),
        direccion_principal: sanitizeInput(formData.direccion_principal).trim(),
        nombre_contacto: sanitizeInput(formData.nombre_contacto).trim(),
        telefono_contacto: formData.telefono_contacto.trim(), // E.164, ej. +573001234567
        email: sanitizeInput(formData.email).trim(),
        password: sanitizeInput(formData.password)
      };

      const sanitizedSedes = sedes.map(sede => ({
        ...sede,
        nombre: sanitizeInput(sede.nombre).trim()
      }));

      // Si todas las validaciones pasan, proceder con el registro
      // Primero crear el usuario en Supabase
      const supabaseClient = obtainSupabaseClient();
      if (!supabaseClient) {
        return;
      }

      const { data: authData, error: authError } = await supabaseClient.auth.signUp({
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
        const institucionId = result?.data?.id;
        if (!institucionId) {
          showToastMessage('No se pudo obtener el ID de la institución para guardar el branding', 'error');
          return;
        }

        const logoPath = await uploadInstitutionAsset(
          supabaseClient,
          institucionId,
          logoFile as File,
          'logo'
        );
        if (!logoPath) {
          return;
        }
        const bannerPath = await uploadInstitutionAsset(
          supabaseClient,
          institucionId,
          bannerFile as File,
          'banner'
        );
        if (!bannerPath) {
          return;
        }

        const brandingResponse = await fetch(`/api/instituciones/${institucionId}/branding`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            logo_url: logoPath,
            banner_url: bannerPath
          })
        });

        if (!brandingResponse.ok) {
          showToastMessage('La institución se creó, pero no se pudo guardar el logo y banner', 'error');
          return;
        }

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
          confirm_password: '',
          tiene_sedes: false,
          jornadas: [],
          color_primario: '#2563eb',
          color_secundario: '#0f172a'
        });
        setSedes([]);
        setPasswordErrors([]);
        setEmailDuplicateError('');
        setSecurityErrors({});
        setLogoFile(null);
        setBannerFile(null);
        setFileErrors({});
        setCurrentStep(1);
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
                className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                  securityErrors.nombre ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
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
                className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                  securityErrors.direccion_principal ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
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
                NIT * (9 dígitos)
              </label>
              <p className="text-xs text-slate-500 mb-2">
                No incluya el dígito de verificación. Solo los 9 primeros dígitos.
              </p>
              <input
                id="nit"
                name="nit"
                type="text"
                required
                value={formData.nit}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                  (formData.nit && !isValidNIT(formData.nit)) || securityErrors.nit
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : ''
                }`}
                placeholder="9 dígitos (sin dígito de verificación)"
                minLength={9}
                maxLength={9}
              />
              {formData.nit && !isValidNIT(formData.nit) && (
                <p className="mt-1 text-xs text-red-600">El NIT debe contener exactamente 9 dígitos numéricos (sin dígito de verificación)</p>
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
            <div className="rounded-xl p-4 bg-blue-50 border-l-4 border-blue-500 shadow-sm flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-blue-900 leading-relaxed pt-0.5">
                El correo electrónico y los datos de contacto que ingrese a continuación serán registrados como superadministrador de la institución.
              </p>
            </div>

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
                className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                  securityErrors.nombre_contacto ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
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
                Teléfono de Contacto *
              </label>
              <PhoneInputField
                id="telefono_contacto"
                value={formData.telefono_contacto}
                onChange={(v) => setFormData((prev) => ({ ...prev, telefono_contacto: v }))}
                aria-label="Número de teléfono"
              />
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
              <p className="text-sm text-slate-600 mb-2">
                Debe dar clic en el botón &quot;Verificar correo&quot; para comprobar que el correo no está en uso en la aplicación y así poder continuar con el campo de contraseña.
              </p>
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
                className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                  (formData.email && !isValidEmail(formData.email)) || emailDuplicateError || securityErrors.email
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                placeholder="correo@ejemplo.com"
                maxLength={254}
              />
              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={!formData.email || !isValidEmail(formData.email) || isCheckingEmail || !!securityErrors.email}
                  className="text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCheckingEmail ? 'Verificando...' : 'Verificar correo'}
                </button>
              </div>
              {formData.email && !isValidEmail(formData.email) && (
                <p className="mt-1 text-xs text-red-600">Por favor ingrese un correo electrónico válido</p>
              )}
              {emailDuplicateError && (
                <p className="mt-1 text-xs text-red-600">{emailDuplicateError}</p>
              )}
              {isEmailVerified && !emailDuplicateError && (
                <p className="mt-1 text-xs text-green-600">Correo disponible</p>
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
                  autoComplete="new-password"
                  disabled={!isEmailVerified}
                  className={`w-full px-4 py-2.5 pr-12 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                    passwordErrors.length > 0 || securityErrors.password
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : ''
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

              <div className="mt-2">
                <button
                  type="button"
                  onClick={generateStrongPassword}
                  disabled={!isEmailVerified}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-50"
                >
                  Generar contraseña automáticamente
                </button>
              </div>

              {/* Características de la contraseña: se marcan en verde al cumplirse */}
              <p className="mt-3 text-xs font-medium text-slate-600 mb-1.5">La contraseña debe cumplir:</p>
              <ul className="space-y-1.5" aria-live="polite">
                {PASSWORD_REQUIREMENTS.map(({ id, label, check }) => {
                  const fulfilled = !!formData.password && check(formData.password);
                  return (
                    <li
                      key={id}
                      className={`text-xs flex items-center gap-2 transition-colors duration-200 ${
                        fulfilled ? 'text-green-600' : 'text-slate-500'
                      }`}
                    >
                      {fulfilled ? (
                        <svg className="w-4 h-4 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="w-4 h-4 flex-shrink-0 rounded-full border-2 border-slate-300 inline-block" aria-hidden />
                      )}
                      <span className={fulfilled ? 'font-medium' : ''}>{label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-slate-700 mb-2">
                Repetir Contraseña *
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.confirm_password}
                onChange={handleInputChange}
                autoComplete="new-password"
                  disabled={!isEmailVerified}
                className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                  formData.confirm_password && formData.password !== formData.confirm_password
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                placeholder="Repita la contraseña"
                maxLength={128}
              />
              {formData.confirm_password && formData.password !== formData.confirm_password && (
                <p className="mt-1 text-xs text-red-600">Las contraseñas no coinciden</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="rounded-xl p-4 bg-amber-50 border-l-4 border-amber-500 shadow-sm flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-amber-900 leading-relaxed pt-0.5">
                En este paso debe indicar si la institución tiene una sola sede o varias. Si tiene una sola sede, seleccione las jornadas que ofrece la institución (única, mañana, tarde o nocturna). Si tiene más de una sede, active el interruptor y agregue cada sede con su nombre y las jornadas de cada una.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <label htmlFor="tiene_sedes" className="group flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                <input
                  id="tiene_sedes"
                  type="checkbox"
                  name="tiene_sedes"
                  checked={formData.tiene_sedes}
                  onChange={handleInputChange}
                  className="sr-only"
                  aria-hidden
                />
                <span className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ${formData.tiene_sedes ? 'bg-blue-600' : 'bg-slate-200'}`}>
                  <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition duration-200 translate-x-0.5 mt-0.5 ${formData.tiene_sedes ? 'translate-x-5' : ''}`} />
                </span>
                <span className="text-sm font-medium text-slate-700">
                  El instituto tiene más de una sede; active el interruptor para sí y complete los campos de las sedes del instituto.
                </span>
              </label>
            </div>

            {/* Jornadas - solo si no tiene sedes */}
            {!formData.tiene_sedes && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-800">Jornadas de la Institución</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={formData.jornadas.includes('única')}
                      onChange={(e) => handleJornadaChange('única', e.target.checked)}
                      disabled={formData.jornadas.some(j => j !== 'única')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded disabled:opacity-50"
                    />
                    <span className={`ml-3 text-sm text-slate-700 ${formData.jornadas.some(j => j !== 'única') ? 'line-through' : ''}`}>Jornada Única</span>
                  </label>

                  <label className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={formData.jornadas.includes('mañana')}
                      onChange={(e) => handleJornadaChange('mañana', e.target.checked)}
                      disabled={formData.jornadas.includes('única')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded disabled:opacity-50"
                    />
                    <span className={`ml-3 text-sm text-slate-700 ${formData.jornadas.includes('única') ? 'line-through' : ''}`}>Jornada Mañana</span>
                  </label>

                  <label className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={formData.jornadas.includes('tarde')}
                      onChange={(e) => handleJornadaChange('tarde', e.target.checked)}
                      disabled={formData.jornadas.includes('única')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded disabled:opacity-50"
                    />
                    <span className={`ml-3 text-sm text-slate-700 ${formData.jornadas.includes('única') ? 'line-through' : ''}`}>Jornada Tarde</span>
                  </label>

                  <label className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={formData.jornadas.includes('nocturna')}
                      onChange={(e) => handleJornadaChange('nocturna', e.target.checked)}
                      disabled={formData.jornadas.includes('única')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded disabled:opacity-50"
                    />
                    <span className={`ml-3 text-sm text-slate-700 ${formData.jornadas.includes('única') ? 'line-through' : ''}`}>Jornada Nocturna</span>
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
                    className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
                        onClick={() => removeSede(String(sede.id))}
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
                        onChange={(e) => updateSede(String(sede.id), 'nombre', e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400"
                        placeholder="Nombre de la sede"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        Jornadas de la Sede *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <label className="flex items-center p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-200">
                          <input
                            type="checkbox"
                            checked={sede.jornadas.includes('única')}
                            onChange={(e) => handleSedeJornadaChange(String(sede.id), 'única', e.target.checked)}
                            disabled={sede.jornadas.some(j => j !== 'única')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded disabled:opacity-50"
                          />
                          <span className={`ml-2 text-sm text-slate-700 ${sede.jornadas.some(j => j !== 'única') ? 'line-through' : ''}`}>Jornada Única</span>
                        </label>
                        
                        <label className="flex items-center p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-200">
                          <input
                            type="checkbox"
                            checked={sede.jornadas.includes('mañana')}
                            onChange={(e) => handleSedeJornadaChange(String(sede.id), 'mañana', e.target.checked)}
                            disabled={sede.jornadas.includes('única')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded disabled:opacity-50"
                          />
                          <span className={`ml-2 text-sm text-slate-700 ${sede.jornadas.includes('única') ? 'line-through' : ''}`}>Jornada Mañana</span>
                        </label>
                        
                        <label className="flex items-center p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-200">
                          <input
                            type="checkbox"
                            checked={sede.jornadas.includes('tarde')}
                            onChange={(e) => handleSedeJornadaChange(String(sede.id), 'tarde', e.target.checked)}
                            disabled={sede.jornadas.includes('única')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded disabled:opacity-50"
                          />
                          <span className={`ml-2 text-sm text-slate-700 ${sede.jornadas.includes('única') ? 'line-through' : ''}`}>Jornada Tarde</span>
                        </label>
                        
                        <label className="flex items-center p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-200">
                          <input
                            type="checkbox"
                            checked={sede.jornadas.includes('nocturna')}
                            onChange={(e) => handleSedeJornadaChange(String(sede.id), 'nocturna', e.target.checked)}
                            disabled={sede.jornadas.includes('única')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded disabled:opacity-50"
                          />
                          <span className={`ml-2 text-sm text-slate-700 ${sede.jornadas.includes('única') ? 'line-through' : ''}`}>Jornada Nocturna</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                {sedes.length === 0 && (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                    <p className="text-sm text-slate-500">
                      No hay sedes agregadas. Haga clic en &quot;Agregar Sede&quot; para comenzar.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Logo institucional *
              </label>
              <input
                type="file"
                accept="image/png,image/svg+xml"
                onChange={(e) => handleFileChange(e, 'logo')}
                className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {logoFile && (
                <p className="mt-2 text-xs text-slate-500">Archivo seleccionado: {logoFile.name}</p>
              )}
              {fileErrors.logo && (
                <p className="mt-2 text-xs text-red-600">{fileErrors.logo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Banner institucional *
              </label>
              <input
                type="file"
                accept="image/png,image/svg+xml"
                onChange={(e) => handleFileChange(e, 'banner')}
                className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {bannerFile && (
                <p className="mt-2 text-xs text-slate-500">Archivo seleccionado: {bannerFile.name}</p>
              )}
              {fileErrors.banner && (
                <p className="mt-2 text-xs text-red-600">{fileErrors.banner}</p>
              )}
            </div>

            <div className="rounded-xl p-4 bg-indigo-50 border-l-4 border-indigo-500 shadow-sm flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm text-indigo-900 leading-relaxed pt-0.5">
                <p className="font-medium mb-1">Colores de la institución</p>
                <p>
                  Puede seleccionar el color primario y el color secundario que identifican a su institución. Estos se usarán en la plataforma. Para elegir un color: haga clic en el cuadro de color para abrir el selector y elegir el tono deseado, o escriba el código hexadecimal (por ejemplo: #2563eb) en el campo de texto al lado.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Color primario *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="color_primario"
                    value={formData.color_primario}
                    onChange={handleInputChange}
                    className="h-10 w-14 rounded border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    name="color_primario"
                    value={formData.color_primario}
                    onChange={handleInputChange}
                    maxLength={7}
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Color secundario *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="color_secundario"
                    value={formData.color_secundario}
                    onChange={handleInputChange}
                    className="h-10 w-14 rounded border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    name="color_secundario"
                    value={formData.color_secundario}
                    onChange={handleInputChange}
                    maxLength={7}
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
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
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Vertical Progress Bar */}
          <div className="w-full lg:w-72 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
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
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : currentStep === step.id
                        ? 'bg-blue-500 text-white shadow-lg ring-4 ring-blue-200'
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
                        currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-200'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 pt-2 min-w-0">
                    <div className={`text-sm font-medium transition-colors duration-200 ${
                      currentStep >= step.id ? 'text-slate-800' : 'text-slate-500'
                    }`}>
                      <span className="break-words">{step.name}</span>
                    </div>
                    <div className={`text-xs mt-1 transition-colors duration-200 ${
                      currentStep >= step.id ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                      <span className="break-words">{step.description}</span>
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
                  className="bg-blue-500 h-2 rounded-full transition-all duration-700 ease-out"
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
            <form onSubmit={handleSubmit}>
              {/* Step Content */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                <div className="px-6 py-4 bg-blue-50 border-b border-slate-200">
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
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    ← Anterior
                  </button>
                ) : (
                  <div />
                )}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full sm:w-auto">
                  {currentStep < steps.length ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateStep(currentStep)}
                      className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Siguiente →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!validateStep(currentStep) || isSubmitting}
                      className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-xl shadow-lg hover:shadow-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? 'Registrando...' : '✓ Registrar Institución'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Modal de registro exitoso */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white shadow-2xl rounded-2xl max-w-md w-full overflow-hidden border border-green-200">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-green-800">¡Registro exitoso!</h3>
                    <p className="text-sm text-green-700 mt-2">{successModalMessage}</p>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-800">
                        📧 Revise su bandeja de entrada y carpeta de spam para confirmar su cuenta antes de iniciar sesión.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={closeSuccessModalAndRedirect}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    Cerrar e ir a iniciar sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification (solo errores) */}
        {showToast && (
          <div className="fixed top-4 right-4 z-50 max-w-md w-full">
            <div className="w-full bg-white shadow-2xl rounded-2xl pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border border-red-200 bg-red-50">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-red-800">Error</p>
                        <p className="text-sm mt-1 text-red-700">{toastMessage}</p>
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
      </main>
      <Footer />
    </div>
  );
}
