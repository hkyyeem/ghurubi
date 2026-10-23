import type { Lang } from '@/lib/i18n';

/** Kept out of the page modules so the footer can link to them without loading those routes. */
export const ABOUT_LABEL: Record<Lang, string> = { ar: 'عن غروبي', en: 'About', tr: 'Hakkında', he: 'אודות' };
export const WEAR_LABEL: Record<Lang, string> = { ar: 'ساعة Wear OS', en: 'Wear OS', tr: 'Wear OS', he: 'Wear OS' };
