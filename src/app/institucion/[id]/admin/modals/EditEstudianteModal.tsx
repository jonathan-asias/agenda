'use client';

import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';

interface Estudiante {
  id: number;
  nombres: string;
  apellidos: string;
  codigo_estudiantil: string;
  nombre_acudiente: string;
  correo_acudiente?: string;
  telefono_acudiente: string;
  grado: { nombre: string; nivel: string };
  curso: { nombre: string; jornada: string | null };
  activo: boolean;
  grado_id?: number | null;
  curso_id?: number | null;
}

interface Grado {
  id: number;
  nombre: string;
  nivel: string;
  cursos: { id: number; nombre: string; jornada: string | null }[];
}

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
        nombre_acudiente: estudiante.nombre_acudiente,
        correo_acudiente: estudiante.correo_acudiente || '',
        telefono_acudiente: estudiante.telefono_acudiente,
        grado_id: estudiante.grado_id || 0,
        curso_id: estudiante.curso_id || 0,
        activo: estudiante.activo
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

    if (!gradoId && estudiante.grado?.nombre) {
      const gradoMatch = grados.find(g => g.nombre === estudiante.grado.nombre);
      gradoId = gradoMatch?.id || 0;
    }

    const gradoSeleccionado = grados.find(g => g.id === gradoId);
    const cursos = gradoSeleccionado?.cursos || [];
    setCursosDisponibles(cursos);

    if (!cursoId && estudiante.curso?.nombre) {
      const cursoMatch = cursos.find(c => c.nombre === estudiante.curso.nombre);
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
      setCursosDisponibles(gradoSeleccionado.cursos);
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
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error: ${error.error}`
        });
      }
    } catch (error) {
      console.error('Error al actualizar estudiante:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al actualizar el estudiante'
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !estudiante) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Editar Estudiante</h2>
                <p className="text-sm text-slate-600">Modifica la información del estudiante</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
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

            {/* Footer */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
