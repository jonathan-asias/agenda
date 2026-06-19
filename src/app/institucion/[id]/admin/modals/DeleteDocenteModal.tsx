'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from 'react';
import { showSuccess, showError } from '@/lib/notifications';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

/** Mínimo necesario para eliminar (compatible con Docente y DocenteResumen). */
export interface DocenteParaEliminar {
  id: number;
  nombres: string;
  apellidos: string;
  email?: string;
  docenteAsignaciones?: unknown[];
}

interface DeleteDocenteModalProps {
  isOpen: boolean;
  onClose: () => void;
  docente: DocenteParaEliminar | null;
  onSuccess: () => void;
}

export default function DeleteDocenteModal({
  isOpen,
  onClose,
  docente,
  onSuccess,
}: DeleteDocenteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!docente) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/docentes/${docente.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await showSuccess(
          'Docente eliminado',
          `Se eliminó a ${docente.nombres} ${docente.apellidos}.`
        );
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        await showError(
          'No se pudo eliminar',
          errorData.error || 'Verifica que el docente no tenga dependencias activas.'
        );
      }
    } catch {
      await showError('Sin conexión', 'No se pudo conectar con el servidor. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!docente) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="¿Eliminar docente?"
      size="md"
      closeOnOverlayClick={!loading}
      showCloseButton={!loading}
    >
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">
        Esta acción no se puede deshacer. Se eliminará permanentemente:
      </p>

      <div className="bg-[var(--color-surface-nested)] rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-[var(--color-text-primary)]">
              {docente.nombres} {docente.apellidos}
            </h4>
            <p className="text-sm text-[var(--color-text-secondary)]">{docente.email ?? '—'}</p>
          </div>
        </div>

        {docente.docenteAsignaciones && docente.docenteAsignaciones.length > 0 && (
          <div className="text-sm text-[var(--color-text-secondary)]">
            <span className="font-medium">Asignaciones:</span> {docente.docenteAsignaciones.length}
          </div>
        )}
      </div>

      <ul className="space-y-2 text-sm text-[var(--color-text-secondary)] mb-4 list-disc pl-5">
        <li>Datos personales del docente</li>
        <li>Asignaciones a grados, cursos y materias</li>
        <li>Cuenta de acceso en el sistema</li>
      </ul>

      <div className="bg-[var(--color-danger-light)] border border-[var(--color-danger-border)] rounded-lg p-4 mb-6">
        <p className="text-sm text-[var(--color-danger-text)]">
          El docente no podrá acceder al sistema y se perderán todas sus asignaciones.
        </p>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-[var(--color-border-light)]">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
          {loading ? 'Eliminando…' : 'Eliminar docente'}
        </Button>
      </div>
    </Modal>
  );
}
