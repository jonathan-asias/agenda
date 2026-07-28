export type LandingSectionSlug =
  | 'inicio'
  | 'caracteristicas'
  | 'planes'
  | 'testimonios'
  | 'contacto';

export const LANDING_NAV_ITEMS: {
  slug: LandingSectionSlug;
  label: string;
  hash?: string;
  path?: string;
}[] = [
  { slug: 'inicio', label: 'Inicio', hash: '#inicio' },
  { slug: 'caracteristicas', label: 'Características', hash: '#caracteristicas' },
  { slug: 'planes', label: 'Planes', hash: '#planes' },
  { slug: 'testimonios', label: 'Testimonios', hash: '#testimonios' },
  { slug: 'contacto', label: 'Contacto', path: '/contacto' },
];

export function resolveLandingNavHref(
  item: (typeof LANDING_NAV_ITEMS)[number],
  pathname: string
): string {
  if (item.path) return item.path;
  if (!item.hash) return '/';
  return pathname === '/' ? item.hash : `/${item.hash}`;
}
