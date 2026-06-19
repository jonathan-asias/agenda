'use client';

import { useState, useEffect, useCallback } from 'react';
import { showError } from '@/lib/notifications';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { Estudiante, Grado } from '@/types';

interface EditEstudianteModalProps {
  isOpen: boolean;
  onClose: () => void;
  estudiante: Estudiante | null;
  institucionId: number;
  onSuccess: () => void;
}

export default function EditEstudianteModal({ 
  isOpen, 
  onClose, 
  estudiante, 
  institucionId,
  onSuccess 
}: EditEstudianteModalProps) {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    codigo_estudiantil: '',
    nombre_acudiente: '',
    correo_acudiente: '',
    telefono_acudiente: '',
    grado_id: 0,
    curso_id: 0,
    activo: true
  });

  const [grados, setGrados] = useState<Grado[]>([]);
  const [cursosDisponibles, setCursosDisponibles] = useState<{ id: number; nombre: string; jornada: string | null }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (estudiante) {
      setFormData({
        nombres: estudiante.nombres,
        apellidos: estudiante.apellidos,
        codigo_estudiantil: estudiante.codigo_estudiantil,
        nombre_acudiente: estudiante.nombre_acudiente ?? '',
        correo_acudiente: estudiante.correo_acudiente || '',
        telefono_acudiente: estudiante.telefono_acudiente ?? '',
        grado_id: estudiante.grado_id || 0,
        curso_id: estudiante.curso_id || 0,
        activo: estudiante.activo ?? true
      });
    }
  }, [estudiante]);

  const cargarGrados = useCallback(async () => {
    try {
      const response = await fetch(`/api/setup/grados/${institucionId}`);
      if (response.ok) {
        const data = await response.json();
        setGrados(data.grados);
      }
    } catch (error) {
      console.error('Error cargando grados:', error);
    }
  }, [institucionId]);

  useEffect(() => {
    if (isOpen) {
      cargarGrados();
    }
  }, [isOpen, cargarGrados]);

  useEffect(() => {
    if (!estudiante || grados.length === 0) {
      return;
    }

    let gradoId = formData.grado_id;
    let cursoId = formData.curso_id;

    const nombreGrado = estudiante.grado?.nombre;
    if (!gradoId && nombreGrado) {
      const gradoMatch = grados.find(g => g.nombre === nombreGrado);
      gradoId = gradoMatch?.id || 0;
    }

    const gradoSeleccionado = grados.find(g => g.id === gradoId);
    const cursos = gradoSeleccionado?.cursos ?? [];
    setCursosDisponibles(cursos);

    const nombreCurso = estudiante.curso?.nombre;
    if (!cursoId && nombreCurso) {
      const cursoMatch = cursos.find(c => c.nombre === nombreCurso);
      cursoId = cursoMatch?.id || 0;
    }

    if (gradoId !== formData.grado_id || cursoId !== formData.curso_id) {
      setFormData(prev => ({
        ...prev,
        grado_id: gradoId,
        curso_id: cursoId
      }));
    }
  }, [grados, estudiante, formData.curso_id, formData.grado_id]);

  const handleGradoChange = (gradoId: number) => {
    setFormData(prev => ({ ...prev, grado_id: gradoId, curso_id: 0 }));
    const gradoSeleccionado = grados.find(g => g.id === gradoId);
    if (gradoSeleccionado) {
      setCursosDisponibles(gradoSeleccionado.cursos ?? []);
    } else {
      setCursosDisponibles([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/estudiantes/${estudiante?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        await showError('No se pudo actualizar', error.error || 'Verifica los datos e intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error al actualizar estudiante:', error);
      await showError('No se pudo actualizar', 'Verifica los datos e intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (!estudiante) return null;

  return (
    <Modal open={isOpen} onClose={onClose} title="Editar estudiante" size="lg">
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">Modifica la información del estudiante</p>
      <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nombres *
                  </label>
                  <input
                    type="text"
                    value={formData.nombres}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombres: e.target.value }))}
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    value={formData.apellidos}
                    onChange={(e) => setFormData(prev => ({ ...prev, apellidos: e.target.value }))}
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Código Estudiantil *
                  </label>
                  <input
                    type="text"
                    value={formData.codigo_estudiantil}
                    onChange={(e) => setFormData(prev => ({ ...prev, codigo_estudiantil: e.target.value }))}
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400"
                    required
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.activo}
                      onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.checked }))}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-700">Estudiante activo</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Información Académica */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Información Académica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Grado *
                  </label>
                  <select
                    value={formData.grado_id}
                    onChange={(e) => handleGradoChange(parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400"
                    required
                  >
                    <option value={0}>Seleccionar grado</option>
                    {grados.map((grado) => (
                      <option key={grado.id} value={grado.id}>
                        {grado.nombre} - {grado.nivel}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Curso *
                  </label>
                  <select
                    value={formData.curso_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, curso_id: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400"
                    required
                    disabled={cursosDisponibles.length === 0}
                  >
                    <option value={0}>Seleccionar curso</option>
                    {cursosDisponibles.map((curso) => (
                      <option key={curso.id} value={curso.id}>
                        {curso.nombre} {curso.jornada ? `(${curso.jornada})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Información del Acudiente */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Información del Acudiente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nombre del Acudiente *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre_acudiente}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre_acudiente: e.target.value }))}
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono_acudiente}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefono_acudiente: e.target.value }))}
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Correo Electrónico (Opcional)
                  </label>
                  <input
                    type="email"
                    value={formData.correo_acudiente}
                    onChange={(e) => setFormData(prev => ({ ...prev, correo_acudiente: e.target.value }))}
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-[var(--color-border-light)]">
              <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Guardando…' : 'Guardar cambios'}
              </Button>
            </div>
      </form>
    </Modal>
  );
}
