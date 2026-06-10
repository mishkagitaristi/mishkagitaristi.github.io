import { isPlatformBrowser } from '@angular/common';

export function readStoredValue<T extends string>(
  key: string,
  valid: readonly T[],
  fallback: T,
  platformId: object,
): T {
  if (!isPlatformBrowser(platformId)) {
    return fallback;
  }

  const stored = localStorage.getItem(key);
  return valid.includes(stored as T) ? (stored as T) : fallback;
}

export function writeStoredValue(key: string, value: string, platformId: object): void {
  if (isPlatformBrowser(platformId)) {
    localStorage.setItem(key, value);
  }
}
