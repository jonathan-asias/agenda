'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect, useRef, Suspense } from 'react';
import { APP_URL } from '@/lib/env';
import { useSearchParams } from 'next/navigation';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import PhoneInputField, { isPhoneValid } from '@/components/ui/PhoneInputField';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { LoaderPage, TurnstileField, isTurnstileVerified } from '@/components/ui';
import type { Sede } from '@/types/sede';

export default function RegistroInstitucionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
          <LoaderPage message="Cargando registro..." />
        </div>
      }
    >
      <RegistroInstitucion />
    </Suspense>
  );
}

function RegistroInstitucion() {
  const searchParams = useSearchParams();
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
  const [showBrandingPreview, setShowBrandingPreview] = useState(false);
  const [showColorsInfo, setShowColorsInfo] = useState(false);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState('');
  const [registroToken, setRegistroToken] = useState('');
  const [paymentPrefilled, setPaymentPrefilled] = useState(false);
  const [isTrialInvite, setIsTrialInvite] = useState(false);
  /** Campos bloqueados por pago/invitación (solo los que vienen prellenados). */
  const [lockedFields, setLockedFields] = useState<string[]>([]);
  const [accessValidated, setAccessValidated] = useState(false);
  const [accessBlocked, setAccessBlocked] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const submitInFlightRef = useRef(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);

  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl?.trim()) {
      setFormData((prev) => ({ ...prev, email: emailFromUrl.trim() }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!logoFile) {
      setLogoPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(logoFile);
    setLogoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  useEffect(() => {
    if (!bannerFile) {
      setBannerPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(bannerFile);
    setBannerPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [bannerFile]);

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

  useEffect(() => {
    let cancelled = false;
    const token = searchParams.get('token')?.trim();

    (async () => {
      setCheckingAccess(true);
      try {
        const cfgRes = await fetch('/api/payments/config');
        const cfg = cfgRes.ok ? await cfgRes.json() : { configured: false };

        if (!token) {
          if (cfg.configured) {
            if (!cancelled) {
              showToastMessage(
                'Use el enlace seguro enviado a su correo tras completar el pago.',
                'error'
              );
              setAccessBlocked(true);
              setTimeout(() => {
                window.location.href = '/#pricing';
              }, 3000);
            }
            return;
          }

          const emailFromUrl = searchParams.get('email')?.trim();
          if (emailFromUrl && !cancelled) {
            setFormData((prev) => ({ ...prev, email: emailFromUrl }));
            setAccessValidated(true);
          }
          return;
        }

        if (!cancelled) setRegistroToken(token);

        const res = await fetch(
          `/api/payments/validate-registro-access?token=${encodeURIComponent(token)}`
        );
        const data = await res.json();
        if (cancelled) return;

        if (data.valid && data.email) {
          const pre = data.preRegistro as
            | {
                nombre?: string;
                direccion_principal?: string;
                nit?: string;
                nombre_contacto?: string;
                telefono_contacto?: string;
              }
            | null
            | undefined;
          const trial = Boolean(data.isTrial);

          setFormData((prev) => ({
            ...prev,
            email: data.email,
            ...(pre
              ? {
                  nombre: pre.nombre ?? prev.nombre,
                  direccion_principal: pre.direccion_principal ?? prev.direccion_principal,
                  nit: pre.nit ?? prev.nit,
                  nombre_contacto: pre.nombre_contacto ?? prev.nombre_contacto,
                  telefono_contacto: pre.telefono_contacto ?? prev.telefono_contacto,
                }
              : {}),
          }));
          setIsEmailVerified(true);
          setEmailDuplicateError('');
          setIsTrialInvite(trial);

          // Pago: bloquea todos los datos del checkout. Prueba: solo nombre/NIT/email de la invitación.
          if (trial) {
            setPaymentPrefilled(false);
            const locked = ['email'];
            if (pre?.nombre?.trim()) locked.push('nombre');
            if (pre?.nit?.trim()) locked.push('nit');
            setLockedFields(locked);
          } else if (pre) {
            setPaymentPrefilled(true);
            setLockedFields([
              'nombre',
              'direccion_principal',
              'nit',
              'nombre_contacto',
              'telefono_contacto',
              'email',
            ]);
          } else {
            setPaymentPrefilled(false);
            setLockedFields(['email']);
          }
          setAccessValidated(true);
          return;
        }

        const msg =
          data.reason === 'expired'
            ? 'El enlace de registro expiró. Realice el pago nuevamente o contacte a soporte.'
            : 'Enlace de registro no válido. Use el enlace del correo de confirmación de pago.';
        showToastMessage(msg, 'error');
        setAccessBlocked(true);
        setTimeout(() => {
          window.location.href = '/#pricing';
        }, 3500);
      } catch {
        if (!cancelled) {
          showToastMessage('No se pudo validar el acceso. Intente de nuevo.', 'error');
        }
      } finally {
        if (!cancelled) setCheckingAccess(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

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
        const emailReady = emailValid && (isEmailVerified || !!registroToken);
        const passwordValid = formData.password && validatePassword(formData.password).length === 0;
        const phoneValid = formData.telefono_contacto && isPhoneValid(formData.telefono_contacto);
        const passwordMatch = formData.password && formData.confirm_password && formData.password === formData.confirm_password;
        return !!(
          formData.nombre_contacto.trim() && 
          formData.telefono_contacto.trim() && 
          phoneValid && 
          emailValid && 
          emailReady &&
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

    if (lockedFields.includes(name)) {
      return;
    }
    
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
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (allowedTypes.includes(file.type)) {
      return true;
    }
    const lowerName = file.name.toLowerCase();
    return (
      lowerName.endsWith('.png') ||
      lowerName.endsWith('.jpg') ||
      lowerName.endsWith('.jpeg') ||
      lowerName.endsWith('.webp')
    );
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
        [kind]: 'Solo se permiten archivos PNG, JPEG o WebP'
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
    if (submitInFlightRef.current || isSubmitting) {
      return;
    }
    submitInFlightRef.current = true;
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

      if (!isTurnstileVerified(turnstileToken)) {
        showToastMessage('Debes completar la verificación de seguridad', 'error');
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

      const { error: authError } = await supabaseClient.auth.signUp({
        email: sanitizedFormData.email,
        password: sanitizedFormData.password,
        options: {
          emailRedirectTo: `${APP_URL}/login`,
        },
      });

      if (authError) {
        const alreadyRegistered =
          authError.message?.toLowerCase().includes('already registered') ||
          authError.message?.toLowerCase().includes('already been registered') ||
          (authError as { code?: string }).code === 'user_already_exists';

        if (alreadyRegistered) {
          showToastMessage(
            'Este correo ya está registrado. Confirme el correo anterior o use recuperar contraseña. No vuelva a enviar el formulario.',
            'error'
          );
        } else {
          showToastMessage(authError.message, 'error');
        }
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
          sedes: sanitizedSedes,
          ...(registroToken ? { registroToken } : {}),
          ...(turnstileToken ? { turnstileToken } : {}),
        }),
      });

      if (response.status === 403) {
        const errorData = await response.json();
        if (errorData?.code === 'REGISTRO_TOKEN_EXPIRED') {
          showToastMessage(
            'El enlace de registro expiró. Realice el pago nuevamente o contacte a soporte.',
            'error'
          );
          setTimeout(() => {
            window.location.href = '/#pricing';
          }, 2500);
          return;
        }
        if (errorData?.code === 'REGISTRO_TOKEN_INVALID') {
          showToastMessage(
            'Enlace de registro no válido. Use el enlace del correo de confirmación de pago.',
            'error'
          );
          return;
        }
        if (errorData?.code === 'PAYMENT_REQUIRED') {
          showToastMessage(
            'Debe completar el pago desde la página de inicio antes de registrar la institución. Será redirigido.',
            'error'
          );
          setTimeout(() => {
            window.location.href = '/#pricing';
          }, 2500);
          return;
        }
      }

      if (response.ok) {
        const result = await response.json();
        const institucionId = result?.data?.id;
        if (!institucionId) {
          showToastMessage('No se pudo obtener el ID de la institución para guardar el branding', 'error');
          return;
        }

        const brandingFormData = new FormData();
        if (logoFile) brandingFormData.append('logo', logoFile);
        if (bannerFile) brandingFormData.append('banner', bannerFile);
        brandingFormData.append('bootstrapEmail', sanitizedFormData.email);

        const brandingResponse = await fetch(`/api/instituciones/${institucionId}/branding`, {
          method: 'PUT',
          body: brandingFormData
        });

        if (!brandingResponse.ok) {
          let brandingError = 'La institución se creó, pero no se pudo guardar el logo y banner';
          try {
            const errData = await brandingResponse.json();
            if (typeof errData?.error === 'string' && errData.error.trim()) {
              brandingError = `La institución se creó, pero el branding falló: ${errData.error}`;
            }
          } catch {
            // ignore
          }
          showToastMessage(brandingError, 'error');
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
        setTurnstileToken(null);
        setCaptchaResetKey((k) => k + 1);
      }
    } catch (error) {
      setMessage('Error de seguridad detectado. Intente nuevamente.');
    } finally {
      submitInFlightRef.current = false;
      setIsSubmitting(false);
    }
  };

  const lockedInputClass =
    'bg-[var(--color-surface-nested)] cursor-not-allowed text-[var(--color-text-secondary)] border-[var(--color-border-light)]';

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            {paymentPrefilled && (
              <div className="rounded-xl p-4 bg-emerald-50 border border-emerald-200 text-sm text-emerald-900">
                Estos datos fueron confirmados al contratar el plan. Solo debe completar sedes,
                personalización y contraseña.
              </div>
            )}
            {isTrialInvite && (
              <div className="rounded-xl p-4 bg-emerald-50 border border-emerald-200 text-sm text-emerald-900">
                Invitación de prueba: el nombre, NIT y correo vienen de la invitación. Complete la
                dirección, contacto, sedes, personalización y contraseña.
              </div>
            )}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                Nombre de la Institución *
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                readOnly={lockedFields.includes('nombre')}
                value={formData.nombre}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus-visible:ring-[var(--color-primary-focus)] focus:border-[var(--color-primary)] transition-all duration-200 placeholder:text-[var(--color-text-tertiary)] ${
                  lockedFields.includes('nombre') ? lockedInputClass : 'bg-[var(--color-surface)]'
                } ${
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
              <label htmlFor="direccion_principal" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                Dirección Principal *
              </label>
              <input
                id="direccion_principal"
                name="direccion_principal"
                type="text"
                required
                readOnly={lockedFields.includes('direccion_principal')}
                value={formData.direccion_principal}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus-visible:ring-[var(--color-primary-focus)] focus:border-[var(--color-primary)] transition-all duration-200 placeholder:text-[var(--color-text-tertiary)] ${
                  lockedFields.includes('direccion_principal')
                    ? lockedInputClass
                    : 'bg-[var(--color-surface)]'
                } ${
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
              <label htmlFor="nit" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                NIT * (9 dígitos)
              </label>
              <p className="text-xs text-[var(--color-text-secondary)] mb-2">
                No incluya el dígito de verificación. Solo los 9 primeros dígitos.
              </p>
              <input
                id="nit"
                name="nit"
                type="text"
                required
                readOnly={lockedFields.includes('nit')}
                value={formData.nit}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus-visible:ring-[var(--color-primary-focus)] focus:border-[var(--color-primary)] transition-all duration-200 placeholder:text-[var(--color-text-tertiary)] ${
                  lockedFields.includes('nit') ? lockedInputClass : 'bg-[var(--color-surface)]'
                } ${
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
            <div className="rounded-xl p-4 bg-[var(--color-primary-light)] border-l-4 border-[var(--color-primary)] shadow-sm flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--color-primary)]" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-[var(--color-primary-text)] leading-relaxed pt-0.5">
                El correo electrónico y los datos de contacto que ingrese a continuación serán registrados como superadministrador de la institución.
              </p>
            </div>

            <div>
              <label htmlFor="nombre_contacto" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                Nombre de Contacto *
              </label>
              <input
                id="nombre_contacto"
                name="nombre_contacto"
                type="text"
                required
                readOnly={lockedFields.includes('nombre_contacto')}
                value={formData.nombre_contacto}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus-visible:ring-[var(--color-primary-focus)] focus:border-[var(--color-primary)] transition-all duration-200 placeholder:text-[var(--color-text-tertiary)] ${
                  lockedFields.includes('nombre_contacto')
                    ? lockedInputClass
                    : 'bg-[var(--color-surface)]'
                } ${
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
              <label htmlFor="telefono_contacto" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                Teléfono de Contacto *
              </label>
              <PhoneInputField
                id="telefono_contacto"
                value={formData.telefono_contacto}
                onChange={(v) => {
                  if (lockedFields.includes('telefono_contacto')) return;
                  setFormData((prev) => ({ ...prev, telefono_contacto: v }));
                }}
                disabled={lockedFields.includes('telefono_contacto')}
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
              {registroToken ? (
                <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                  {isTrialInvite
                    ? 'Correo verificado con su invitación de prueba. Defina la contraseña del superadministrador.'
                    : 'Correo verificado con su pago. Defina la contraseña del superadministrador.'}
                </p>
              ) : (
                <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                  Debe dar clic en el botón &quot;Verificar correo&quot; para comprobar que el correo no está en uso en la aplicación y así poder continuar con el campo de contraseña.
                </p>
              )}
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                Correo Electrónico *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                readOnly={!!registroToken}
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus-visible:ring-[var(--color-primary-focus)] focus:border-[var(--color-primary)] transition-all duration-200 placeholder:text-[var(--color-text-tertiary)] ${
                  registroToken ? lockedInputClass : 'bg-[var(--color-surface)]'
                } ${
                  (formData.email && !isValidEmail(formData.email)) || emailDuplicateError || securityErrors.email
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                placeholder="correo@ejemplo.com"
                maxLength={254}
              />
              {!registroToken && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={handleVerifyEmail}
                    disabled={!formData.email || !isValidEmail(formData.email) || isCheckingEmail || !!securityErrors.email}
                    className="text-sm font-semibold text-[var(--color-primary-text)] bg-[var(--color-primary-light)] border border-[var(--color-border-light)] rounded-lg px-3 py-2 hover:bg-[var(--color-primary-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isCheckingEmail ? 'Verificando...' : 'Verificar correo'}
                  </button>
                </div>
              )}
              {formData.email && !isValidEmail(formData.email) && (
                <p className="mt-1 text-xs text-red-600">Por favor ingrese un correo electrónico válido</p>
              )}
              {emailDuplicateError && (
                <p className="mt-1 text-xs text-red-600">{emailDuplicateError}</p>
              )}
              {isEmailVerified && !emailDuplicateError && (
                <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {registroToken
                    ? 'Correo verificado (confirmado con el pago)'
                    : 'Correo disponible'}
                </p>
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
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
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
                  className={`w-full px-4 py-2.5 pr-12 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-slate-900 focus:outline-none focus:ring-2 focus-visible:ring-[var(--color-primary-focus)] focus:border-[var(--color-primary)] transition-all duration-200 placeholder:text-[var(--color-text-tertiary)] ${
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
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
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
                  className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-[var(--color-primary-text)] bg-[var(--color-primary-light)] border border-[var(--color-border-light)] rounded-lg hover:bg-[var(--color-primary-light)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-primary-light)]"
                >
                  Generar contraseña automáticamente
                </button>
              </div>

              {/* Características de la contraseña: se marcan en verde al cumplirse */}
              <p className="mt-3 text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">La contraseña debe cumplir:</p>
              <ul className="space-y-1.5" aria-live="polite">
                {PASSWORD_REQUIREMENTS.map(({ id, label, check }) => {
                  const fulfilled = !!formData.password && check(formData.password);
                  return (
                    <li
                      key={id}
                      className={`text-xs flex items-center gap-2 transition-colors duration-200 ${
                        fulfilled ? 'text-green-600' : 'text-[var(--color-text-secondary)]'
                      }`}
                    >
                      {fulfilled ? (
                        <svg className="w-4 h-4 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="w-4 h-4 flex-shrink-0 rounded-full border-2 border-[var(--color-border)] inline-block" aria-hidden />
                      )}
                      <span className={fulfilled ? 'font-medium' : ''}>{label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
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
                className={`w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-slate-900 focus:outline-none focus:ring-2 focus-visible:ring-[var(--color-primary-focus)] focus:border-[var(--color-primary)] transition-all duration-200 placeholder:text-[var(--color-text-tertiary)] ${
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

            <div className="bg-[var(--color-surface-nested)] rounded-xl p-4 border border-[var(--color-border-light)] flex flex-wrap items-center justify-between gap-4">
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
                <span className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ${formData.tiene_sedes ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border-light)]'}`}>
                  <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-[var(--color-surface)] shadow ring-0 transition duration-200 translate-x-0.5 mt-0.5 ${formData.tiene_sedes ? 'translate-x-5' : ''}`} />
                </span>
                <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                  El instituto tiene más de una sede; active el interruptor para sí y complete los campos de las sedes del instituto.
                </span>
              </label>
            </div>

            {/* Jornadas - solo si no tiene sedes */}
            {!formData.tiene_sedes && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-800">Jornadas de la Institución</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center p-3 bg-[var(--color-surface-nested)] rounded-xl border border-[var(--color-border-light)] hover:bg-[var(--color-surface-nested)] transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={formData.jornadas.includes('única')}
                      onChange={(e) => handleJornadaChange('única', e.target.checked)}
                      disabled={formData.jornadas.some(j => j !== 'única')}
                      className="h-4 w-4 text-[var(--color-primary)] focus-visible:ring-[var(--color-primary-focus)] border-[var(--color-border)] rounded disabled:opacity-50"
                    />
                    <span className={`ml-3 text-sm text-[var(--color-text-secondary)] ${formData.jornadas.some(j => j !== 'única') ? 'line-through' : ''}`}>Jornada Única</span>
                  </label>

                  <label className="flex items-center p-3 bg-[var(--color-surface-nested)] rounded-xl border border-[var(--color-border-light)] hover:bg-[var(--color-surface-nested)] transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={formData.jornadas.includes('mañana')}
                      onChange={(e) => handleJornadaChange('mañana', e.target.checked)}
                      disabled={formData.jornadas.includes('única')}
                      className="h-4 w-4 text-[var(--color-primary)] focus-visible:ring-[var(--color-primary-focus)] border-[var(--color-border)] rounded disabled:opacity-50"
                    />
                    <span className={`ml-3 text-sm text-[var(--color-text-secondary)] ${formData.jornadas.includes('única') ? 'line-through' : ''}`}>Jornada Mañana</span>
                  </label>

                  <label className="flex items-center p-3 bg-[var(--color-surface-nested)] rounded-xl border border-[var(--color-border-light)] hover:bg-[var(--color-surface-nested)] transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={formData.jornadas.includes('tarde')}
                      onChange={(e) => handleJornadaChange('tarde', e.target.checked)}
                      disabled={formData.jornadas.includes('única')}
                      className="h-4 w-4 text-[var(--color-primary)] focus-visible:ring-[var(--color-primary-focus)] border-[var(--color-border)] rounded disabled:opacity-50"
                    />
                    <span className={`ml-3 text-sm text-[var(--color-text-secondary)] ${formData.jornadas.includes('única') ? 'line-through' : ''}`}>Jornada Tarde</span>
                  </label>

                  <label className="flex items-center p-3 bg-[var(--color-surface-nested)] rounded-xl border border-[var(--color-border-light)] hover:bg-[var(--color-surface-nested)] transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={formData.jornadas.includes('nocturna')}
                      onChange={(e) => handleJornadaChange('nocturna', e.target.checked)}
                      disabled={formData.jornadas.includes('única')}
                      className="h-4 w-4 text-[var(--color-primary)] focus-visible:ring-[var(--color-primary-focus)] border-[var(--color-border)] rounded disabled:opacity-50"
                    />
                    <span className={`ml-3 text-sm text-[var(--color-text-secondary)] ${formData.jornadas.includes('única') ? 'line-through' : ''}`}>Jornada Nocturna</span>
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
                    className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-lg text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus-visible:ring-[var(--color-primary-focus)] transition-colors"
                  >
                    + Agregar Sede
                  </button>
                </div>

                {sedes.map((sede, index) => (
                  <div key={sede.id} className="bg-[var(--color-surface-nested)] border border-[var(--color-border-light)] rounded-xl p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h5 className="text-sm font-medium text-[var(--color-text-secondary)]">Sede {index + 1}</h5>
                      <button
                        type="button"
                        onClick={() => removeSede(String(sede.id))}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                        Nombre de la Sede *
                      </label>
                      <input
                        type="text"
                        value={sede.nombre}
                        onChange={(e) => updateSede(String(sede.id), 'nombre', e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-slate-900 focus:outline-none focus:ring-2 focus-visible:ring-[var(--color-primary-focus)] focus:border-[var(--color-primary)] transition-all duration-200 placeholder:text-[var(--color-text-tertiary)]"
                        placeholder="Nombre de la sede"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                        Jornadas de la Sede *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <label className="flex items-center p-2 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border-light)] hover:bg-[var(--color-surface-nested)] transition-colors duration-200">
                          <input
                            type="checkbox"
                            checked={sede.jornadas.includes('única')}
                            onChange={(e) => handleSedeJornadaChange(String(sede.id), 'única', e.target.checked)}
                            disabled={sede.jornadas.some(j => j !== 'única')}
                            className="h-4 w-4 text-[var(--color-primary)] focus-visible:ring-[var(--color-primary-focus)] border-[var(--color-border)] rounded disabled:opacity-50"
                          />
                          <span className={`ml-2 text-sm text-[var(--color-text-secondary)] ${sede.jornadas.some(j => j !== 'única') ? 'line-through' : ''}`}>Jornada Única</span>
                        </label>
                        
                        <label className="flex items-center p-2 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border-light)] hover:bg-[var(--color-surface-nested)] transition-colors duration-200">
                          <input
                            type="checkbox"
                            checked={sede.jornadas.includes('mañana')}
                            onChange={(e) => handleSedeJornadaChange(String(sede.id), 'mañana', e.target.checked)}
                            disabled={sede.jornadas.includes('única')}
                            className="h-4 w-4 text-[var(--color-primary)] focus-visible:ring-[var(--color-primary-focus)] border-[var(--color-border)] rounded disabled:opacity-50"
                          />
                          <span className={`ml-2 text-sm text-[var(--color-text-secondary)] ${sede.jornadas.includes('única') ? 'line-through' : ''}`}>Jornada Mañana</span>
                        </label>
                        
                        <label className="flex items-center p-2 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border-light)] hover:bg-[var(--color-surface-nested)] transition-colors duration-200">
                          <input
                            type="checkbox"
                            checked={sede.jornadas.includes('tarde')}
                            onChange={(e) => handleSedeJornadaChange(String(sede.id), 'tarde', e.target.checked)}
                            disabled={sede.jornadas.includes('única')}
                            className="h-4 w-4 text-[var(--color-primary)] focus-visible:ring-[var(--color-primary-focus)] border-[var(--color-border)] rounded disabled:opacity-50"
                          />
                          <span className={`ml-2 text-sm text-[var(--color-text-secondary)] ${sede.jornadas.includes('única') ? 'line-through' : ''}`}>Jornada Tarde</span>
                        </label>
                        
                        <label className="flex items-center p-2 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border-light)] hover:bg-[var(--color-surface-nested)] transition-colors duration-200">
                          <input
                            type="checkbox"
                            checked={sede.jornadas.includes('nocturna')}
                            onChange={(e) => handleSedeJornadaChange(String(sede.id), 'nocturna', e.target.checked)}
                            disabled={sede.jornadas.includes('única')}
                            className="h-4 w-4 text-[var(--color-primary)] focus-visible:ring-[var(--color-primary-focus)] border-[var(--color-border)] rounded disabled:opacity-50"
                          />
                          <span className={`ml-2 text-sm text-[var(--color-text-secondary)] ${sede.jornadas.includes('única') ? 'line-through' : ''}`}>Jornada Nocturna</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                {sedes.length === 0 && (
                  <div className="text-center py-8 bg-[var(--color-surface-nested)] rounded-xl border-2 border-dashed border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-text-secondary)]">
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
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                Logo institucional *
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
                onChange={(e) => handleFileChange(e, 'logo')}
                className="w-full text-sm text-[var(--color-text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary-light)] file:text-[var(--color-primary-text)] hover:file:bg-[var(--color-primary-light)]"
              />
              <p className="mt-2 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Recomendado: <strong>512 × 512 px</strong> (cuadrado), PNG con fondo transparente
                o JPEG/WebP. Peso máximo: <strong>5 MB</strong>. Se muestra en el encabezado
                (aprox. 80 × 80 px).
              </p>
              {logoFile && (
                <div className="mt-3 flex items-center gap-3">
                  {logoPreviewUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoPreviewUrl}
                      alt="Vista previa del logo"
                      className="h-16 w-16 rounded-lg border border-[var(--color-border)] object-contain bg-white"
                    />
                  )}
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Archivo seleccionado: {logoFile.name}
                  </p>
                </div>
              )}
              {fileErrors.logo && (
                <p className="mt-2 text-xs text-red-600">{fileErrors.logo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                Banner institucional *
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
                onChange={(e) => handleFileChange(e, 'banner')}
                className="w-full text-sm text-[var(--color-text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary-light)] file:text-[var(--color-primary-text)] hover:file:bg-[var(--color-primary-light)]"
              />
              <p className="mt-2 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Recomendado: <strong>1600 × 400 px</strong> (proporción 4:1), PNG, JPEG o WebP.
                Peso máximo: <strong>5 MB</strong>. Se muestra debajo del encabezado a lo ancho.
              </p>
              {bannerFile && (
                <div className="mt-3 space-y-2">
                  {bannerPreviewUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={bannerPreviewUrl}
                      alt="Vista previa del banner"
                      className="w-full max-h-28 rounded-lg border border-[var(--color-border)] object-cover bg-white"
                    />
                  )}
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Archivo seleccionado: {bannerFile.name}
                  </p>
                </div>
              )}
              {fileErrors.banner && (
                <p className="mt-2 text-xs text-red-600">{fileErrors.banner}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">
                Colores de la institución
              </h3>
              <button
                type="button"
                onClick={() => setShowColorsInfo(true)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 transition-colors hover:bg-indigo-200 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                aria-label="Información sobre los colores institucionales"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Color primario *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="color_primario"
                    value={formData.color_primario}
                    onChange={handleInputChange}
                    className="h-10 w-14 rounded border border-[var(--color-border)] bg-[var(--color-surface)]"
                  />
                  <input
                    type="text"
                    name="color_primario"
                    value={formData.color_primario}
                    onChange={handleInputChange}
                    maxLength={7}
                    className="flex-1 px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-slate-900 focus:outline-none focus:ring-2 focus-visible:ring-[var(--color-primary-focus)] focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Color secundario *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="color_secundario"
                    value={formData.color_secundario}
                    onChange={handleInputChange}
                    className="h-10 w-14 rounded border border-[var(--color-border)] bg-[var(--color-surface)]"
                  />
                  <input
                    type="text"
                    name="color_secundario"
                    value={formData.color_secundario}
                    onChange={handleInputChange}
                    maxLength={7}
                    className="flex-1 px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-slate-900 focus:outline-none focus:ring-2 focus-visible:ring-[var(--color-primary-focus)] focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowBrandingPreview(true)}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Ver vista previa de branding
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <Header />
      <main className="flex-1">
        {(checkingAccess || accessBlocked) && (
          <div className="max-w-md mx-auto px-4 py-24 text-center">
            <p className="text-[var(--color-text-secondary)]">
              {checkingAccess ? 'Validando acceso seguro...' : 'Redirigiendo...'}
            </p>
          </div>
        )}
        {!checkingAccess && !accessBlocked && (
        <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-primary)] rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Registrar Institución
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-3">
            Complete los datos paso a paso
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Vertical Progress Bar */}
          <div className="w-full lg:w-72 bg-[var(--color-surface)]/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">Progreso</h3>
              <div className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-surface-nested)] rounded-full px-3 py-1 inline-block">
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
                        ? 'bg-[var(--color-primary)] text-white shadow-lg ring-4 ring-[var(--color-primary-light)]'
                        : 'bg-[var(--color-surface-nested)] text-[var(--color-text-tertiary)] border-2 border-[var(--color-border-light)]'
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
                        currentStep > step.id ? 'bg-emerald-500' : 'bg-[var(--color-border-light)]'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 pt-2 min-w-0">
                    <div className={`text-sm font-medium transition-colors duration-200 ${
                      currentStep >= step.id ? 'text-slate-800' : 'text-[var(--color-text-secondary)]'
                    }`}>
                      <span className="break-words">{step.name}</span>
                    </div>
                    <div className={`text-xs mt-1 transition-colors duration-200 ${
                      currentStep >= step.id ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-text-tertiary)]'
                    }`}>
                      <span className="break-words">{step.description}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">Progreso General</div>
              <div className="w-full bg-[var(--color-border-light)] rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-700 ease-out motion-safe:transition-all"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-2 text-center">
                {Math.round((currentStep / steps.length) * 100)}% completado
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              {/* Step Content */}
              <div className="bg-[var(--color-surface)]/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                <div className="px-6 py-4 bg-[var(--color-primary-light)] border-b border-[var(--color-border-light)]">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {steps[currentStep - 1].name}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    {steps[currentStep - 1].description}
                  </p>
                </div>
                
                <div className="px-6 py-6">
                  {renderStepContent()}
                  {currentStep === 4 && (
                    <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-nested)] p-4 space-y-3">
                      <p className="text-sm font-medium text-slate-800">Verificación de seguridad</p>
                      <TurnstileField
                        resetKey={captchaResetKey}
                        onChange={setTurnstileToken}
                        className="w-full"
                      />
                      {!isTurnstileVerified(turnstileToken) && (
                        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                          Marca la casilla &quot;No soy un robot&quot; para continuar.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface)]/80 backdrop-blur-sm border border-[var(--color-border-light)] rounded-xl shadow-sm hover:bg-[var(--color-surface)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus-visible:ring-[var(--color-primary-focus)] transition-all duration-200"
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
                      className="w-full sm:w-auto min-h-11 px-6 py-2 text-sm font-medium text-white bg-[var(--color-primary)] border border-transparent rounded-xl shadow-lg hover:bg-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary-focus)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Siguiente →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={
                        !validateStep(currentStep) ||
                        isSubmitting ||
                        !isTurnstileVerified(turnstileToken)
                      }
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
        <Modal
          open={showColorsInfo}
          onClose={() => setShowColorsInfo(false)}
          title="Colores de la institución"
          size="md"
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
              <p className="text-sm leading-relaxed text-indigo-950">
                Seleccione los colores <strong>primario</strong> y <strong>secundario</strong> que
                identifican a su institución. Se aplicarán en el encabezado, banner, botones y
                acentos de la plataforma.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  1
                </span>
                <span>
                  Haga clic en el <strong>cuadro de color</strong> para abrir el selector y elegir
                  el tono deseado.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  2
                </span>
                <span>
                  O escriba el código hexadecimal en el campo de texto (por ejemplo:{' '}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800">
                    #2563eb
                  </code>
                  ).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  3
                </span>
                <span>
                  Use <strong>Ver vista previa de branding</strong> para ver logo, banner y cómo
                  se diferencian el color primario y el secundario en la plataforma.
                </span>
              </li>
            </ul>
            <div className="flex justify-end pt-1">
              <Button type="button" variant="primary" onClick={() => setShowColorsInfo(false)}>
                Entendido
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          open={showBrandingPreview}
          onClose={() => setShowBrandingPreview(false)}
          title="Vista previa de branding"
          size="xl"
        >
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Así se verán el logo, el banner y los colores en el panel de la institución.
            </p>

            <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-white shadow-sm">
              <div
                className="flex items-center gap-2 px-3 py-2 border-b border-black/10"
                style={{ backgroundColor: formData.color_secundario || '#0f172a' }}
              >
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-white/40 bg-white/95 flex items-center justify-center">
                  {logoPreviewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoPreviewUrl} alt="" className="h-full w-full object-contain" />
                  ) : (
                    <span className="text-[9px] font-semibold text-slate-500">Logo</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold text-white">
                    {formData.nombre.trim() || 'Nombre de la institución'}
                  </div>
                  <div className="mt-1 h-1.5 w-16 rounded bg-white/50" />
                </div>
                <span className="shrink-0 rounded bg-black/25 px-1.5 py-0.5 text-[9px] font-medium text-white">
                  Secundario
                </span>
              </div>

              <div
                className="relative flex h-20 items-center justify-center overflow-hidden"
                style={{ backgroundColor: formData.color_primario || '#2563eb' }}
              >
                {bannerPreviewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={bannerPreviewUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-x-6 inset-y-3 rounded border border-dashed border-white/50 bg-white/15" />
                )}
                <span className="relative z-[1] rounded bg-black/35 px-1.5 py-0.5 text-[9px] font-medium text-white">
                  Primario · área del banner
                </span>
              </div>

              <div className="space-y-3 bg-slate-50 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div
                    className="rounded-md px-3 py-1.5 text-[10px] font-semibold text-white shadow-sm"
                    style={{ backgroundColor: formData.color_primario || '#2563eb' }}
                  >
                    Botón principal
                  </div>
                  <div
                    className="rounded-md border px-3 py-1.5 text-[10px] font-semibold"
                    style={{
                      borderColor: formData.color_primario || '#2563eb',
                      color: formData.color_primario || '#2563eb',
                    }}
                  >
                    Enlace / acento
                  </div>
                  <span className="text-[9px] text-slate-500">← Color primario</span>
                </div>
                <div className="space-y-1.5 rounded-md border border-slate-200 bg-white p-2">
                  <div className="h-2 w-3/4 max-w-[12rem] rounded bg-slate-200" />
                  <div className="h-2 w-1/2 max-w-[8rem] rounded bg-slate-100" />
                  <div
                    className="mt-2 h-1 w-full rounded"
                    style={{
                      backgroundColor: formData.color_secundario || '#0f172a',
                      opacity: 0.35,
                    }}
                  />
                  <p className="text-[9px] text-slate-500 pt-0.5">
                    El secundario colorea el encabezado; el primario, banner, botones y acentos.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-[11px] text-[var(--color-text-secondary)]">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-3 w-3 rounded-sm border border-black/10"
                  style={{ backgroundColor: formData.color_primario || '#2563eb' }}
                />
                Primario: banner, botones, enlaces y acentos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-3 w-3 rounded-sm border border-black/10"
                  style={{ backgroundColor: formData.color_secundario || '#0f172a' }}
                />
                Secundario: encabezado y tonos de fondo
              </span>
            </div>

            <div className="flex justify-end">
              <Button type="button" variant="primary" onClick={() => setShowBrandingPreview(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          open={showSuccessModal}
          onClose={closeSuccessModalAndRedirect}
          title="Registro exitoso"
          size="md"
          closeOnOverlayClick={false}
        >
          <p className="text-sm text-[var(--color-text-secondary)]">{successModalMessage}</p>
          <div className="mt-4 p-3 bg-[var(--color-primary-light)] rounded-lg border border-[var(--color-border-light)]">
            <p className="text-xs text-[var(--color-primary-text)]">
              Revise su bandeja de entrada y carpeta de spam para confirmar su cuenta antes de iniciar sesión.
            </p>
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="button" variant="success" onClick={closeSuccessModalAndRedirect}>
              Ir a iniciar sesión
            </Button>
          </div>
        </Modal>

        {/* Toast Notification (solo errores) */}
        {showToast && (
          <div className="fixed top-4 right-4 z-50 max-w-md w-full">
            <div className="w-full bg-[var(--color-surface)] shadow-2xl rounded-2xl pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border border-red-200 bg-red-50">
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
        )}
      </main>
      <Footer />
    </div>
  );
}
