'use client';

import { useState, useEffect } from 'react';
import type { Recordatorio } from '@/types/recordatorio';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import ErrorBanner from '@/components/ui/ErrorBanner';

interface EditRecordatorioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (recordatorio?: Recordatorio) => void;
  recordatorio: Recordatorio | null;
}

export default function EditRecordatorioModal({
  isOpen,
  onClose,
  onSuccess,
  recordatorio
}: EditRecordatorioModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos del recordatorio cuando se abre el modal
  useEffect(() => {
    if (recordatorio && isOpen) {
      // Formatear la fecha para el input type="date" (YYYY-MM-DD)
      const fechaFormateada = recordatorio.fecha
        ? new Date(recordatorio.fecha).toISOString().split('T')[0]
        : '';
      
      setFormData({
        nombre: recordatorio.nombre || '',
        descripcion: recordatorio.descripcion || '',
        fecha: fechaFormateada
      });
      setError('');
    }
  }, [recordatorio, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error al escribir
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Validaciones
    if (!formData.nombre.trim()) {
      setError('El nombre del recordatorio es requerido');
      setSubmitting(false);
      return;
    }

    if (!formData.descripcion.trim()) {
      setError('La descripción es requerida');
      setSubmitting(false);
      return;
    }

    if (!formData.fecha) {
      setError('La fecha del recordatorio es requerida');
      setSubmitting(false);
      return;
    }

    if (!recordatorio) {
      setError('Recordatorio no válido');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/recordatorios/${recordatorio.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          descripcion: formData.descripcion.trim(),
          fecha: formData.fecha
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Error al actualizar el recordatorio. Por favor, intenta nuevamente.');
        setSubmitting(false);
        return;
      }

      const responseData = await response.json();
      
      // Crear el recordatorio actualizado con todos los datos originales más los actualizados
      const updatedRecordatorio: Recordatorio = {
        ...recordatorio,
        nombre: responseData.recordatorio.nombre,
        descripcion: responseData.recordatorio.descripcion,
        fecha: responseData.recordatorio.fecha,
        updated_at: responseData.recordatorio.updated_at || recordatorio.updated_at
      };

      onSuccess(updatedRecordatorio);
      onClose();
    } catch (err) {
      console.error('Error al actualizar recordatorio:', err);
      setError('Error al actualizar el recordatorio. Por favor, intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      fecha: ''
    });
    setError('');
    onClose();
  };

  if (!recordatorio) return null;

  const hoy = new Date().toISOString().split('T')[0];

  return (
    <Modal open={isOpen} onClose={handleClose} title="Editar recordatorio" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información no editable (solo lectura) */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 space-y-3">
            <p className="text-sm font-semibold text-slate-700 mb-3">Información del recordatorio (no editable)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Tipo</label>
                <p className="text-slate-800 capitalize">{recordatorio.tipo}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Área</label>
                <p className="text-slate-800">{recordatorio.area.nombre}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Materia</label>
                <p className="text-slate-800">{recordatorio.materia.nombre}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Grado</label>
                <p className="text-slate-800">{recordatorio.grado.nombre} ({recordatorio.grado.nivel})</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Curso</label>
                <p className="text-slate-800">
                  {recordatorio.curso.nombre}
                  {recordatorio.curso.jornada && ` (${recordatorio.curso.jornada})`}
                </p>
              </div>
            </div>
          </div>

          {/* Nombre del Recordatorio */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Nombre del Recordatorio <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              maxLength={255}
              className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder:text-slate-400"
              placeholder="Ej: Revisar exámenes de Matemáticas"
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              required
              rows={4}
              maxLength={1000}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
              placeholder="Describe los detalles del recordatorio..."
            />
            <p className="text-xs text-slate-500">
              {formData.descripcion.length}/1000 caracteres
            </p>
          </div>

          {/* Fecha del Recordatorio */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Fecha del Recordatorio <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              required
              min={hoy}
              className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            />
            <p className="text-xs text-slate-500">
              Selecciona la fecha para la cual es el recordatorio
            </p>
          </div>
          
          {error && <ErrorBanner title={error} />}

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-[var(--color-border-light)]">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={submitting} className="flex-1 sm:ml-auto">
              {submitting ? 'Guardando…' : 'Guardar cambios'}
            </Button>
          </div>
      </form>
    </Modal>
  );
}

