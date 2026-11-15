import type { Lang } from '../i18n/types';

const LOCALE: Record<Lang, string> = { es: 'es', en: 'en-US' };
const DECIMAL: Record<Lang, string> = { es: ',', en: '.' };

/** Locale de `toLocale*String` para cada idioma. */
export const localeOf = (lang: Lang): string => LOCALE[lang];

/** Un número con el separador decimal del idioma. */
export const dec = (x: string, lang: Lang = 'es'): string => x.replace('.', DECIMAL[lang]);

/** Un decimal con el separador del idioma y signo menos tipográfico. */
export const f1 = (x: number, lang: Lang = 'es'): string => dec(x.toFixed(1), lang).replace('-', '−');

/** Duración en ms → "35 min", "5 h 10 min" o "3 d 4 h". (Igual en español e inglés.) */
export const dur = (ms: number): string => {
  const m = Math.round(ms / 6e4);
  if (m < 60) return m + ' min';
  const h = Math.floor(m / 60);
  return h < 48 ? h + ' h ' + (m % 60) + ' min' : Math.floor(h / 24) + ' d ' + (h % 24) + ' h';
};

/** Fecha y hora UTC legible. */
export const fd = (ms: number, lang: Lang = 'es'): string =>
  new Date(ms).toLocaleString(LOCALE[lang], {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: 'UTC',
  }) + ' UTC';

/** Solo día y mes (UTC). */
export const fdate = (ms: number, lang: Lang = 'es'): string =>
  new Date(ms).toLocaleDateString(LOCALE[lang], { day: 'numeric', month: 'short', timeZone: 'UTC' });
