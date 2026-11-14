import type { NextEvent } from '../types';

/** Un decimal con coma decimal y signo menos tipográfico. */
export const f1 = (x: number): string => x.toFixed(1).replace('.', ',').replace('-', '−');

/** Duración en ms → "35 min", "5 h 10 min" o "3 d 4 h". */
export const dur = (ms: number): string => {
  const m = Math.round(ms / 6e4);
  if (m < 60) return m + ' min';
  const h = Math.floor(m / 60);
  return h < 48 ? h + ' h ' + (m % 60) + ' min' : Math.floor(h / 24) + ' d ' + (h % 24) + ' h';
};

/** Fecha y hora UTC legible. */
export const fd = (ms: number): string =>
  new Date(ms).toLocaleString('es', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }) + ' UTC';

/** Etiqueta de la barra "luz y enlace". */
export const sem = (p: number): 'alta' | 'media' | 'baja' => (p >= 60 ? 'alta' : p >= 25 ? 'media' : 'baja');

/** Texto del próximo evento (salida/puesta) para las cajas de Sol y Tierra. */
export const evText = (o: NextEvent, w: string): string =>
  o.t == null
    ? `Sin ${o.up ? 'puesta' : 'salida'} en 45 días`
    : `${o.up ? 'Puesta' : 'Salida'} ${w} en ${dur(o.t)}`;
