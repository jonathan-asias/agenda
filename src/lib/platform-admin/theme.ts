export type PlatformThemePreference = 'light' | 'dark' | 'system';

export const PLATFORM_THEME_STORAGE_KEY = 'gestion-vortico-theme';

export function isPlatformThemePreference(
  value: string | null | undefined
): value is PlatformThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function readPlatformThemePreference(): PlatformThemePreference {
  if (typeof window === 'undefined') return 'dark';
  try {
    const raw = localStorage.getItem(PLATFORM_THEME_STORAGE_KEY);
    if (isPlatformThemePreference(raw)) return raw;
  } catch {
    // ignore
  }
  return 'dark';
}

export function writePlatformThemePreference(preference: PlatformThemePreference): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PLATFORM_THEME_STORAGE_KEY, preference);
  } catch {
    // ignore
  }
}

export function resolvePlatformTheme(
  preference: PlatformThemePreference
): 'light' | 'dark' {
  if (preference === 'light' || preference === 'dark') return preference;
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
