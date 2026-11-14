import { SIC } from '../../data/satellites';
import { ctx2d } from '../canvas';

/** Ilustración esquemática de un satélite en un canvas cuadrado de lado W. */
export function satIcon(s: { n: string }, W: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = W;
  const g = ctx2d(c);
  const a = SIC[s.n] || SIC.LRO;
  g.scale(W / 128, W / 128);
  g.translate(64, a.dr ? 80 : 66);
  g.lineJoin = 'round';

  const pan = (x0: number, d: number): void => {
    const L = a.pl, h = 36, xl = d < 0 ? x0 - L : x0;
    g.strokeStyle = '#8fa6d8'; g.lineWidth = 3;
    g.beginPath(); g.moveTo((d * a.bw) / 2, 0); g.lineTo(x0, 0); g.stroke();
    g.fillStyle = '#1d3b7a'; g.fillRect(xl, -h / 2, L, h);
    g.strokeStyle = '#6f9bff'; g.lineWidth = 1.5; g.strokeRect(xl, -h / 2, L, h);
    for (let j = 1; j < 4; j++) {
      g.beginPath(); g.moveTo(xl + (L * j) / 4, -h / 2); g.lineTo(xl + (L * j) / 4, h / 2); g.stroke();
    }
    g.beginPath(); g.moveTo(xl, 0); g.lineTo(xl + L, 0); g.stroke();
  };

  pan(-(a.bw / 2 + 6), -1);
  if (a.pn > 1) pan(a.bw / 2 + 6, 1);

  const gr = g.createLinearGradient(-a.bw / 2, -a.bh / 2, a.bw / 2, a.bh / 2);
  gr.addColorStop(0, '#fff3c4'); gr.addColorStop(0.5, a.bc); gr.addColorStop(1, '#7a5b1e');
  g.fillStyle = gr; g.fillRect(-a.bw / 2, -a.bh / 2, a.bw, a.bh);
  g.strokeStyle = '#2a2110'; g.lineWidth = 2; g.strokeRect(-a.bw / 2, -a.bh / 2, a.bw, a.bh);

  if (a.dr) {
    const r = a.dr, yb = -a.bh / 2 - 6, d = r * 0.5, yr = yb - d;
    g.strokeStyle = '#8fa6d8'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(0, -a.bh / 2); g.lineTo(0, yb); g.stroke();
    g.fillStyle = '#c9d1e8';
    g.beginPath(); g.moveTo(-r, yr); g.quadraticCurveTo(0, yb + d * 0.9, r, yr); g.fill();
    g.fillStyle = '#eef2ff';
    g.beginPath(); g.ellipse(0, yr, r, r * 0.26, 0, 0, 6.2832); g.fill();
    g.fillStyle = '#8d9bbd';
    g.beginPath(); g.ellipse(0, yr, r * 0.8, r * 0.18, 0, 0, 6.2832); g.fill();
    g.strokeStyle = '#eef2ff'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(0, yr); g.lineTo(0, yr - r * 0.4); g.stroke();
    g.beginPath(); g.arc(0, yr - r * 0.4, 3, 0, 6.2832); g.fillStyle = '#fff'; g.fill();
  }
  return c;
}
