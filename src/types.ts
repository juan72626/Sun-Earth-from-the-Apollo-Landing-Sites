/** Tipos compartidos de todo el proyecto. */

/** Vector 3D (normalmente unitario) en el marco selenográfico. */
export type Vec3 = [number, number, number];

/** Un sitio con sus vectores locales: U (arriba), E (este), N (norte). */
export interface Site {
  n: string;
  la: number;
  lo: number;
  U: Vec3;
  E: Vec3;
  N: Vec3;
}

/** Direcciones unitarias al Sol (s) y a la Tierra (e) vistas desde el centro de la Luna. */
export interface Ephemeris {
  s: Vec3;
  e: Vec3;
}

/** 's' = Sol, 'e' = Tierra. */
export type BodyKey = 's' | 'e';

/** Próxima salida o puesta; `t` (ms desde ahora) falta si no ocurre en el horizonte de búsqueda. */
export interface NextEvent {
  up: boolean;
  t?: number;
}

/** Estadísticas de 30 días (porcentajes 0–100 salvo ms/me en grados y bd/bb en horas). */
export interface SiteStats {
  a: number;
  b: number;
  c: number;
  q: number;
  rl: number;
  lk: number;
  ms: number;
  me: number;
  bd: number;
  bb: number;
  bs: number;
}

export interface SolarPower {
  nowH: number;
  nowV: number;
  avgH: number;
  avgV: number;
}

export interface EclipseEvent {
  a: number;
  b: number;
  mn: number;
  tm: number;
  tot: boolean;
  up: number;
}

/** Ventana continua: inicio (ms) y duración (horas). */
export interface TimeWindow {
  s: number;
  d: number;
}

export interface WindowResult {
  /** Primera ventana. */
  f: TimeWindow;
  /** Mayor ventana. */
  b: TimeWindow;
}

/** Un mes del calendario: inicio (ms) y, por día, fracción [Sol y Tierra, Sol, Tierra]. */
export interface MonthRow {
  st: number;
  row: [number, number, number][];
}

/** Enlace requerido en el recomendador: 0 Tierra directa, 1 directa o relevo L2, 2 sin enlace. */
export type LinkMode = 0 | 1 | 2;

/** Qué muestra el calendario: 0 ambos, 1 Sol, 2 Tierra. */
export type HeatMode = 0 | 1 | 2;

/** Clasificación de aterrizaje: seguro, precaución, no seguro, sin clasificar. */
export type SiteLevel = 'ok' | 'wn' | 'bad' | 'na';

/** Ficha de un sitio. */
export type SiteInfo = [
  level: SiteLevel,
  candidate: 0 | 1,
  when: string,
  who: string,
  what: string,
  why: string,
];

/** Ficha abierta abajo: un sitio o un satélite (índice en su lista). */
export interface SheetState {
  type: 'site' | 'sat';
  i: number;
}

/** Elementos orbitales ilustrativos (radios en radios lunares, ángulos en grados). */
export interface OrbitElements {
  sa: number;
  e: number;
  i: number;
  om: number;
  w: number;
}

interface SatelliteBase {
  n: string;
  o: string;
  y: string;
  c: string;
  d: string;
  ap: string;
  ob: string;
  /** Periodo en horas. */
  per: number;
}

/** Satélite en órbita kepleriana en torno a la Luna. */
export interface OrbitingSatellite extends SatelliteBase, OrbitElements {
  l2?: undefined;
}

/** Satélite de relevo en halo en torno al punto L2 (`sa` = distancia, en radios lunares). */
export interface L2Satellite extends SatelliteBase {
  l2: 1;
  sa: number;
}

export type Satellite = OrbitingSatellite | L2Satellite;

/** Parámetros de la ilustración de un satélite. */
export interface SatIllustration {
  bc: string;
  bw: number;
  bh: number;
  pl: number;
  pn: number;
  dr: number;
}
