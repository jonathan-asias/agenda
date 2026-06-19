/**
 * Elimina campos sensibles de respuestas API (contraseñas, hashes).
 */

type WithPassword = { password?: string | null };

export function omitPassword<T extends WithPassword>(
  entity: T
): Omit<T, 'password'> {
  const { password: _removed, ...rest } = entity;
  return rest;
}

export function omitPasswordFromList<T extends WithPassword>(
  entities: T[]
): Omit<T, 'password'>[] {
  return entities.map(omitPassword);
}

type InstitucionWithAdmins = WithPassword & {
  administradores?: WithPassword[];
};

export function sanitizeInstitucionResponse<T extends InstitucionWithAdmins>(
  institucion: T
): Omit<T, 'password'> & {
  administradores?: Omit<NonNullable<T['administradores']>[number], 'password'>[];
} {
  const { password: _p, administradores, ...rest } = institucion;
  return {
    ...rest,
    ...(administradores != null
      ? { administradores: omitPasswordFromList(administradores) }
      : {}),
  } as Omit<T, 'password'> & {
    administradores?: Omit<NonNullable<T['administradores']>[number], 'password'>[];
  };
}
