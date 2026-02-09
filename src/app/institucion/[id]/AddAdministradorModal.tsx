'use client';

import { useState, useEffect, useRef } from 'react';

interface Sede {
  id: number;
  nombre: string;
  jornadas: string[];
}

interface Institucion {
  id: number;
  nombre: string;
  sedes: Sede[];
}

interface AddAdministradorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  institucionId: number;
}

export default function AddAdministradorModal({
  isOpen,
  onClose,
  onSuccess,
  institucionId
}: AddAdministradorModalProps) {
  const [institucion, setInstitucion] = useState<Institucion | null>(null);
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
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
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
  const [generatedPassword, setGeneratedPassword] = useState('');

  // Cargar información de la institución
  useEffect(() => {
    if (isOpen && institucionId) {
      fetch(`/api/instituciones/${institucionId}`)
        .then(res => res.json())
        .then(data => {
          setInstitucion(data);
          // Configurar automáticamente "Sede Principal" cuando no hay sedes
          if (data.sedes && data.sedes.length === 0) {
            setFormData(prev => ({ ...prev, sede_id: 'principal' }));
          }
        })
        .catch(err => console.error('Error al cargar institución:', err));
    }
  }, [isOpen, institucionId]);

  // Cleanup del timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (emailTimeoutRef.current) {
        clearTimeout(emailTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Filtrar solo números para campos de teléfono
    let processedValue = value;
    if (name === 'telefono') {
      processedValue = value.replace(/[^0-9]/g, '');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Validación básica para el correo (sin verificación automática)
    if (name === 'correo') {
      if (value.trim() && !validateEmail(value)) {
        setEmailError('Formato de correo inválido');
        setEmailAvailable(null);
        setCanProceedToPassword(false);
      } else {
        setEmailError('');
        setEmailAvailable(null);
        setCanProceedToPassword(false);
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
      const isValid = validatePassword(value);
      setPasswordValid(isValid);
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

      const data = await response.json();
      if (response.ok && data.success) {
        const available = !data.exists;
        setEmailAvailable(available);
        setCanProceedToPassword(available);
        if (!available) {
          setEmailError('Este correo ya está registrado');
        }
      } else {
        setEmailAvailable(false);
        setCanProceedToPassword(false);
        setEmailError(data.error || 'Error al verificar el correo');
      }
    } catch (error) {
      console.error('Error verificando disponibilidad del correo:', error);
      setEmailAvailable(false);
      setCanProceedToPassword(false);
      setEmailError('Error de conexión');
    } finally {
      setEmailValidating(false);
    }
  };

  const handleVerifyEmail = () => {
    if (!formData.correo.trim()) {
      setEmailError('El correo es requerido');
      setEmailAvailable(null);
      setCanProceedToPassword(false);
      return;
    }
    if (!validateEmail(formData.correo)) {
      setEmailError('Formato de correo inválido');
      setEmailAvailable(null);
      setCanProceedToPassword(false);
      return;
    }
    checkEmailAvailability(formData.correo);
  };

  const getPasswordRequirements = (password: string) => ({
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[@$!%*?&]/.test(password)
  });

  const validatePassword = (password: string) => {
    const reqs = getPasswordRequirements(password);
    return Object.values(reqs).every(Boolean);
  };

  const generateStrongPassword = () => {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghijkmnpqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '!@#$%^&*()_+-=[]{};:,.?';
    const all = upper + lower + numbers + symbols;
    const length = 12;

    const pick = (pool: string) => pool[Math.floor(Math.random() * pool.length)];
    let password = [pick(upper), pick(lower), pick(numbers), pick(symbols)];
    for (let i = password.length; i < length; i += 1) {
      password.push(pick(all));
    }
    password = password.sort(() => Math.random() - 0.5);

    const generated = password.join('');
    setFormData(prev => ({ ...prev, password: generated }));
    setGeneratedPassword(generated);
    setPasswordValid(true);
  };

  const validateNombre = (nombre: string) => {
    return nombre.trim().length >= 2;
  };

  const validateApellido = (apellido: string) => {
    return apellido.trim().length >= 2;
  };

  const validateTelefono = (telefono: string) => {
    const digitsOnly = telefono.replace(/\D/g, '');
    return digitsOnly.length >= 10;
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
      const response = await fetch(`/api/instituciones/${institucionId}/administradores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        resetForm();
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al crear administrador');
      }
    } catch (err) {
      console.error('Error al crear administrador:', err);
      setError('Error al crear administrador');
    } finally {
      setSubmitting(false);
    }
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
    setShowPassword(false);
    setError('');
    
    // Limpiar timeout del debounce
    if (emailTimeoutRef.current) {
      clearTimeout(emailTimeoutRef.current);
      emailTimeoutRef.current = null;
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between relative">
          <div className="flex items-center pr-12">
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
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Nombre *
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
                className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                  nombreValid
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Ingrese Nombre del administrador"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Apellido *
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
                className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                  !nombreValid
                    ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                    : apellidoValid
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Ingrese el apellido del administrador"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Cargo del administrador *
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
                disabled={!apellidoValid}
                className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                  !apellidoValid
                    ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                    : cargoValid
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Ingrese el cargo del administrador"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Teléfono celular * (mínimo 10 dígitos)
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
                disabled={!cargoValid}
                maxLength={12}
                className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                  !cargoValid
                    ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                    : telefonoValid
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Ingrese el teléfono (solo números)"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Sede *</label>
              <select
                name="sede_id"
                value={formData.sede_id}
                onChange={handleInputChange}
                required
                disabled={!telefonoValid}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">Seleccione una sede</option>
                {institucion?.sedes && institucion.sedes.length > 0 ? (
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
              {institucion?.sedes && institucion.sedes.length === 0 && (
                <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                  ℹ️ Esta institución no tiene sedes configuradas. El administrador se asignará a la sede principal.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700">
                  Correo electrónico *
                </label>
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={!telefonoValid || !formData.sede_id || !formData.correo.trim() || emailValidating || !!emailError}
                  className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-2 py-1 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {emailValidating ? 'Verificando...' : 'Verificar correo'}
                </button>
              </div>
              <div className="relative">
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  required
                  disabled={!telefonoValid || !formData.sede_id}
                  className={`w-full px-4 py-2.5 pr-12 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                    !telefonoValid || !formData.sede_id
                      ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                      : emailError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : emailAvailable === true
                      ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  placeholder="Ingrese el correo electrónico del administrador"
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
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Contraseña *
              {passwordValid && (
                <span className="text-green-600 text-xs ml-2">✓</span>
              )}
              <button
                type="button"
                onClick={generateStrongPassword}
                disabled={!cargoValid}
                className="ml-4 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-2 py-1 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generar contraseña
              </button>
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={!cargoValid}
                className={`w-full px-4 py-2.5 pr-12 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                  !cargoValid
                    ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                    : passwordValid
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Mínimo 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos"
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
            {!cargoValid ? (
              <p className="text-xs text-slate-400">
                Completa el cargo para continuar
              </p>
            ) : (
              <div className="text-xs text-slate-500 space-y-1">
                {(() => {
                  const reqs = getPasswordRequirements(formData.password);
                  const item = (ok: boolean, label: string) => (
                    <p className={ok ? 'text-green-600' : 'text-slate-500'}>
                      {ok ? '✓' : '•'} {label}
                    </p>
                  );
                  return (
                    <>
                      {item(reqs.length, 'Al menos 8 caracteres')}
                      {item(reqs.upper, 'Una letra mayúscula')}
                      {item(reqs.lower, 'Una letra minúscula')}
                      {item(reqs.number, 'Un número')}
                      {item(reqs.symbol, 'Un símbolo')}
                    </>
                  );
                })()}
              </div>
            )}
            {generatedPassword && (
              <p className="text-xs text-slate-500">
                Contraseña generada: <span className="font-semibold">{generatedPassword}</span>
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
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
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
              onClick={handleClose}
              className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-200 border-2 border-slate-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

