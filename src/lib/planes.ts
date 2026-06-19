export const PLAN_BASICO_NOMBRE = 'Plan Básico';
export const PLAN_PLUS_NOMBRE = 'Plan Plus';

export const PLAN_SEED_DATA = [
  {
    nombre: PLAN_BASICO_NOMBRE,
    precio: 1_500,
    push: false,
    whatsapp: false,
    email: true,
    activo: true,
  },
  {
    nombre: PLAN_PLUS_NOMBRE,
    precio: 2_000,
    push: true,
    whatsapp: true,
    email: true,
    activo: true,
  },
] as const;
