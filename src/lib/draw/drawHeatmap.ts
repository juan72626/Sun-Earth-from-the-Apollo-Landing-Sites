import { DAY } from '../astro';
import { ctx2d } from '../canvas';
import type { HeatMode, MonthRow } from '../../types';

const W0 = 720, H0 = 460, L0 = 70, T0 = 34;
export const HM = { W: W0, H: H0, L: L0, T: T0, cw: (W0 - L0 - 10) / 31, ch: (H0 - T0 - 10) / 12 };

/** Calendario de 12 meses: cada casilla es un día; más claro = más horas. mode: 0 ambos, 1 Sol, 2 Tierra. */
export function drawHeatmap(canvas: HTMLCanvasElement, data: MonthRow[], mode: HeatMode, t: number): void {
  const g = ctx2d(canvas);
  const { W, H, L, T, cw, ch } = HM;
  g.fillStyle = '#0b1020'; g.fillRect(0, 0, W, H);
  g.font = '18px Jost,sans-serif'; g.textAlign = 'center'; g.fillStyle = '#98a2bd';
  for (let d = 1; d <= 31; d += d === 1 ? 4 : 5) g.fillText(String(d), L + (d - 0.5) * cw, 22);

  data.forEach((r, i) => {
    g.textAlign = 'right'; g.fillStyle = '#98a2bd';
    g.fillText(
      new Date(r.st).toLocaleDateString('es', { month: 'short', year: '2-digit', timeZone: 'UTC' }),
      L - 8, T + (i + 0.62) * ch,
    );
    r.row.forEach((v, j) => {
      const f = v[mode], x = L + j * cw, y = T + i * ch;
      g.fillStyle = `rgb(${16 + Math.round(79 * f)},${22 + Math.round(193 * f)},${42 + Math.round(158 * f)})`;
      g.fillRect(x + 1, y + 1, cw - 2, ch - 2);
      if (r.st + j * DAY <= t && t < r.st + (j + 1) * DAY) {
        g.strokeStyle = '#fff'; g.lineWidth = 3;
        g.strokeRect(x + 1.5, y + 1.5, cw - 3, ch - 3);
      }
    });
  });
}
