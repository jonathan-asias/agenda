'use client';

import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

/** Mínimo necesario para mostrar un docente en el modal de vista. */
export interface DocenteParaVista {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  sede?: { id?: number; nombre: string } | null;
  docenteAsignaciones?: Array<{
    grado: { nombre: string; nivel?: string };
    curso: { nombre: string };
    materia: { nombre: string };
  }>;
}

interface ViewDocenteModalProps {
  isOpen: boolean;
  onClose: () => void;
  docente: DocenteParaVista | null;
}

export default function ViewDocenteModal({ isOpen, onClose, docente }: ViewDocenteModalProps) {
  if (!docente) return null;

  return (
    <Modal open={isOpen} onClose={onClose} title="Información del docente" size="lg">
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-medium text-[var(--color-text-primary)] mb-4">
            Información personal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Nombres</label>
              <p className="text-[var(--color-text-primary)] bg-[var(--color-surface-nested)] p-3 rounded-lg">{docente.nombres}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Apellidos</label>
              <p className="text-[var(--color-text-primary)] bg-[var(--color-surface-nested)] p-3 rounded-lg">{docente.apellidos}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Correo</label>
              <p className="text-[var(--color-text-primary)] bg-[var(--color-surface-nested)] p-3 rounded-lg">{docente.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Teléfono</label>
              <p className="text-[var(--color-text-primary)] bg-[var(--color-surface-nested)] p-3 rounded-lg">{docente.telefono ?? 'No indicado'}</p>
            </div>
            {docente.sede && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Sede</label>
                <p className="text-[var(--color-text-primary)] bg-[var(--color-surface-nested)] p-3 rounded-lg">{docente.sede.nombre}</p>
              </div>
            )}
          </div>
        </div>

        {docente.docenteAsignaciones && docente.docenteAsignaciones.length > 0 ? (
          <div>
            <h3 className="text-base font-medium text-[var(--color-text-primary)] mb-4">
              Asignaciones ({docente.docenteAsignaciones.length})
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {docente.docenteAsignaciones.map((asignacion, index) => (
                <div key={index} className="p-4 bg-[var(--color-surface-nested)] rounded-lg border border-[var(--color-border-light)]">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="block text-xs font-medium text-[var(--color-text-secondary)]">Grado</span>
                      <span className="text-[var(--color-text-primary)] font-medium">
                        {asignacion.grado.nombre}{asignacion.grado.nivel ? ` - ${asignacion.grado.nivel}` : ''}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs font-medium text-[var(--color-text-secondary)]">Curso</span>
                      <span className="text-[var(--color-text-primary)] font-medium">{asignacion.curso.nombre}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-medium text-[var(--color-text-secondary)]">Materia</span>
                      <span className="text-[var(--color-text-primary)] font-medium">{asignacion.materia.nombre}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-[var(--color-text-secondary)] py-6">
            No hay asignaciones registradas
          </p>
        )}
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t border-[var(--color-border-light)]">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </Modal>
  );
}
