'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface AddCursoModalProps {
  isOpen: boolean;
  onClose: () => void;
  institucionId: number;
  onSuccess: () => void;
}

// Grados predeterminados del sistema (mismos que en SetupWizard)
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

export default function AddCursoModal({ isOpen, onClose, institucionId, onSuccess }: AddCursoModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    grado_id: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Resetear formulario cuando se abre
      setFormData({ nombre: '', grado_id: 0 });
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/setup/grados-cursos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          institucionId,
          gradosCursos: [{
            grado_id: formData.grado_id,
            cursos: [{
              nombre: formData.nombre
            }]
          }]
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Mostrar SweetAlert de éxito
        await Swal.fire({
          icon: 'success',
          title: '¡Curso Creado!',
          text: `El curso "${formData.nombre}" se ha creado exitosamente`,
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#f97316', // Color naranja
          timer: 3000,
          timerProgressBar: true
        });
        
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al crear el curso');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Agregar Curso</h2>
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Grado *
                </label>
                <select
                  value={formData.grado_id}
                  onChange={(e) => setFormData({ ...formData, grado_id: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 placeholder:text-slate-400"
                  required
                >
                  <option value={0} className="text-slate-900">Seleccionar grado</option>
                  {gradosPredeterminados.map((grado) => (
                    <option key={grado.id} value={grado.id} className="text-slate-900">
                      {grado.nombre} - {grado.nivel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre del Curso *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 bg-white placeholder-slate-500"
                  placeholder="Ej: Curso A, Curso B"
                  required
                />
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
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-orange-400 transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  'Crear Curso'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
