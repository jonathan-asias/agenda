'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const router = useRouter();

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

  // Función para limpiar y validar entrada
  const handleSecureInputChange = (value: string, fieldName: string, setter: (value: string) => void) => {
    const sanitized = sanitizeInput(value);
    const error = validateSecureInput(value, fieldName);
    
    setter(sanitized);
    
    if (error) {
      setValidationErrors(prev => ({ ...prev, [fieldName]: error }));
    } else {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors({});

    try {
      // 1. Validar campos vacíos
      if (!email.trim() || !password.trim()) {
        setError('Todos los campos son requeridos');
        return;
      }

      // 2. Validar email seguro
      const emailError = validateSecureEmail(email);
      if (emailError) {
        setValidationErrors(prev => ({ ...prev, email: emailError }));
        setError(emailError);
        return;
      }

      // 3. Validar contraseña segura
      const passwordError = validateSecurePassword(password);
      if (passwordError) {
        setValidationErrors(prev => ({ ...prev, password: passwordError }));
        setError(passwordError);
        return;
      }

      // 4. Sanitizar entrada
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedPassword = sanitizeInput(password);

      // 5. Validar entrada segura
      const emailValidationError = validateSecureInput(sanitizedEmail, 'email');
      const passwordValidationError = validateSecureInput(sanitizedPassword, 'password');

      if (emailValidationError || passwordValidationError) {
        const newErrors: {[key: string]: string} = {};
        if (emailValidationError) newErrors.email = emailValidationError;
        if (passwordValidationError) newErrors.password = passwordValidationError;
        setValidationErrors(newErrors);
        setError('Entrada no válida detectada');
        return;
      }

      // 6. Intentar login con Supabase
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: sanitizedPassword,
      });

      if (supabaseError) {
        setError('Credenciales inválidas');
        return;
      }

      if (data.user) {
        // El contexto unificado se encargará de determinar el tipo de usuario
        // y redirigir apropiadamente
        router.push('/');
      }
    } catch (err) {
      console.error('Error en login de institución:', err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-slate-600 mb-3">
            Accede a tu cuenta de institución
          </p>

          {/* Security Indicator */}
          <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Conexión Segura
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => handleSecureInputChange(e.target.value, 'email', setEmail)}
                className={`w-full px-4 py-3 text-sm border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                  validationErrors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'
                }`}
                placeholder="correo@ejemplo.com"
                maxLength={254}
              />
              {validationErrors.email && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <svg className="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => handleSecureInputChange(e.target.value, 'password', setPassword)}
                  className={`w-full px-4 py-3 pr-12 text-sm border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                    validationErrors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-200'
                  }`}
                  placeholder="Ingrese su contraseña"
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
              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <svg className="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-slate-600">
              ¿No tienes una cuenta?{' '}
              <Link
                href="/registro-institucion"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
            <p className="text-sm text-slate-600">
              ¿Olvidaste tu contraseña?{' '}
              <Link
                href="/recuperar-contrasena"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Recupérala aquí
              </Link>
            </p>
            
            {/* Información sobre confirmación de correo */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-xs text-blue-800 font-medium">
                    ¿Primera vez?
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Si acabas de registrarte, revisa tu correo para confirmar tu cuenta antes de iniciar sesión.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}