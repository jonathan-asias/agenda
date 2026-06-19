'use client';

import type { ReactNode } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export interface EstudianteParaVista {
  id: number;
  nombres: string;
  apellidos: string;
  codigo_estudiantil: string;
  grado?: { nombre: string; nivel?: string };
  curso?: { nombre: string; jornada?: string | null };
  nombre_acudiente?: string;
  correo_acudiente?: string;
  telefono_acudiente?: string;
  activo?: boolean;
}

interface ViewEstudianteModalProps {
  isOpen: boolean;
  onClose: () => void;
  estudiante: EstudianteParaVista | null;
}

function InfoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-[var(--color-surface-nested)] rounded-lg p-4">
      <h3 className="text-base font-medium text-[var(--color-text-primary)] mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default function ViewEstudianteModal({ isOpen, onClose, estudiante }: ViewEstudianteModalProps) {
  if (!estudiante) return null;

  return (
    <Modal open={isOpen} onClose={onClose} title="Información del estudiante" size="lg">
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">Detalles completos del estudiante</p>

      <div className="space-y-4">
        <InfoBlock title="Información personal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-[var(--color-text-secondary)]">Nombres</span>
              <p className="text-[var(--color-text-primary)]">{estudiante.nombres}</p>
            </div>
            <div>
              <span className="font-medium text-[var(--color-text-secondary)]">Apellidos</span>
              <p className="text-[var(--color-text-primary)]">{estudiante.apellidos}</p>
            </div>
            <div>
              <span className="font-medium text-[var(--color-text-secondary)]">Código estudiantil</span>
              <p className="text-[var(--color-text-primary)]">{estudiante.codigo_estudiantil}</p>
            </div>
            <div>
              <span className="font-medium text-[var(--color-text-secondary)]">Estado</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  estudiante.activo !== false
                    ? 'bg-[var(--color-success-light)] text-[var(--color-success-text)]'
                    : 'bg-[var(--color-danger-light)] text-[var(--color-danger-text)]'
                }`}
              >
                {estudiante.activo !== false ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        </InfoBlock>

        <InfoBlock title="Información académica">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-[var(--color-text-secondary)]">Grado</span>
              <p className="text-[var(--color-text-primary)]">{estudiante.grado?.nombre || 'N/A'}</p>
              {estudiante.grado?.nivel && (
                <p className="text-xs text-[var(--color-text-secondary)]">{estudiante.grado.nivel}</p>
              )}
            </div>
            <div>
              <span className="font-medium text-[var(--color-text-secondary)]">Curso</span>
              <p className="text-[var(--color-text-primary)]">{estudiante.curso?.nombre || 'N/A'}</p>
              {estudiante.curso?.jornada && (
                <p className="text-xs text-[var(--color-text-secondary)]">Jornada: {estudiante.curso.jornada}</p>
              )}
            </div>
          </div>
        </InfoBlock>

        <InfoBlock title="Información del acudiente">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-[var(--color-text-secondary)]">Nombre</span>
              <p className="text-[var(--color-text-primary)]">{estudiante.nombre_acudiente ?? '—'}</p>
            </div>
            <div>
              <span className="font-medium text-[var(--color-text-secondary)]">Teléfono</span>
              <p className="text-[var(--color-text-primary)]">{estudiante.telefono_acudiente ?? '—'}</p>
            </div>
            {(estudiante.correo_acudiente ?? '').trim() !== '' && (
              <div className="md:col-span-2">
                <span className="font-medium text-[var(--color-text-secondary)]">Correo</span>
                <p className="text-[var(--color-text-primary)]">{estudiante.correo_acudiente}</p>
              </div>
            )}
          </div>
        </InfoBlock>
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t border-[var(--color-border-light)]">
        <Button type="button" variant="outline" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </Modal>
  );
}
