import { useMemo } from 'react';
import { useLang } from './LangContext';
import { UI } from './ui';
import { DATA, siteDisplayName } from './data';
import { dur, f1, fd, fdate } from '../lib/format';
import type { Site } from '../types';

/** Todo lo necesario para mostrar la página en el idioma actual. */
export function useI18n() {
  const { lang, setLang } = useLang();
  return useMemo(
    () => ({
      lang,
      setLang,
      /** Textos de la interfaz. */
      ui: UI[lang],
      /** Datos mockeados (fichas, satélites, listas de contenido). */
      data: DATA[lang],
      /** Nombre mostrado de un sitio. */
      siteName: (s: Site | string): string => siteDisplayName(typeof s === 'string' ? s : s.n, lang),
      /** Formateadores según el idioma. */
      fmt: {
        f1: (x: number) => f1(x, lang),
        fd: (ms: number) => fd(ms, lang),
        fdate: (ms: number) => fdate(ms, lang),
        dur,
      },
    }),
    [lang, setLang],
  );
}
