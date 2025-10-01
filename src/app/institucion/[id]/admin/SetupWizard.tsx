'use client';

import { useState } from 'react';

interface SetupWizardProps {
  institucionId: number;
  onClose: () => void;
}

type WizardStep = 1 | 2 | 3 | 4 | 5;

interface Curso {
  id: string;
  nombre: string;
  gradoId: number;
}

export default function SetupWizard({ institucionId, onClose }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [saving, setSaving] = useState(false);

  // Grados predeterminados
  const gradosPredeterminados = [
    { id: 1, nombre: 'PÁRVULOS', nivel: 'Educación Inicial', orden: 1 },
    { id: 2, nombre: 'PREKINDER', nivel: 'Educación Inicial', orden: 2 },
    { id: 3, nombre: 'KINDER', nivel: 'Educación Inicial', orden: 3 },
    { id: 4, nombre: '1°', nivel: 'Primaria', orden: 4 },
    { id: 5, nombre: '2°', nivel: 'Primaria', orden: 5 },
    { id: 6, nombre: '3°', nivel: 'Primaria', orden: 6 },
    { id: 7, nombre: '4°', nivel: 'Primaria', orden: 7 },
    { id: 8, nombre: '5°', nivel: 'Primaria', orden: 8 },
    { id: 9, nombre: '6°', nivel: 'Secundaria', orden: 9 },
    { id: 10, nombre: '7°', nivel: 'Secundaria', orden: 10 },
    { id: 11, nombre: '8°', nivel: 'Secundaria', orden: 11 },
    { id: 12, nombre: '9°', nivel: 'Secundaria', orden: 12 },
    { id: 13, nombre: '10°', nivel: 'Media', orden: 13 },
    { id: 14, nombre: '11°', nivel: 'Media', orden: 14 },
  ];

  // Agrupar grados por nivel
  const gradosPorNivel = gradosPredeterminados.reduce((acc, grado) => {
    if (!acc[grado.nivel]) {
      acc[grado.nivel] = [];
    }
    acc[grado.nivel].push(grado);
    return acc;
  }, {} as Record<string, typeof gradosPredeterminados>);

  const agregarCurso = (gradoId: number) => {
    const cursosDelGrado = cursos.filter(c => c.gradoId === gradoId);
    const siguienteLetra = String.fromCharCode(65 + cursosDelGrado.length); // A, B, C...
    
    const nuevoCurso: Curso = {
      id: `temp-${Date.now()}`,
      nombre: `Curso ${siguienteLetra}`,
      gradoId,
    };

    setCursos([...cursos, nuevoCurso]);
  };

  const eliminarCurso = (cursoId: string) => {
    setCursos(cursos.filter(c => c.id !== cursoId));
  };

  const editarNombreCurso = (cursoId: string, nuevoNombre: string) => {
    setCursos(cursos.map(c => c.id === cursoId ? { ...c, nombre: nuevoNombre } : c));
  };

  const handleSaveGradosYCursos = async () => {
    setSaving(true);
    try {
      // Solo obtener los grados que tienen cursos
      const gradosConCursos = gradosPredeterminados.filter(grado => 
        cursos.some(curso => curso.gradoId === grado.id)
      );
      
      console.log('=== DATOS QUE SE ENVÍAN ===');
      console.log('Grados con cursos:', gradosConCursos.length);
      console.log('Cursos totales:', cursos.length);
      
      const datosAEnviar = {
        institucionId,
        grados: gradosConCursos,
        cursos
      };
      
      console.log('institucionId:', institucionId);
      console.log('grados (solo con cursos):', gradosConCursos);
      console.log('cursos:', cursos);
      console.log('JSON completo:', JSON.stringify(datosAEnviar, null, 2));

      const response = await fetch('/api/setup/grados-cursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosAEnviar)
      });
      
      const responseData = await response.json();
      console.log('Respuesta del servidor:', responseData);
      
      if (response.ok) {
        alert('✅ Grados y cursos guardados correctamente!');
        console.log('Datos guardados:', responseData);
      } else {
        console.error('Error del servidor:', responseData);
        alert(`❌ Error al guardar: ${responseData.details || responseData.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('❌ Error de conexión: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as WizardStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as WizardStep);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Configuración Inicial</h2>
              <p className="text-blue-100 text-sm mt-1">
                Paso {currentStep} de 5
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex justify-between">
            {[
              { num: 1, label: 'Grados y Cursos' },
              { num: 2, label: 'Áreas y Materias' },
              { num: 3, label: 'Docentes' },
              { num: 4, label: 'Estudiantes' },
              { num: 5, label: 'Resumen' },
            ].map((step) => (
              <div
                key={step.num}
                className={`flex items-center ${step.num < 5 ? 'flex-1' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      currentStep >= step.num
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {step.num}
                  </div>
                  <span
                    className={`text-xs mt-1 font-medium ${
                      currentStep >= step.num ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {step.num < 5 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 mt-[-20px] ${
                      currentStep > step.num ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 1 && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Paso 1: Grados y Cursos
                </h3>
                <p className="text-slate-600">
                  Los grados están predefinidos según el sistema educativo. Agrega los cursos que necesites para cada grado.
                </p>
              </div>

              <div className="space-y-6">
                {Object.entries(gradosPorNivel).map(([nivel, grados]) => (
                  <div key={nivel} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h4 className="font-semibold text-lg text-slate-900 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                      {nivel}
                    </h4>
                    
                    <div className="space-y-4">
                      {grados.map((grado) => {
                        const cursosDelGrado = cursos.filter(c => c.gradoId === grado.id);
                        
                        return (
                          <div key={grado.id} className="bg-white rounded-lg p-4 border border-slate-200">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center">
                                <span className="font-semibold text-slate-900 text-lg">
                                  {grado.nombre}
                                </span>
                                <span className="ml-3 text-sm text-slate-500">
                                  ({cursosDelGrado.length} curso{cursosDelGrado.length !== 1 ? 's' : ''})
                                </span>
                              </div>
                              <button
                                onClick={() => agregarCurso(grado.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Agregar Curso
                              </button>
                            </div>

                            {cursosDelGrado.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {cursosDelGrado.map((curso) => (
                                  <div
                                    key={curso.id}
                                    className="flex items-center space-x-2 bg-slate-50 rounded-lg p-2 border border-slate-200"
                                  >
                                    <input
                                      type="text"
                                      value={curso.nombre}
                                      onChange={(e) => editarNombreCurso(curso.id, e.target.value)}
                                      className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium text-slate-900"
                                    />
                                    <button
                                      onClick={() => eliminarCurso(curso.id)}
                                      className="text-red-600 hover:bg-red-50 rounded p-1 transition-colors"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón de guardar */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-blue-900">Guardar configuración</h4>
                    <p className="text-sm text-blue-700">
                      Guarda los grados predeterminados y los cursos creados en la base de datos
                    </p>
                  </div>
                  <button
                    onClick={handleSaveGradosYCursos}
                    disabled={saving || cursos.length === 0}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Guardar Grados y Cursos
                      </>
                    )}
                  </button>
                </div>
                {cursos.length === 0 && (
                  <p className="text-sm text-blue-600 mt-2">
                    💡 Agrega al menos un curso para poder guardar
                  </p>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Paso 2: Áreas y Materias
              </h3>
              <p className="text-slate-600">
                En construcción...
              </p>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Paso 3: Docentes
              </h3>
              <p className="text-slate-600">
                En construcción...
              </p>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Paso 4: Estudiantes
              </h3>
              <p className="text-slate-600">
                En construcción...
              </p>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Paso 5: Resumen y Confirmación
              </h3>
              <p className="text-slate-600">
                En construcción...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Anterior
            </button>

            <div className="text-sm text-slate-600">
              Paso {currentStep} de 5
            </div>

            <button
              onClick={handleNext}
              disabled={currentStep === 5}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 5
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {currentStep === 5 ? 'Finalizar' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
