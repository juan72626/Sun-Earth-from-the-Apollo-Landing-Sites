import * as Astronomy from 'astronomy-engine';
import type {
  BodyKey, EclipseEvent, Ephemeris, LinkMode, MonthRow, NextEvent, Site, SiteStats, SolarPower, Vec3, WindowResult,
  TimeWindow,
} from '../types';

export const RAD = Math.PI / 180;
export const HR = 36e5;
export const DAY = 864e5;

export const dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export const dir = (b: number, l: number): Vec3 => {
  b *= RAD;
  l *= RAD;
  return [Math.cos(b) * Math.cos(l), Math.cos(b) * Math.sin(l), Math.sin(b)];
};

/** Un sitio con sus vectores locales: U (arriba), E (este), N (norte) en el marco selenográfico. */
export function makeSite(n: string, la: number, lo: number): Site {
  const p = la * RAD;
  const l = lo * RAD;
  return {
    n,
    la,
    lo,
    U: dir(la, lo),
    E: [-Math.sin(l), Math.cos(l), 0],
    N: [-Math.sin(p) * Math.cos(l), -Math.sin(p) * Math.sin(l), Math.cos(p)],
  };
}

/* ---------- Efemérides: un vector unitario (Sol y Tierra) por hora ---------- */
const cache = new Map<number, Ephemeris>();

export function eph(h: number): Ephemeris {
  let e = cache.get(h);
  if (e) return e;
  const d = new Date(h * HR);
  const L = Astronomy.Libration(d);
  const S = Astronomy.SunPosition(d);
  const T = (h * HR / DAY + 2440587.5 - 2451545) / 36525;
  const om = 125.0445 - 1934.1363 * T;
  e = {
    s: dir(1.54242 * Math.sin((S.elon - om) * RAD), 180 - (L.mlon - S.elon) + L.elon),
    e: dir(L.elat, L.elon),
  };
  cache.set(h, e);
  return e;
}

/** Interpola entre horas para obtener Sol y Tierra en el instante x (ms). */
export function at(x: number): Ephemeris {
  const h = Math.floor(x / HR);
  const f = x / HR - h;
  const a = eph(h);
  const b = eph(h + 1);
  const m = (u: Vec3, v: Vec3): Vec3 => {
    const q: Vec3 = [u[0] + (v[0] - u[0]) * f, u[1] + (v[1] - u[1]) * f, u[2] + (v[2] - u[2]) * f];
    const n = Math.hypot(q[0], q[1], q[2]);
    return [q[0] / n, q[1] / n, q[2] / n];
  };
  return { s: m(a.s, b.s), e: m(a.e, b.e) };
}

/* ---------- Geometría del cielo local ---------- */
export const el = (s: Site, v: Vec3): number => Math.asin(Math.max(-1, Math.min(1, dot(s.U, v)))) / RAD;
export const az = (s: Site, v: Vec3): number => (Math.atan2(dot(s.E, v), dot(s.N, v)) / RAD + 360) % 360;
/** Margen sobre la máscara de horizonte. k = 's' (Sol, borde superior +0,27°) o 'e' (Tierra). */
export const mg = (s: Site, v: Vec3, k: BodyKey, mk: number): number => el(s, v) + (k === 's' ? 0.27 : 0) - mk;

/** Elevación de la Tierra vista desde el relevo L2 (halo detrás de la Luna). */
export function elR(s: Site, v: Vec3): number {
  const p = [-35.4 * v[0], -35.4 * v[1], -35.4 * v[2]];
  const u = s.U;
  const x = p[0] - u[0];
  const y = p[1] - u[1];
  const z = p[2] - u[2];
  const d = Math.hypot(x, y, z);
  return Math.asin(Math.max(-1, Math.min(1, (x * u[0] + y * u[1] + z * u[2]) / d))) / RAD;
}

/** Próxima salida o puesta del Sol (k='s') o de la Tierra (k='e'). */
export function nextEvent(s: Site, k: BodyKey, t: number, mk: number): NextEvent {
  const g0 = mg(s, at(t)[k], k, mk);
  const up = g0 > 0;
  let tp = t;
  let gp = g0;
  let h = Math.floor(t / HR) + 1;
  for (let i = 0; i < 1080; i++, h++) {
    const g = mg(s, eph(h)[k], k, mk);
    const tt = h * HR;
    if (g > 0 !== up) return { up, t: tp + ((tt - tp) * gp) / (gp - g) - t };
    tp = tt;
    gp = g;
  }
  return { up };
}

/** Estadísticas de los próximos 30 días (720 h) para un sitio. */
export function stats(s: Site, t: number, mk: number): SiteStats {
  const h0 = Math.floor(t / HR);
  let a = 0, b = 0, c = 0, q = 0, rl = 0, lk = 0;
  let ms = -90, me = -90, dk = 0, mdk = 0, rn = 0, mrn = 0, rst = 0, bst = 0;
  for (let i = 0; i < 720; i++) {
    const e = eph(h0 + i);
    const x = el(s, e.s);
    const y = el(s, e.e);
    const u = x + 0.27 > mk;
    const w = y > mk;
    a += Number(u);
    b += Number(w);
    c += Number(u && w);
    q += Number(y < -1);
    const rv = elR(s, e.e) > mk;
    rl += Number(rv);
    lk += Number(w || rv);
    ms = Math.max(ms, x);
    me = Math.max(me, y);
    dk = u ? 0 : dk + 1;
    mdk = Math.max(mdk, dk);
    rn = u && w ? rn + 1 : 0;
    if (rn === 1) rst = i;
    if (rn > mrn) {
      mrn = rn;
      bst = rst;
    }
  }
  return {
    a: a / 7.2, b: b / 7.2, c: c / 7.2, q: q / 7.2, rl: rl / 7.2, lk: lk / 7.2,
    ms, me, bd: mdk, bb: mrn, bs: (h0 + bst) * HR,
  };
}

/** Potencia solar relativa: panel horizontal (seno) y vertical orientable (coseno). */
export function solarPower(s: Site, t: number, mk: number, x: number): SolarPower {
  const h0 = Math.floor(t / HR);
  let a = 0;
  let b = 0;
  for (let i = 0; i < 720; i++) {
    const y = el(s, eph(h0 + i).s);
    if (y > mk) {
      a += Math.sin(y * RAD);
      b += Math.cos(y * RAD);
    }
  }
  const up = x > mk;
  return {
    nowH: up ? Math.sin(x * RAD) * 100 : 0,
    nowV: up ? Math.cos(x * RAD) * 100 : 0,
    avgH: a / 7.2,
    avgV: b / 7.2,
  };
}

/* ---------- Eclipses de Sol por la Tierra ---------- */
export function sepS(s: Site, e: Ephemeris): number {
  const D = 221.25;
  const d = [D * e.e[0] - s.U[0], D * e.e[1] - s.U[1], D * e.e[2] - s.U[2]];
  const L = Math.hypot(d[0], d[1], d[2]);
  return Math.acos(Math.max(-1, Math.min(1, (d[0] * e.s[0] + d[1] * e.s[1] + d[2] * e.s[2]) / L))) / RAD;
}
export const sepC = (e: Ephemeris): number => Math.acos(Math.max(-1, Math.min(1, dot(e.s, e.e)))) / RAD;

export function findEclipses(s: Site, t: number, mk: number): EclipseEvent[] {
  const h0 = Math.floor(t / HR);
  const E: EclipseEvent[] = [];
  let i = 0;
  while (i < 2880) {
    if (sepC(eph(h0 + i)) < 3) {
      let j = i;
      while (j < 2880 && sepC(eph(h0 + j)) < 3) j++;
      let a: number | null = null, b: number | null = null, mn = 9, tm = 0, up = 0, n = 0;
      for (let x = (h0 + i - 2) * HR; x <= (h0 + j + 2) * HR; x += 3e5) {
        const v = at(x);
        const q = sepS(s, v);
        if (q < 1.22) {
          if (a === null) a = x;
          b = x;
          n++;
          if (el(s, v.s) + 0.27 > mk) up++;
          if (q < mn) {
            mn = q;
            tm = x;
          }
        }
      }
      if (a !== null && b !== null && b > t) E.push({ a, b, mn, tm, tot: mn < 0.68, up: up / n });
      i = j + 1;
    } else i++;
  }
  return E;
}

/* ---------- Recomendador: primera y mayor ventana continua ---------- */
export function findWindow(s: Site, days: number, lk: LinkMode, t: number, mk: number): WindowResult | null {
  const n = Math.round(days * 24);
  const h0 = Math.floor(t / HR);
  let r = 0, st = 0, f: TimeWindow | null = null, b: TimeWindow | null = null;
  for (let i = 0; i <= 2880; i++) {
    let ok = false;
    if (i < 2880) {
      const e = eph(h0 + i);
      ok = el(s, e.s) + 0.27 > mk && (lk === 2 || el(s, e.e) > mk || (lk === 1 && elR(s, e.e) > mk));
    }
    if (ok) {
      if (!r) st = i;
      r++;
    } else {
      if (r >= n) {
        const q: TimeWindow = { s: (h0 + st) * HR, d: r };
        if (!f) f = q;
        if (!b || q.d > b.d) b = q;
      }
      r = 0;
    }
  }
  return f && b ? { f, b } : null;
}

/* ---------- Calendario: horas por día de un mes ---------- */
export function monthRow(s: Site, y: number, m0: number, mo: number, mk: number): MonthRow {
  const st = Date.UTC(y, m0 + mo, 1);
  const en = Date.UTC(y, m0 + mo + 1, 1);
  const row: [number, number, number][] = [];
  for (let ms = st; ms < en; ms += DAY) {
    let a = 0, b = 0, c = 0;
    for (let k = 0; k < 24; k++) {
      const e = eph(Math.floor(ms / HR) + k);
      const u = el(s, e.s) + 0.27 > mk;
      const w = el(s, e.e) > mk;
      a += Number(u && w);
      b += Number(u);
      c += Number(w);
    }
    row.push([a / 24, b / 24, c / 24]);
  }
  return { st, row };
}

/** Punto de la Luna justo debajo del halo L2 (latitud y longitud). */
export function l2Point(e: Ephemeris): { la: number; lo: number } {
  return {
    la: Math.asin(-e.e[2]) / RAD,
    lo: Math.atan2(-e.e[1], -e.e[0]) / RAD,
  };
}
