import * as contentEs from '../data/content';
import * as contentEn from '../data/en/content';
import { I as I_ES, LV as LV_ES, DEFAULT_INFO as DEFAULT_ES } from '../data/siteInfo';
import { I as I_EN, LV as LV_EN, DEFAULT_INFO as DEFAULT_EN } from '../data/en/siteInfo';
import { SAT as SAT_ES } from '../data/satellites';
import { SAT_TEXTS_EN } from '../data/en/satellites';
import { SITE_NAMES_EN } from '../data/en/siteNames';
import type { Lang } from './types';
import type { Satellite, SiteInfo, SiteLevel } from '../types';

/** Datos (mock) localizados que usan los componentes. */
export interface LocalData {
  NAV_ITEMS: [id: string, label: string][];
  COLOR_KEY: [color: string, label: string][];
  ZONE_OK: string[];
  ZONE_BAD: string[];
  LROC_LINKS: [href: string, label: string][];
  RELAY_TIPS: string[];
  RESEARCH: string[];
  SOURCES: string[];
  FOOTER_NOTE: string;
  I: Record<string, SiteInfo>;
  LV: Record<SiteLevel, [name: string, color: string]>;
  DEFAULT_INFO: SiteInfo;
  SAT: Satellite[];
}

const SAT_EN: Satellite[] = SAT_ES.map((s) => ({ ...s, ...SAT_TEXTS_EN[s.n] }));

export const DATA: Record<Lang, LocalData> = {
  es: { ...contentEs, I: I_ES, LV: LV_ES, DEFAULT_INFO: DEFAULT_ES, SAT: SAT_ES },
  en: { ...contentEn, I: I_EN, LV: LV_EN, DEFAULT_INFO: DEFAULT_EN, SAT: SAT_EN },
};

/**
 * Nombre que se muestra de un sitio. El nombre en español (`Site.n`) es la clave interna;
 * aquí solo se traduce para mostrarlo.
 */
export function siteDisplayName(n: string, lang: Lang): string {
  if (lang === 'en') {
    if (SITE_NAMES_EN[n]) return SITE_NAMES_EN[n];
    const m = /^Personalizado (\d+)$/.exec(n);
    if (m) return `Custom ${m[1]}`;
  }
  return n;
}
