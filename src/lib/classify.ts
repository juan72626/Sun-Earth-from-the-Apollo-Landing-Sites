import { I, LVC } from '../data/siteInfo';
import { DATA } from '../i18n/data';
import type { Lang } from '../i18n/types';
import type { Site, SiteInfo, SiteLevel } from '../types';

const info = (s: Site): SiteInfo | undefined => I[s.n];

/* Clasificación de aterrizaje (ok, wn, bad, na) y bandera de candidato de cada sitio. */
export const OKS = (s: Site): SiteLevel => info(s)?.[0] ?? 'na';
export const ptCol0 = (s: Site): string => LVC[OKS(s)];
export const isCand = (s: Site): boolean => !!info(s)?.[1];
export const ptCol = (s: Site): string => (isCand(s) ? '#b48cff' : ptCol0(s));
export const lvName = (s: Site, lang: Lang = 'es'): string => DATA[lang].LV[OKS(s)][0];
export const catName = (s: Site, lang: Lang = 'es', candidate = 'Candidato'): string => (isCand(s) ? candidate : lvName(s, lang));

/** Filtro "Mostrar" de la tabla, el mapa y el globo. */
export const passesFilter = (s: Site, m: number): boolean =>
  m === 0 ||
  (m === 1 && OKS(s) === 'ok') ||
  (m === 2 && isCand(s)) ||
  (m === 3 && Math.abs(s.lo) > 90);

/** Filtro del recomendador. */
export const recoFilter = (s: Site, m: number): boolean => {
  const lv = OKS(s);
  const cand = isCand(s);
  return (
    m === 0 ||
    (m === 1 && lv === 'ok' && !cand) ||
    (m === 2 && !cand && (lv === 'ok' || lv === 'wn')) ||
    (m === 3 && cand)
  );
};
