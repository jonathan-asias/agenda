'use client';

import { useState } from 'react';
import { showSuccess, showError } from '@/lib/notifications';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

/** Mínimo necesario para eliminar (compatible con Estudiante y EstudianteResumen). */
export interface EstudianteParaEliminar {
  id: number;
  nombres: string;
  apellidos: string;
  codigo_estudiantil?: string;
  grado?: { nombre: string };
  curso?: { nombre: string };
}

interface DeleteEstudianteModalProps {
  isOpen: boolean;
  onClose: () => void;
  estudiante: EstudianteParaEliminar | null;
  onSuccess: () => void;
}

export default function DeleteEstudianteModal({
  isOpen,
  onClose,
  estudiante,
  onSuccess,
}: DeleteEstudianteModalProps) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!estudiante) return;
    setDeleting(true);

    try {
      const response = await fetch(`/api/estudiantes/${estudiante.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await showSuccess(
          'Estudiante eliminado',
          `Se eliminó a ${estudiante.nombres} ${estudiante.apellidos}.`
        );
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        await showError('No se pudo eliminar', error.error || 'Intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
      await showError('Sin conexión', 'No se pudo completar la eliminación. Intenta de nuevo.');
    } finally {
      setDeleting(false);
    }
  };

  if (!estudiante) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Eliminar estudiante"
      size="lg"
      closeOnOverlayClick={!deleting}
      showCloseButton={!deleting}
    >
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">
        Esta acción elimina permanentemente al estudiante y su información asociada.
      </p>

      <div className="bg-[var(--color-surface-nested)] rounded-lg p-4 mb-4 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <span className="font-medium text-[var(--color-text-secondary)]">Nombre</span>
          <span className="text-[var(--color-text-primary)]">
            {estudiante.nombres} {estudiante.apellidos}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="font-medium text-[var(--color-text-secondary)]">Código</span>
          <span className="text-[var(--color-text-primary)]">{estudiante.codigo_estudiantil ?? '—'}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="font-medium text-[var(--color-text-secondary)]">Grado / curso</span>
          <span className="text-[var(--color-text-primary)]">
            {estudiante.grado?.nombre ?? 'N/A'} · {estudiante.curso?.nombre ?? 'N/A'}
          </span>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-[var(--color-border-light)]">
        <Button type="button" variant="outline" onClick={onClose} disabled={deleting}>
          Cancelar
        </Button>
        <Button type="button" variant="destructive" onClick={handleConfirm} disabled={deleting}>
          {deleting ? 'Eliminando…' : 'Eliminar estudiante'}
        </Button>
      </div>
    </Modal>
  );
}
