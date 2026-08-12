'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import AddCursoModal from './modals/AddCursoModal';
import AddMateriaModal from './modals/AddMateriaModal';
import AddDocenteModal from './modals/AddDocenteModal';
import AddEstudianteModal from './modals/AddEstudianteModal';
import BulkUploadEstudiantesModal from './modals/BulkUploadEstudiantesModal';
import AddCalendarioAcademicoModal from './modals/AddCalendarioAcademicoModal';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  institucionId: number;
  onSuccess: () => void;
}

type ModalType =
  | 'materia'
  | 'curso'
  | 'docente'
  | 'estudiante'
  | 'estudiantes_masivo'
  | 'calendario_academico'
  | null;

export default function AddItemModal({ isOpen, onClose, institucionId, onSuccess }: AddItemModalProps) {
  const [selectedType, setSelectedType] = useState<ModalType>(null);
  const [checkingEstructura, setCheckingEstructura] = useState(false);
  const [puedeCargaMasiva, setPuedeCargaMasiva] = useState(false);

  useEffect(() => {
    if (!isOpen || selectedType) return;

    let cancelled = false;
    const checkEstructura = async () => {
      setCheckingEstructura(true);
      try {
        const response = await fetch(`/api/instituciones/${institucionId}/dashboard`);
        if (!response.ok) {
          if (!cancelled) setPuedeCargaMasiva(false);
          return;
        }
        const data = await response.json();
        const grados = Number(data?.estadisticas?.grados ?? 0);
        const cursos = Number(data?.estadisticas?.cursos ?? 0);
        if (!cancelled) {
          setPuedeCargaMasiva(grados > 0 && cursos > 0);
        }
      } catch {
        if (!cancelled) setPuedeCargaMasiva(false);
      } finally {
        if (!cancelled) setCheckingEstructura(false);
      }
    };

    void checkEstructura();
    return () => {
      cancelled = true;
    };
  }, [isOpen, institucionId, selectedType]);

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
      case 'calendario_academico':
        return (
          <AddCalendarioAcademicoModal
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
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Agregar elemento"
      size="full"
      className="max-w-7xl"
    >
      <div className="mb-6 border-b border-[var(--color-border-light)] pb-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1 self-center text-left">
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Elige una opción según la información que necesites registrar. Puedes ampliar la
              estructura académica, habilitar usuarios o cargar varios estudiantes desde Excel.
            </p>
          </div>
        </div>
      </div>

      <p className="mb-3 text-xs text-[var(--color-text-tertiary)]">
        Selecciona una opción para continuar:
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              type="button"
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
              type="button"
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
              type="button"
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
              type="button"
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

            <button
              type="button"
              onClick={() => setSelectedType('calendario_academico')}
              className="w-full p-4 text-left bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors group h-full"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center group-hover:bg-sky-600 transition-colors flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-slate-900 mb-1">Agregar calendario académico</h3>
                  <p className="text-sm text-slate-600 leading-snug">
                    Definir el calendario académico de la institución: periodos, fechas clave,
                    vacaciones y días no lectivos.
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!puedeCargaMasiva || checkingEstructura) return;
                setSelectedType('estudiantes_masivo');
              }}
              disabled={!puedeCargaMasiva || checkingEstructura}
              aria-disabled={!puedeCargaMasiva || checkingEstructura}
              title={
                checkingEstructura
                  ? 'Comprobando estructura académica…'
                  : !puedeCargaMasiva
                    ? 'Primero crea grados y cursos'
                    : undefined
              }
              className={`w-full p-4 text-left rounded-lg border transition-colors group h-full ${
                puedeCargaMasiva && !checkingEstructura
                  ? 'bg-teal-50 hover:bg-teal-100 border-teal-200 cursor-pointer'
                  : 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-70'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    puedeCargaMasiva && !checkingEstructura
                      ? 'bg-teal-600 group-hover:bg-teal-700 transition-colors'
                      : 'bg-slate-400'
                  }`}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    className={`font-medium mb-1 ${
                      puedeCargaMasiva && !checkingEstructura ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    Subir masivamente estudiantes
                  </h3>
                  {checkingEstructura ? (
                    <p className="text-sm text-slate-500 leading-snug">
                      Comprobando si hay grados y cursos…
                    </p>
                  ) : puedeCargaMasiva ? (
                    <p className="text-sm text-slate-600 leading-snug">
                      Descargue una plantilla Excel con los grados, cursos y materias de su sede, complete
                      los datos de los estudiantes y cárguela para registrarlos de una sola vez.
                    </p>
                  ) : (
                    <p className="text-sm text-amber-700 leading-snug">
                      Primero crea grados y cursos (desde la configuración inicial o agregando un curso).
                      La carga masiva necesita esa estructura para asignar a cada estudiante.
                    </p>
                  )}
                </div>
              </div>
            </button>
          </div>

      <div className="mt-8 flex justify-end border-t border-[var(--color-border-light)] pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleClose}
          className="gap-2 border-slate-300 bg-white px-5 shadow-sm hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Cancelar
        </Button>
      </div>
    </Modal>
  );
}
