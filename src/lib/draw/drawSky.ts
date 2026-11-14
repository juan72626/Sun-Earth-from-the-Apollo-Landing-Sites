import { el, az } from '../astro';
import { ctx2d } from '../canvas';
import type { BodyKey, Ephemeris, Site, Vec3 } from '../../types';

/** Vista del horizonte: azimut en horizontal, elevación en vertical. */
export function drawSky(canvas: HTMLCanvasElement, s: Site, e: Ephemeris, mk: number): void {
  const g = ctx2d(canvas);
  const W = canvas.width, H = canvas.height;
  const xs = el(s, e.s), xe = el(s, e.e);
  const top = Math.max(14, xs + 8, xe + 8);
  const Y = (v: number): number => (H * (top - v)) / (top + 8);
  const y0 = Y(0);

  const gr = g.createLinearGradient(0, 0, 0, y0);
  gr.addColorStop(0, '#04060d');
  gr.addColorStop(1, '#1c2640');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.fillStyle = '#14171f'; g.fillRect(0, y0, W, H - y0);
  g.fillStyle = '#9097a8'; g.fillRect(0, y0 - 1, W, 2);

  if (mk > 0) {
    g.strokeStyle = '#ffb83d99'; g.lineWidth = 2; g.setLineDash([10, 7]);
    g.beginPath(); g.moveTo(0, Y(mk)); g.lineTo(W, Y(mk)); g.stroke();
    g.setLineDash([]);
  }

  g.font = '22px Jost,sans-serif'; g.textAlign = 'center'; g.fillStyle = '#98a2bd';
  const cardinals: [string, number][] = [['N', 14], ['E', W / 4], ['S', W / 2], ['O', W * 0.75], ['N', W - 14]];
  cardinals.forEach(([l, x]) => g.fillText(l, x, H - 8));

  const bodies: [Vec3, BodyKey][] = [[e.s, 's'], [e.e, 'e']];
  bodies.forEach(([v, k]) => {
    const E = el(s, v);
    const x = (az(s, v) / 360) * W;
    const u = E + (k === 's' ? 0.27 : 0) > mk;
    const y = Math.min(Y(E), H - 40);
    g.globalAlpha = u ? 1 : 0.4;
    g.shadowBlur = 0;
    if (k === 's') {
      g.shadowColor = '#ffb83d'; g.shadowBlur = u ? 26 : 0; g.fillStyle = '#ffc94d';
    } else {
      const r = g.createRadialGradient(x - 4, y - 4, 2, x, y, 12);
      r.addColorStop(0, '#9fd2ff'); r.addColorStop(1, '#1d5fc4'); g.fillStyle = r;
    }
    g.beginPath(); g.arc(x, y, k === 's' ? 13 : 11, 0, 7); g.fill();
    g.shadowBlur = 0; g.fillStyle = '#eef1fb';
    g.fillText(k === 's' ? 'Sol' : 'Tierra', x, y - 20);
    g.globalAlpha = 1;
  });
}
