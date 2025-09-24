'use client';

import { useState } from 'react';

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
    tiene_sedes: false,
    jornadas: [] as string[]
  });

  const [sedes, setSedes] = useState<Sede[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

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
        return !!(formData.nombre && formData.direccion_principal && formData.nit);
      case 2:
        return !!(formData.nombre_contacto && formData.telefono_contacto);
      case 3:
        if (formData.tiene_sedes) {
          return sedes.length > 0 && sedes.every(sede => sede.nombre && sede.jornadas.length > 0);
        } else {
          return formData.jornadas.length > 0;
        }
      default:
        return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
      const response = await fetch('/api/instituciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          sedes: sedes
        }),
      });

      if (response.ok) {
        showToastMessage('¡Institución registrada exitosamente!', 'success');
        setFormData({
          nombre: '',
          direccion_principal: '',
          nit: '',
          nombre_contacto: '',
          telefono_contacto: '',
          tiene_sedes: false,
          jornadas: []
        });
        setSedes([]);
        setCurrentStep(1);
      } else {
        const errorData = await response.json();
        showToastMessage(errorData.error || 'Error al registrar la institución', 'error');
      }
    } catch (error) {
      setMessage('Error al conectar con el servidor');
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
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white/50 backdrop-blur-sm transition-all duration-200"
                placeholder="Ingrese el nombre de la institución"
              />
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
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white/50 backdrop-blur-sm transition-all duration-200"
                placeholder="Ingrese la dirección principal"
              />
            </div>

            <div>
              <label htmlFor="nit" className="block text-sm font-medium text-slate-700 mb-2">
                NIT *
              </label>
              <input
                id="nit"
                name="nit"
                type="text"
                required
                value={formData.nit}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white/50 backdrop-blur-sm transition-all duration-200"
                placeholder="Ingrese el NIT"
              />
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
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white/50 backdrop-blur-sm transition-all duration-200"
                placeholder="Ingrese el nombre del contacto"
              />
            </div>

            <div>
              <label htmlFor="telefono_contacto" className="block text-sm font-medium text-slate-700 mb-2">
                Teléfono de Contacto *
              </label>
              <input
                id="telefono_contacto"
                name="telefono_contacto"
                type="tel"
                required
                value={formData.telefono_contacto}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white/50 backdrop-blur-sm transition-all duration-200"
                placeholder="Ingrese el teléfono de contacto"
              />
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
          <p className="text-slate-600">
            Complete los datos paso a paso
          </p>
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
          <div className="fixed top-4 right-4 z-50">
            <div className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${
              toastType === 'success' ? 'border-l-4 border-green-400' : 'border-l-4 border-red-400'
            }`}>
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {toastType === 'success' ? (
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className={`text-sm font-medium ${
                      toastType === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {toastMessage}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setShowToast(false)}
                    >
                      <span className="sr-only">Cerrar</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
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
