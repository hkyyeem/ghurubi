import { useEffect, useState } from 'react';
import { readBoot } from '@/lib/boot';

export function useStoredState<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(() => {
    // Prerendered HTML used the default. Apply a saved value after hydration.
    if (typeof window === 'undefined' || readBoot()) return initial;
    try {
      const s = localStorage.getItem(key);
      return s ? (JSON.parse(s) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    if (!readBoot()) return;
    try {
      const s = localStorage.getItem(key);
      if (s != null) setV(JSON.parse(s) as T);
    } catch { /* ignore */ }
  }, [key]);
  const set = (n: T) => {
    setV(n);
    try { localStorage.setItem(key, JSON.stringify(n)); } catch { /* ignore */ }
  };
  return [v, set] as const;
}
