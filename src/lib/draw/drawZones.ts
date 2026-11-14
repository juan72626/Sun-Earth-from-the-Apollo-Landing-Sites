import { RAD } from '../astro';
import { ctx2d } from '../canvas';

function lander(g: CanvasRenderingContext2D, x: number, y: number, ang: number, s: number): void {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
  g.strokeStyle = '#c9d1e8'; g.lineWidth = 3;
  g.beginPath();
  g.moveTo(-12, -16); g.lineTo(-28, 0); g.moveTo(12, -16); g.lineTo(28, 0);
  g.moveTo(-6, -14); g.lineTo(-10, 0); g.moveTo(6, -14); g.lineTo(10, 0);
  g.stroke();
  g.fillStyle = '#d8b24e'; g.fillRect(-18, -40, 36, 26);
  g.strokeStyle = '#2a2110'; g.lineWidth = 2; g.strokeRect(-18, -40, 36, 26);
  g.fillStyle = '#8d9bbd';
  g.beginPath(); g.moveTo(-6, -14); g.lineTo(6, -14); g.lineTo(9, -6); g.lineTo(-9, -6); g.fill();
  g.fillStyle = '#eef2ff';
  [-28, 28].forEach((fx) => { g.beginPath(); g.ellipse(fx, 1, 7, 2.5, 0, 0, 7); g.fill(); });
  g.restore();
}

/** Dibujo animado: módulo bajando a una zona apta (bad=false) o peligrosa (bad=true). ph ∈ [0,1). */
export function zoneScene(canvas: HTMLCanvasElement, bad: boolean, ph: number): void {
  const g = ctx2d(canvas);
  const W = canvas.width, H = canvas.height;
  const gy = H * 0.74, tn = Math.tan(25 * RAD);
  const T = (x: number): number =>
    bad
      ? x < W * 0.3 ? gy : x < W * 0.62 ? gy - (x - W * 0.3) * tn : gy - W * 0.32 * tn + 4 * Math.sin(x / 30)
      : gy + (x - W / 2) * 0.052 + 4 * Math.sin(x / 40);

  g.fillStyle = '#04060c'; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 45; i++) {
    g.fillStyle = 'rgba(255,255,255,' + (0.25 + ((i * 37) % 7) / 12) + ')';
    g.fillRect((i * 149) % W, (i * 83) % (H * 0.55), 2, 2);
  }

  const sx = W * 0.1, sy = bad ? gy - 8 : gy - H * 0.3;
  g.fillStyle = '#ffc94d'; g.shadowColor = '#ffb83d'; g.shadowBlur = 20;
  g.beginPath(); g.arc(sx, sy, 14, 0, 7); g.fill(); g.shadowBlur = 0;

  g.font = '20px Jost,sans-serif'; g.textAlign = 'center';
  if (!bad) {
    g.fillStyle = '#4aa3ff';
    g.beginPath(); g.arc(W * 0.86, H * 0.2, 16, 0, 7); g.fill();
    g.fillStyle = '#eef1fb'; g.fillText('Tierra a la vista', W * 0.86, H * 0.2 + 40);
  }

  const gr = g.createLinearGradient(0, gy - 120, 0, H);
  gr.addColorStop(0, '#5a5f6d'); gr.addColorStop(1, '#1a1d25');
  g.fillStyle = gr; g.beginPath(); g.moveTo(0, H);
  for (let x = 0; x <= W; x += 6) g.lineTo(x, T(x));
  g.lineTo(W, H); g.closePath(); g.fill();
  g.strokeStyle = '#9aa1b3'; g.lineWidth = 2; g.beginPath();
  for (let x = 0; x <= W; x += 6) g[x ? 'lineTo' : 'moveTo'](x, T(x));
  g.stroke();

  const rocks: [number, number][] = bad
    ? [[70, 16], [150, 12], [250, 18], [310, 14], [400, 11], [470, 17], [560, 13], [640, 19]]
    : [[90, 4], [230, 5], [560, 4], [650, 5]];
  rocks.forEach(([x, r]) => {
    const y = T(x);
    if (bad) {
      g.fillStyle = 'rgba(0,0,0,.6)';
      g.beginPath(); g.ellipse(x + r * 2.6, y - 1, r * 2.6, 3, 0, 0, 7); g.fill();
    }
    g.fillStyle = bad ? '#7b8093' : '#7d8294';
    g.beginPath(); g.ellipse(x, y - r * 0.6, r, r * 0.75, 0, 0, 7); g.fill();
  });

  const lx = W * 0.5, ly = T(lx);
  const a = Math.min(1, Math.max(0, ph / 0.5));
  const ground = ph >= 0.5;
  const yo = ground ? 0 : -(1 - a) * H * 0.5;
  const tilt = bad && ground ? -Math.min(1, (ph - 0.5) / 0.2) * 1.15 : 0;
  if (ground && ph < 0.72) {
    const u = (ph - 0.5) / 0.22;
    for (let k = 0; k < 16; k++) {
      const an = Math.PI * (k / 15), r = u * 70;
      g.fillStyle = 'rgba(205,205,215,' + 0.55 * (1 - u) + ')';
      g.beginPath();
      g.arc(lx + Math.cos(an) * r * (k % 2 ? 1 : -1) * 1.2, ly - 4 - Math.sin(an) * r * 0.35, 5 + u * 6, 0, 7);
      g.fill();
    }
  }
  lander(g, lx, ly + yo, tilt, 1.6);

  const th = bad ? 25 : 3, ax = W * 0.08, ay = H * 0.93, L = 130, col = bad ? '#ff4d4d' : '#34d65a';
  g.setLineDash([6, 5]); g.strokeStyle = '#c9d1e8'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(ax, ay); g.lineTo(ax + L, ay); g.stroke(); g.setLineDash([]);
  g.strokeStyle = col; g.lineWidth = 4;
  g.beginPath(); g.moveTo(ax, ay); g.lineTo(ax + L * Math.cos(th * RAD), ay - L * Math.sin(th * RAD)); g.stroke();
  g.beginPath(); g.arc(ax, ay, 46, -th * RAD, 0); g.stroke();
  g.textAlign = 'left'; g.fillStyle = col; g.font = 'bold 22px Jost,sans-serif';
  g.fillText('Pendiente de unos ' + th + '°', ax + L + 14, ay - 6);
  g.textAlign = 'center'; g.font = 'bold 24px Jost,sans-serif';
  g.fillText(bad ? 'Zona peligrosa' : 'Zona apta', W * 0.5, 34);
  g.font = '20px Jost,sans-serif'; g.fillStyle = '#c9d1e8';
  g.fillText(
    bad
      ? 'Sol casi rasante y sombras largas; el relieve tapa la Tierra'
      : 'Terreno casi plano, pocas rocas pequeñas, Sol alto y Tierra visible',
    W * 0.5, 62,
  );
  if (bad) { g.fillStyle = '#98a2bd'; g.fillText('Sin enlace con la Tierra', W * 0.82, H * 0.2); }
}
