'use client';

import Modal from '@/components/ui/Modal';
import CalendarioAcademicoBoard from '@/components/calendario-academico/CalendarioAcademicoBoard';

interface AddCalendarioAcademicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  institucionId: number;
  onSuccess?: () => void;
  /** Vista consolidada (perfil institución). Por defecto: solo la sede del admin. */
  consolidado?: boolean;
}

export default function AddCalendarioAcademicoModal({
  isOpen,
  onClose,
  institucionId,
  consolidado = false,
}: AddCalendarioAcademicoModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={
        consolidado
          ? 'Calendario académico (todas las sedes)'
          : 'Calendario académico'
      }
      size="full"
      className="max-w-6xl"
      contentClassName="overflow-y-auto flex-1 min-h-0 px-4 py-4 sm:px-6"
    >
      <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
        {consolidado ? (
          <p>
            Vista consolidada: ves las actividades de todas las sedes. Al crear una actividad,
            elige a qué sede pertenece.
          </p>
        ) : (
          <p>
            Calendario de tu sede. Haz clic en un día para agregar periodos, vacaciones u otras
            actividades. Cambia entre mes, semana y día.
          </p>
        )}
      </div>
      <CalendarioAcademicoBoard
        institucionId={institucionId}
        consolidado={consolidado}
      />
    </Modal>
  );
}
