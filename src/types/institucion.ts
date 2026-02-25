/**
 * Tipos de dominio para Institucion.
 */

import type { Sede } from '@/types/sede';

export interface InstitucionAdministrador {
  id: number;
  nombre: string;
  apellido: string;
  correo?: string;
  email?: string;
  telefono?: string;
  cargo: string;
  sede_id?: number | null;
}

export interface Institucion {
  id: number;
  nombre: string;
  email?: string;
  direccion_principal?: string;
  nit?: string;
  nombre_contacto?: string;
  telefono_contacto?: string;
  color_primario?: string | null;
  tiene_sedes?: boolean;
  jornadas?: string[];
  created_at?: string;
  sedes?: Sede[];
  administradores?: InstitucionAdministrador[];
}
