'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import AddCursoModal from './modals/AddCursoModal';
import AddMateriaModal from './modals/AddMateriaModal';
import AddDocenteModal from './modals/AddDocenteModal';
import AddEstudianteModal from './modals/AddEstudianteModal';
import BulkUploadEstudiantesModal from './modals/BulkUploadEstudiantesModal';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  institucionId: number;
  onSuccess: () => void;
}

type ModalType = 'materia' | 'curso' | 'docente' | 'estudiante' | 'estudiantes_masivo' | null;

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
      case 'estudiantes_masivo':
        return (
          <BulkUploadEstudiantesModal
            isOpen={true}
            onClose={handleClose}
            institucionId={institucionId}
            onSuccess={handleSuccess}
          />
        );
      default:
        return null;
    }
  }

  return (
    <Modal open={isOpen} onClose={handleClose} title="Agregar elemento" size="lg">
      <div className="rounded-lg bg-[var(--color-primary-light)] border border-[var(--color-border-light)] p-4 mb-6">
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          Desde aquí puedes crear nuevos elementos para tu institución. Cada opción abre un formulario donde podrás registrar la información necesaria.
        </p>
      </div>

      <p className="text-[var(--color-text-secondary)] mb-4">
        Selecciona el tipo de elemento que deseas agregar:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedType('materia')}
              className="w-full p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors group h-full"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-slate-900 mb-1">Materia</h3>
                  <p className="text-sm text-slate-600 leading-snug">Registrar una nueva materia de enseñanza. Las materias se vinculan a áreas y grados para que los docentes puedan crear recordatorios por asignatura.</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedType('curso')}
              className="w-full p-4 text-left bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors group h-full"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:bg-orange-600 transition-colors flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-slate-900 mb-1">Curso</h3>
                  <p className="text-sm text-slate-600 leading-snug">Crear un curso dentro de un grado (ej. 5°A, 5°B). Los cursos agrupan estudiantes y permiten asignar docentes y materias por grupo.</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedType('docente')}
              className="w-full p-4 text-left bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors group h-full"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-slate-900 mb-1">Docente</h3>
                  <p className="text-sm text-slate-600 leading-snug">Dar de alta un docente en la institución. Los docentes pueden iniciar sesión, asignarse a materias y grados, y crear recordatorios (tareas, exámenes, eventos) para los estudiantes.</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedType('estudiante')}
              className="w-full p-4 text-left bg-pink-50 hover:bg-pink-100 rounded-lg border border-pink-200 transition-colors group h-full"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center group-hover:bg-pink-600 transition-colors flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-slate-900 mb-1">Estudiante</h3>
                  <p className="text-sm text-slate-600 leading-snug">Registrar un estudiante y asignarlo a un grado y curso. Los estudiantes pueden ser vinculados a los recordatorios que crean los docentes para su grupo.</p>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setSelectedType('estudiantes_masivo')}
              className="w-full p-4 text-left bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center group-hover:bg-teal-700 transition-colors flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-slate-900 mb-1">Subir masivamente estudiantes</h3>
                  <p className="text-sm text-slate-600 leading-snug">
                    Descargue una plantilla Excel con los grados, cursos y materias de su sede, complete
                    los datos de los estudiantes y cárguela para registrarlos de una sola vez.
                  </p>
                </div>
              </div>
            </button>
          </div>

      <div className="mt-8 flex justify-end pt-4 border-t border-[var(--color-border-light)]">
        <Button type="button" variant="outline" onClick={handleClose}>
          Cancelar
        </Button>
      </div>
    </Modal>
  );
}
