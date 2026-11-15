import { es } from './ui.es';
import { en } from './ui.en';
import type { Dict } from './ui.es';
import type { Lang } from './types';

export type { Dict };

/** Diccionarios de interfaz por idioma. */
export const UI: Record<Lang, Dict> = { es, en };
