import type { Lang } from '@/lib/i18n';

/** Stamped into prerendered HTML and read during the hydration render. */
export interface GhurubiBoot {
  /** Path that was rendered, e.g. `/ar/city/riyadh` or `/` for the English homepage. */
  path: string;
  lang: Lang;
  /** ISO time the sun figures were calculated for. Cleared after the first live tick. */
  asOf: string;
}

type BootGlobal = typeof globalThis & { __GHURUBI__?: GhurubiBoot };

export function readBoot(): GhurubiBoot | null {
  const boot = (globalThis as BootGlobal).__GHURUBI__;
  if (!boot || typeof boot.path !== 'string' || typeof boot.lang !== 'string') return null;
  return boot;
}

export function normalizePath(path: string): string {
  if (!path) return '/';
  let value = path;
  try { value = decodeURIComponent(path); } catch { /* keep raw */ }
  if (value.length > 1 && value.endsWith('/')) value = value.slice(0, -1);
  return value || '/';
}
