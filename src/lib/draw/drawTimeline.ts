import { el, eph, HR, DAY } from '../astro';
import { ctx2d } from '../canvas';
import { fdate } from '../format';
import type { Lang } from '../../i18n/types';
import type { EclipseEvent, Site } from '../../types';

/**
 * Línea de tiempo de 30 días: curvas de elevación y franjas de ventanas operativas.
 * opts: { t, w0, mk, eclipses }
 */
export function drawTimeline(
  canvas: HTMLCanvasElement,
  s: Site,
  { t, w0, mk, eclipses }: { t: number; w0: number; mk: number; eclipses: EclipseEvent[] | null },
  lang: Lang = 'es',
): void {
  const g = ctx2d(canvas);
  const W = canvas.width, H = canvas.height;
  const n = 720, B = 62, h0 = w0 / HR;
  const E: [number, number][] = [];
  let lo = -6, hi = 6;
  for (let i = 0; i < n; i++) {
    const e = eph(h0 + i);
    const a = el(s, e.s), b = el(s, e.e);
    E.push([a, b]);
    lo = Math.min(lo, a, b);
    hi = Math.max(hi, a, b);
  }
  lo -= 2; hi += 2;
  const Y = (v: number): number => 12 + ((H - B - 34) * (hi - v)) / (hi - lo);
  const X = (i: number): number => (i / (n - 1)) * W;

  g.fillStyle = '#0b1020'; g.fillRect(0, 0, W, H);
  g.lineWidth = 2; g.strokeStyle = '#9097a8';
  g.beginPath(); g.moveTo(0, Y(0)); g.lineTo(W, Y(0)); g.stroke();
  if (mk > 0) {
    g.strokeStyle = '#ffb83d99'; g.setLineDash([10, 7]);
    g.beginPath(); g.moveTo(0, Y(mk)); g.lineTo(W, Y(mk)); g.stroke();
    g.setLineDash([]);
  }

  const curves: [0 | 1, string][] = [[0, '#ffb83d'], [1, '#4aa3ff']];
  curves.forEach(([k, col]) => {
    g.strokeStyle = col; g.lineWidth = 3; g.beginPath();
    E.forEach((a, i) => g[i ? 'lineTo' : 'moveTo'](X(i), Y(a[k])));
    g.stroke();
  });

  E.forEach((a, i) => {
    const u = a[0] + 0.27 > mk, v = a[1] > mk, x = X(i), w = W / n + 1, y = H - B + 2;
    if (u) { g.fillStyle = '#ffb83d'; g.fillRect(x, y, w, 14); }
    if (v) { g.fillStyle = '#4aa3ff'; g.fillRect(x, y + 18, w, 14); }
    if (u && v) { g.fillStyle = '#5fd7c8'; g.fillRect(x, y + 36, w, 14); }
  });

  g.font = '20px Jost,sans-serif'; g.fillStyle = '#98a2bd'; g.textAlign = 'left';
  g.fillText(Math.round(hi) + '°', 6, 26);
  g.fillText(Math.round(lo) + '°', 6, H - B - 40);
  for (let k = 0; k < 6; k++) {
    g.textAlign = k ? 'center' : 'left';
    g.fillText(
      fdate(w0 + k * 5 * DAY, lang),
      k ? ((k * 5 * DAY) / (n * HR)) * W : 6,
      H - B - 8,
    );
  }

  (eclipses || []).forEach((q) => {
    const x1 = ((q.a - w0) / (n * HR)) * W, x2 = ((q.b - w0) / (n * HR)) * W;
    if (x2 > 0 && x1 < W) {
      g.fillStyle = 'rgba(255,122,182,.38)';
      g.fillRect(Math.max(0, x1), 6, Math.max(3, x2 - x1), H - B - 40);
    }
  });

  const cx = ((t - w0) / (n * HR)) * W;
  g.strokeStyle = '#fff'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(cx, 6); g.lineTo(cx, H - 6); g.stroke();
}
