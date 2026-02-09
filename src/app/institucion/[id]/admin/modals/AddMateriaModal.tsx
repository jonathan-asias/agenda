'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface AddMateriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  institucionId: number;
  onSuccess: () => void;
}

interface AreaApi {
  id: number;
  nombre: string;
}

interface MateriaApi {
  id: number;
  nombre: string;
  area_id: number;
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
    area_id: '0',
    area_nombre: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [areasDisponibles, setAreasDisponibles] = useState<AreaApi[]>([]);
  const [materiasExistentes, setMateriasExistentes] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (isOpen) {
      // Resetear formulario cuando se abre
      setFormData({ nombre: '', area_id: '0', area_nombre: '' });
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const body = document.body;
    const count = Number(body.dataset.modalCount || '0');
    body.dataset.modalCount = String(count + 1);
    body.classList.add('modal-open');
    return () => {
      const next = Math.max(Number(body.dataset.modalCount || '1') - 1, 0);
      if (next === 0) {
        body.classList.remove('modal-open');
        delete body.dataset.modalCount;
      } else {
        body.dataset.modalCount = String(next);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    const cargarMateriasExistentes = async () => {
      try {
        const [areasResponse, materiasResponse] = await Promise.all([
          fetch(`/api/setup/areas/${institucionId}`),
          fetch(`/api/setup/materias/${institucionId}`)
        ]);
        if (!areasResponse.ok || !materiasResponse.ok) return;

        const areasData = await areasResponse.json();
        const materiasData = await materiasResponse.json();
        const areas: AreaApi[] = areasData?.areas || [];
        const materias: MateriaApi[] = materiasData?.materias || [];

        setAreasDisponibles(areas);

        const materiasPorAreaNombre: Record<string, string[]> = {};
        const normalizar = (texto: string) => texto.trim().toLowerCase();
        materias.forEach((materia) => {
          const area = areas.find((a) => a.id === materia.area_id);
          const areaNombre = area?.nombre ? normalizar(area.nombre) : '';
          if (!areaNombre) return;
          if (!materiasPorAreaNombre[areaNombre]) {
            materiasPorAreaNombre[areaNombre] = [];
          }
          materiasPorAreaNombre[areaNombre].push(materia.nombre);
        });
        setMateriasExistentes(materiasPorAreaNombre);
      } catch (fetchError) {
        console.error('Error cargando materias existentes:', fetchError);
      }
    };

    if (isOpen && institucionId) {
      cargarMateriasExistentes();
    }
  }, [isOpen, institucionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (formData.area_id === '0') {
        setError('Selecciona un área registrada antes de crear la materia');
        setLoading(false);
        return;
      }
      const response = await fetch('/api/setup/materias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          institucionId,
          materias: [{
            nombre: formData.nombre,
            area_id: formData.area_id
          }]
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
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 overflow-x-hidden">
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
              <div className="min-w-0">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Área *
                </label>
                <select
                  value={formData.area_nombre}
                  onChange={(e) => {
                    const areaNombre = e.target.value;
                    const normalizar = (texto: string) => texto.trim().toLowerCase();
                    const areaEncontrada = areasDisponibles.find(
                      (area) => normalizar(area.nombre) === normalizar(areaNombre)
                    );
                    setFormData({
                      ...formData,
                      area_nombre: areaNombre,
                      area_id: areaEncontrada ? String(areaEncontrada.id) : '0'
                    });
                  }}
                  className="w-full max-w-full min-w-0 px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder:text-slate-400 truncate"
                  required
                >
                  <option value="" className="text-slate-900">Seleccionar área</option>
                  {areasPredeterminadas.map((area) => (
                    <option key={area.id} value={area.nombre} className="text-slate-900">
                      {area.nombre} {area.es_opcional ? '(Opcional)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {formData.area_nombre && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-600 uppercase mb-2">
                    Materias existentes en esta área
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(materiasExistentes[formData.area_nombre.trim().toLowerCase()] || []).length > 0 ? (
                      materiasExistentes[formData.area_nombre.trim().toLowerCase()].map((materia) => (
                        <span
                          key={materia}
                          className="px-2.5 py-1 text-xs rounded-full bg-white border border-slate-200 text-slate-700"
                        >
                          {materia}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">Sin materias registradas.</span>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                  Nombre de la Materia *
                  <span className="relative group ml-2">
                    <button
                      type="button"
                      aria-label="Información para nombrar materias"
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 8a1 1 0 112 0v5a1 1 0 11-2 0V8zm1-4a1.25 1.25 0 110 2.5A1.25 1.25 0 0110 4z" />
                      </svg>
                    </button>
                    <div className="pointer-events-none absolute left-0 top-full z-10 mt-2 w-72 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-600 shadow-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <div className="font-semibold text-slate-700">Ejemplo:</div>
                      <div>Álgebra, Cálculo, Matemáticas básicas, Geometría</div>
                      <div className="mt-2 text-[11px] text-orange-600">
                        Ten en cuenta las políticas del instituto: usa nombres claros, sin abreviaturas y con la nomenclatura oficial.
                      </div>
                    </div>
                  </span>
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
