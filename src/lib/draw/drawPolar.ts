import { RAD, el } from '../astro';
import { ptCol, isCand } from '../classify';
import { ctx2d } from '../canvas';
import { dec } from '../format';
import { UI } from '../../i18n/ui';
import type { Lang } from '../../i18n/types';
import type { Ephemeris, Site } from '../../types';

export const POLAR_W = 720;
const C = POLAR_W / 2;
const R = C - 58;
const P = (r: number, l: number): [number, number] => [C + r * Math.sin(l * RAD), C - r * Math.cos(l * RAD)];

/** Posición de un sitio en el mapa: real (x0,y0), dibujada (x,y) y distancia al polo en grados (r). */
export interface PolarPoint {
  i: number;
  x0: number;
  y0: number;
  x: number;
  y: number;
  r: number;
}

/**
 * Posiciona los sitios dentro del radio S (grados). Si dos quedan muy juntos se separan
 * un poco; (x0,y0) es su lugar real y (x,y) donde se dibuja el número.
 */
export function layoutPolar(sites: Site[], S: number, vis: (s: Site) => boolean): PolarPoint[] {
  const pts: PolarPoint[] = [];
  sites.forEach((s, i) => {
    if (s.la > -90 + S || !vis(s)) return;
    const q = P(((s.la + 90) / S) * R, s.lo);
    pts.push({ i, x0: q[0], y0: q[1], x: q[0], y: q[1], r: s.la + 90 });
  });
  pts.sort((p, q) => p.r - q.r);
  pts.forEach((p, n) => {
    for (let it = 0; it < 16; it++) {
      let mv = false;
      for (let m = 0; m < n; m++) {
        const o = pts[m];
        const dx = p.x - o.x, dy = p.y - o.y, d = Math.hypot(dx, dy);
        if (d < 36) {
          const u = d < 1
            ? [Math.sin(sites[p.i].lo * RAD), -Math.cos(sites[p.i].lo * RAD)]
            : [dx / d, dy / d];
          p.x += u[0] * (36 - d) * 0.7 + (d < 1 ? 1 : 0);
          p.y += u[1] * (36 - d) * 0.7;
          mv = true;
        }
      }
      if (!mv) break;
    }
  });
  return pts;
}

const lab = (g: CanvasRenderingContext2D, t: string, x: number, y: number, col?: string): void => {
  const w = g.measureText(t).width + 14;
  g.fillStyle = 'rgba(7,10,18,.85)'; g.fillRect(x - w / 2, y - 18, w, 26);
  g.fillStyle = col || '#c9d1e8'; g.fillText(t, x, y);
};

/** Mapa del polo sur visto desde arriba. */
export function drawPolar(
  canvas: HTMLCanvasElement,
  { e, mk, S, foc, pts, sites, lang = 'es', name = (s) => s.n }: {
    e: Ephemeris; mk: number; S: number; foc: number; pts: PolarPoint[]; sites: Site[];
    /** Idioma de las etiquetas dibujadas y función que da el nombre mostrado de cada sitio. */
    lang?: Lang; name?: (s: Site) => string;
  },
): void {
  const cv = UI[lang].canvas;
  const g = ctx2d(canvas);
  const W = canvas.width;
  const po = sites[0];
  const xs = el(po, e.s), xe = el(po, e.e);
  const su = xs + 0.27 > mk, eu = xe > mk;
  const ls = Math.atan2(e.s[1], e.s[0]) / RAD;
  const le = Math.atan2(e.e[1], e.e[0]) / RAD;

  g.fillStyle = '#070a12'; g.fillRect(0, 0, W, W);
  g.save(); g.beginPath(); g.arc(C, C, R, 0, 7); g.clip();
  g.fillStyle = '#10162a'; g.fillRect(0, 0, W, W);
  const a = P(R, ls), b = P(R, ls + 180);
  const gr = g.createLinearGradient(a[0], a[1], b[0], b[1]);
  const k = su ? 1 : 0.35;
  gr.addColorStop(0, `rgba(255,184,61,${0.36 * k})`);
  gr.addColorStop(0.5, `rgba(255,184,61,${0.07 * k})`);
  gr.addColorStop(1, 'rgba(0,0,0,.55)');
  g.fillStyle = gr; g.fillRect(0, 0, W, W); g.restore();

  g.lineWidth = 2; g.strokeStyle = '#2a3350';
  g.beginPath(); g.arc(C, C, R, 0, 7); g.stroke();
  g.strokeStyle = '#1c2440';
  for (let l = 0; l < 360; l += 30) {
    const q = P(R, l);
    g.beginPath(); g.moveTo(C, C); g.lineTo(q[0], q[1]); g.stroke();
  }

  g.font = '20px Jost,sans-serif'; g.textAlign = 'center';
  const st = S / 5;
  for (let j = 1; j <= 4; j++) {
    g.strokeStyle = '#2a3350';
    g.beginPath(); g.arc(C, C, (R * j) / 5, 0, 7); g.stroke();
    const q = P((R * j) / 5, 45);
    lab(g, dec((90 - st * j).toFixed(S < 5 ? 1 : 0), lang) + '°S', q[0] + 6, q[1] - 4, '#98a2bd');
  }

  if (S > 6) {
    g.setLineDash([12, 9]); g.strokeStyle = '#b48cff'; g.lineWidth = 3;
    g.beginPath(); g.arc(C, C, (R * 6) / S, 0, 7); g.stroke();
    g.setLineDash([]);
    const q = P((R * 6) / S, 300);
    lab(g, cv.artemisLimit, q[0], q[1], '#b48cff');
  }

  const meridians: [number, string][] = [[0, cv.meridians[0]], [90, cv.meridians[1]], [180, cv.meridians[2]], [270, cv.meridians[3]]];
  meridians.forEach(([l, n]) => {
    const q = P(R + 30, l);
    lab(g, n, q[0], q[1] + 7, '#98a2bd');
  });

  const bodies: [number, string, string, boolean][] = [[ls, '#ffb83d', cv.sun, su], [le, '#4aa3ff', cv.earth, eu]];
  bodies.forEach(([l, col, n, up]) => {
    const lr = l * RAD;
    const q = P(R * 0.82, l), h = P(R * 0.82 + 24, l), u = P(R * 0.82 + 46, l);
    const cs = Math.cos(lr) * 14, sn = Math.sin(lr) * 14;
    g.globalAlpha = up ? 1 : 0.4; g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 7;
    g.beginPath(); g.moveTo(C, C); g.lineTo(q[0], q[1]); g.stroke();
    g.beginPath(); g.moveTo(h[0], h[1]); g.lineTo(q[0] + cs, q[1] + sn); g.lineTo(q[0] - cs, q[1] - sn); g.fill();
    lab(g, n, u[0], u[1] + 7, col);
    g.globalAlpha = 1;
  });

  pts.forEach((p, n) => {
    const s = sites[p.i];
    const f = p.i === foc;
    const col = ptCol(s);
    if (Math.hypot(p.x - p.x0, p.y - p.y0) > 4) {
      g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(p.x0, p.y0); g.lineTo(p.x, p.y); g.stroke();
      g.fillStyle = '#fff';
      g.beginPath(); g.arc(p.x0, p.y0, 3.5, 0, 7); g.fill();
    }
    g.beginPath(); g.arc(p.x, p.y, f ? 20 : 16, 0, 7); g.fillStyle = col; g.fill();
    g.lineWidth = f ? 5 : 2; g.strokeStyle = f ? '#fff' : '#0b1020'; g.stroke();
    g.fillStyle = '#0d1019'; g.font = 'bold 19px Jost,sans-serif';
    g.fillText(String(n + 1), p.x, p.y + 7);
  });

  g.font = '20px Jost,sans-serif';
  pts.forEach((p) => {
    if (p.i === foc) lab(g, name(sites[p.i]), Math.max(110, Math.min(W - 110, p.x)), p.y - 30, '#fff');
  });
  lab(g, cv.radius(S, Math.round(S * 30.32)), W - 110, 30, '#98a2bd');
}

/** Texto bajo el mapa: alturas del Sol y la Tierra en el polo. */
export function poleSummary(e: Ephemeris, sites: Site[]): { xs: number; xe: number } {
  const po = sites[0];
  return { xs: el(po, e.s), xe: el(po, e.e) };
}

export { isCand };
