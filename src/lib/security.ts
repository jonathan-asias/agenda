/**
 * Helpers de seguridad multi-tenant.
 * Evitan acceso cruzado entre instituciones.
 */

/**
 * Verifica que el usuario tenga acceso a la institución de la ruta.
 * Usado por InstitucionAuthGuard, AdminAuthGuard y DocenteAuthGuard.
 * Devuelve true solo cuando userInstitutionId === routeInstitutionId (comparación numérica).
 */
export function verifyInstitutionAccess(
  userInstitutionId: number | null | undefined,
  routeInstitutionId: string | number | null | undefined
): boolean {
  if (userInstitutionId == null || userInstitutionId === undefined) return false;
  if (routeInstitutionId == null || routeInstitutionId === undefined) return false;
  const routeId = typeof routeInstitutionId === 'string' ? parseInt(routeInstitutionId, 10) : routeInstitutionId;
  if (Number.isNaN(routeId)) return false;
  return userInstitutionId === routeId;
}
