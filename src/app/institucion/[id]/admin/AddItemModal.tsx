'use client';

import { useState } from 'react';
import AddCursoModal from './modals/AddCursoModal';
import AddMateriaModal from './modals/AddMateriaModal';
import AddDocenteModal from './modals/AddDocenteModal';
import AddEstudianteModal from './modals/AddEstudianteModal';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  institucionId: number;
  onSuccess: () => void;
}

type ModalType = 'materia' | 'curso' | 'docente' | 'estudiante' | null;

export default function AddItemModal({ isOpen, onClose, institucionId, onSuccess }: AddItemModalProps) {
  const [selectedType, setSelectedType] = useState<ModalType>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setSelectedType(null);
    onClose();
  };

  const handleSuccess = () => {
    setSelectedType(null);
    onSuccess();
  };

  // Si hay un tipo seleccionado, mostrar el modal específico
  if (selectedType) {
    switch (selectedType) {
      case 'materia':
        return <AddMateriaModal isOpen={true} onClose={handleClose} institucionId={institucionId} onSuccess={handleSuccess} />;
      case 'curso':
        return <AddCursoModal isOpen={true} onClose={handleClose} institucionId={institucionId} onSuccess={handleSuccess} />;
      case 'docente':
        return <AddDocenteModal isOpen={true} onClose={handleClose} institucionId={institucionId} onSuccess={handleSuccess} />;
      case 'estudiante':
        return <AddEstudianteModal isOpen={true} onClose={handleClose} institucionId={institucionId} onSuccess={handleSuccess} />;
      default:
        return null;
    }
  }

  // Modal de selección de tipo
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Agregar Nuevo Elemento</h2>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-slate-600 mb-6">
            Selecciona el tipo de elemento que deseas agregar:
          </p>

          <div className="space-y-3">
            <button
              onClick={() => setSelectedType('materia')}
              className="w-full p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors group"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-600 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Materia</h3>
                  <p className="text-sm text-slate-600">Agregar una nueva materia</p>
                </div>
              </div>
            </button>


            <button
              onClick={() => setSelectedType('curso')}
              className="w-full p-4 text-left bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors group"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-4 group-hover:bg-orange-600 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Curso</h3>
                  <p className="text-sm text-slate-600">Agregar un nuevo curso</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedType('docente')}
              className="w-full p-4 text-left bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors group"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mr-4 group-hover:bg-indigo-600 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Docente</h3>
                  <p className="text-sm text-slate-600">Agregar un nuevo docente</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedType('estudiante')}
              className="w-full p-4 text-left bg-pink-50 hover:bg-pink-100 rounded-lg border border-pink-200 transition-colors group"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center mr-4 group-hover:bg-pink-600 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Estudiante</h3>
                  <p className="text-sm text-slate-600">Agregar un nuevo estudiante</p>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
