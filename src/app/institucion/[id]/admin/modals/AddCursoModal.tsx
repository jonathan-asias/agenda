'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react';
import { showSuccess } from '@/lib/notifications';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import ErrorBanner from '@/components/ui/ErrorBanner';
import Input from '@/components/ui/Input';

interface AddCursoModalProps {
  isOpen: boolean;
  onClose: () => void;
  institucionId: number;
  onSuccess: () => void;
}

interface CursoApi {
  nombre: string;
}

interface GradoApi {
  id: number;
  nombre: string;
  cursos?: CursoApi[];
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
    grado_id: 0,
    grado_nombre: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gradosDisponibles, setGradosDisponibles] = useState<GradoApi[]>([]);
  const [cursosExistentes, setCursosExistentes] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (isOpen) {
      // Resetear formulario cuando se abre
      setFormData({ nombre: '', grado_id: 0, grado_nombre: '' });
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
    const cargarCursosExistentes = async () => {
      try {
        const response = await fetch(`/api/setup/grados/${institucionId}`);
        if (!response.ok) return;
        const data = await response.json();
        const grados: GradoApi[] = data?.grados || [];
        setGradosDisponibles(grados);

        const cursosPorGradoNombre: Record<string, string[]> = {};
        const normalizar = (texto: string) => texto.trim().toLowerCase();
        grados.forEach((grado) => {
          const gradoNombre = normalizar(grado.nombre || '');
          if (!gradoNombre) return;
          cursosPorGradoNombre[gradoNombre] = (grado.cursos || []).map((curso) => curso.nombre);
        });
        setCursosExistentes(cursosPorGradoNombre);
      } catch (fetchError) {
        console.error('Error cargando cursos existentes:', fetchError);
      }
    };

    if (isOpen && institucionId) {
      cargarCursosExistentes();
    }
  }, [isOpen, institucionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (formData.grado_id === 0) {
        setError('Selecciona un grado registrado antes de crear el curso');
        setLoading(false);
        return;
      }
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
        
        await showSuccess('Curso creado', `Se creó el curso "${formData.nombre}".`);
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
    <Modal open={isOpen} onClose={onClose} title="Agregar curso" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorBanner title={error} />}

        <div>
          <label htmlFor="curso-grado" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Grado *
          </label>
          <select
            id="curso-grado"
            value={formData.grado_nombre}
            onChange={(e) => {
              const gradoNombre = e.target.value;
              const normalizar = (texto: string) => texto.trim().toLowerCase();
              const gradoPredeterminado = gradosPredeterminados.find(
                (g) => normalizar(g.nombre) === normalizar(gradoNombre)
              );
              setFormData({
                ...formData,
                grado_nombre: gradoNombre,
                grado_id: gradoPredeterminado ? gradoPredeterminado.id : 0,
              });
            }}
            className="w-full px-4 py-2.5 text-base border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-focus)]"
            required
          >
            <option value="">Seleccionar grado</option>
            {gradosPredeterminados.map((grado) => (
              <option key={grado.id} value={grado.nombre}>
                {grado.nombre} - {grado.nivel}
              </option>
            ))}
          </select>
        </div>

              {formData.grado_nombre && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-600 uppercase mb-2">
                    Cursos existentes en este grado
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(cursosExistentes[formData.grado_nombre.trim().toLowerCase()] || []).length > 0 ? (
                      cursosExistentes[formData.grado_nombre.trim().toLowerCase()].map((curso) => (
                        <span
                          key={curso}
                          className="px-2.5 py-1 text-xs rounded-full bg-white border border-slate-200 text-slate-700"
                        >
                          {curso}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">Sin cursos registrados.</span>
                    )}
                  </div>
                </div>
              )}

              <Input
                label="Nombre del curso"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Curso A, Curso B"
                hint="Usa el formato oficial del colegio (ej. 6° A, 7° B)."
                required
              />

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-[var(--color-border-light)]">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Guardando…' : 'Guardar curso'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
