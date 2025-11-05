'use client';

import { useState, useEffect } from 'react';

interface Recordatorio {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  tipo: string;
  created_at?: string;
  updated_at?: string;
  grado: {
    id: number;
    nombre: string;
    nivel: string;
  };
  curso: {
    id: number;
    nombre: string;
    jornada: string | null;
  };
  area: {
    id: number;
    nombre: string;
  };
  materia: {
    id: number;
    nombre: string;
  };
}

interface EditRecordatorioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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

  if (!isOpen || !recordatorio) return null;

  // Obtener la fecha mínima (hoy)
  const hoy = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 max-h-[90vh] flex flex-col">
        <div className="bg-white border-b border-slate-200 p-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">✏️ Editar Recordatorio</h2>
              <p className="text-slate-600">Actualiza la información del recordatorio</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
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
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
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
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            />
            <p className="text-xs text-slate-500">
              Selecciona la fecha para la cual es el recordatorio
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="flex space-x-4 pt-4 border-t border-slate-200 mt-6 flex-shrink-0">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Actualizando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Actualizar Recordatorio
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-200 border-2 border-slate-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

