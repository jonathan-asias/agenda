'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react';
import { showSuccess } from '@/lib/notifications';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import ErrorBanner from '@/components/ui/ErrorBanner';
import Input from '@/components/ui/Input';

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
        
        await showSuccess('Materia creada', `Se creó la materia "${formData.nombre}".`);
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
    <Modal open={isOpen} onClose={onClose} title="Agregar materia" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorBanner title={error} />}

        <div className="min-w-0">
          <label htmlFor="materia-area" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Área *
          </label>
          <select
            id="materia-area"
            value={formData.area_nombre}
            onChange={(e) => {
              const areaNombre = e.target.value;
              const normalizar = (texto: string) => texto.trim().toLowerCase();
              const areaPredeterminada = areasPredeterminadas.find(
                (a) => normalizar(a.nombre) === normalizar(areaNombre)
              );
              setFormData({
                ...formData,
                area_nombre: areaNombre,
                area_id: areaPredeterminada ? String(areaPredeterminada.id) : '0',
              });
            }}
            className="w-full max-w-full min-w-0 px-4 py-2.5 text-base border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] truncate"
            required
          >
            <option value="">Seleccionar área</option>
            {areasPredeterminadas.map((area) => (
              <option key={area.id} value={area.nombre}>
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

              <Input
                label="Nombre de la materia"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Matemáticas, Español, Ciencias"
                required
              />

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-[var(--color-border-light)]">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Guardando…' : 'Guardar materia'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
