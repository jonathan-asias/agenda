'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';

interface Docente {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  sede: { nombre: string } | null;
  docenteAsignaciones: {
    grado: { nombre: string; nivel: string };
    curso: { nombre: string };
    materia: { nombre: string };
  }[];
}

interface DeleteDocenteModalProps {
  isOpen: boolean;
  onClose: () => void;
  docente: Docente | null;
  onSuccess: () => void;
}

export default function DeleteDocenteModal({ 
  isOpen, 
  onClose, 
  docente, 
  onSuccess 
}: DeleteDocenteModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !docente) return null;

  const handleDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/docentes/${docente.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: '¡Docente Eliminado!',
          text: `El docente "${docente.nombres} ${docente.apellidos}" ha sido eliminado exitosamente`,
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#dc2626',
          timer: 3000,
          timerProgressBar: true
        });
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        await Swal.fire({
          icon: 'error',
          title: 'Error al Eliminar',
          text: errorData.error || 'No se pudo eliminar el docente',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#dc2626'
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error de Conexión',
        text: 'No se pudo conectar con el servidor',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              ¿Eliminar Docente?
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Esta acción no se puede deshacer. Se eliminará permanentemente:
            </p>
          </div>

          {/* Información del docente */}
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-slate-900">
                  {docente.nombres} {docente.apellidos}
                </h4>
                <p className="text-sm text-slate-600">{docente.email}</p>
              </div>
            </div>
            
            {docente.docenteAsignaciones && docente.docenteAsignaciones.length > 0 && (
              <div className="text-sm text-slate-600">
                <span className="font-medium">Asignaciones:</span> {docente.docenteAsignaciones.length}
              </div>
            )}
          </div>

          {/* Lista de lo que se eliminará */}
          <div className="space-y-3 mb-6">
            <h4 className="font-medium text-slate-900 text-sm">Se eliminará:</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Datos personales del docente
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Todas las asignaciones a grados, cursos y materias
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Cuenta de autenticación (Supabase Auth)
              </li>
            </ul>
          </div>

          {/* Advertencia */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-red-800">Advertencia</h4>
                <p className="text-sm text-red-700 mt-1">
                  Esta acción es irreversible. El docente no podrá acceder al sistema y se perderán todas sus asignaciones.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Eliminando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar Docente
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
