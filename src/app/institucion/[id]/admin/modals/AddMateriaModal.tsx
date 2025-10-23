'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface AddMateriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  institucionId: number;
  onSuccess: () => void;
}

// Áreas predeterminadas del sistema (mismas que en SetupWizard)
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
  { id: 13, nombre: 'Comportamiento y disciplina', es_opcional: true, orden: 13 },
];

export default function AddMateriaModal({ isOpen, onClose, institucionId, onSuccess }: AddMateriaModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    area_id: '0'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Resetear formulario cuando se abre
      setFormData({ nombre: '', area_id: '0' });
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/setup/materias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          institucionId,
          materias: [formData]
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Mostrar SweetAlert de éxito
        await Swal.fire({
          icon: 'success',
          title: '¡Materia Creada!',
          text: `La materia "${formData.nombre}" se ha creado exitosamente`,
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#10b981', // Color verde
          timer: 3000,
          timerProgressBar: true
        });
        
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al crear la materia');
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
              <h2 className="text-xl font-semibold text-slate-900">Agregar Materia</h2>
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
                  Área *
                </label>
                <select
                  value={formData.area_id}
                  onChange={(e) => setFormData({ ...formData, area_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-slate-900 bg-white"
                  required
                >
                  <option value="0" className="text-slate-900">Seleccionar área</option>
                  {areasPredeterminadas.map((area) => (
                    <option key={area.id} value={area.id} className="text-slate-900">
                      {area.nombre} {area.es_opcional ? '(Opcional)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre de la Materia *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-slate-900 bg-white placeholder-slate-500"
                  placeholder="Ej: Matemáticas, Español, Ciencias"
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
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  'Crear Materia'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
