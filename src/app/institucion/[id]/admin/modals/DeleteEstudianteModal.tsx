'use client';

import { useState } from 'react';
import { showSuccess, showError } from '@/lib/notifications';
import type { Estudiante } from '@/types/estudiante';

interface DeleteEstudianteModalProps {
  isOpen: boolean;
  onClose: () => void;
  estudiante: Estudiante | null;
  onSuccess: () => void;
}

export default function DeleteEstudianteModal({ 
  isOpen, 
  onClose, 
  estudiante, 
  onSuccess 
}: DeleteEstudianteModalProps) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !estudiante) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    
    try {
      const response = await fetch(`/api/estudiantes/${estudiante.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await showSuccess('¡Eliminado!', `El estudiante ${estudiante.nombres} ${estudiante.apellidos} ha sido eliminado exitosamente.`);
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        await showError('Error', error.error || 'No se pudo eliminar el estudiante');
      }
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
      await showError('Error', 'Ocurrió un error inesperado al eliminar el estudiante');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Eliminar Estudiante</h2>
                <p className="text-sm text-slate-600">Esta acción no se puede deshacer</p>
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

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">¿Estás seguro de que quieres eliminar este estudiante?</h3>
                <p className="text-sm text-red-700 mt-1">
                  Esta acción eliminará permanentemente al estudiante del sistema. Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
          </div>

          {/* Student Info */}
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Información del Estudiante</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-slate-700">Nombre completo:</span>
                <span className="text-sm text-slate-900">{estudiante.nombres} {estudiante.apellidos}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-slate-700">Código estudiantil:</span>
                <span className="text-sm text-slate-900">{estudiante.codigo_estudiantil}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-slate-700">Grado:</span>
                <span className="text-sm text-slate-900">{estudiante.grado?.nombre || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-slate-700">Curso:</span>
                <span className="text-sm text-slate-900">{estudiante.curso?.nombre || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* What will be deleted */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-amber-800 mb-2">Se eliminará:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• El registro del estudiante de la base de datos</li>
              <li>• Toda la información personal y académica</li>
              <li>• Los datos del acudiente asociado</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              disabled={deleting}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {deleting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Eliminando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar Estudiante
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
