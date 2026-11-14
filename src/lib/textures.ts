import { RAD } from './astro';
import { ctx2d } from './canvas';

/** Textura procedural de la Luna (mares, manchas y cráteres), con semilla fija. */
export function moonCanvas(): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = 1024; cv.height = 512;
  const g2 = ctx2d(cv);
  const K = 1024 / 360;
  let sd = 7;
  const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  g2.fillStyle = '#9a9a9a'; g2.fillRect(0, 0, 1024, 512);

  const bl = (x: number, y: number, rx: number, ry: number, st: [number, string][]): void => {
    for (const dx of [-1024, 0, 1024]) {
      g2.save(); g2.translate(x + dx, y); g2.scale(rx, ry);
      const q = g2.createRadialGradient(0, 0, 0, 0, 0, 1);
      st.forEach(([o, c]) => q.addColorStop(o, c));
      g2.fillStyle = q; g2.beginPath(); g2.arc(0, 0, 1, 0, 7); g2.fill(); g2.restore();
    }
  };
  const sf = (c: string, a: number): [number, string][] => [[0, `rgba(${c},${a})`], [1, `rgba(${c},0)`]];

  for (let i = 0; i < 500; i++) {
    bl(rnd() * 1024, rnd() * 512, 10 + rnd() * 70, 10 + rnd() * 50,
      sf(rnd() < 0.5 ? '255,255,255' : '40,40,40', 0.05 + rnd() * 0.05));
  }

  [[8, 31, 9, 6], [28, 18, 8, 7], [17, 59, 6, 5], [-7, 52, 8, 7], [-15, 34, 5, 5], [35, -17, 16, 10],
   [15, -55, 25, 20], [58, 0, 24, 5], [-21, -16, 9, 6], [-24, -39, 6, 5], [13, 3, 5, 4]]
    .forEach(([la, lo, a, b]) => {
      for (let i = 0; i < 14; i++) {
        bl((lo + 180 + (rnd() - 0.5) * a) * K, (90 - la - (rnd() - 0.5) * b) * K,
          a * K * (0.55 + rnd() * 0.5), b * K * (0.55 + rnd() * 0.5), sf('36,38,45', 0.3));
      }
    });

  for (let i = 0; i < 1600; i++) {
    const la = Math.asin(rnd() * 2 - 1) * 57.3;
    const d = (0.3 + Math.pow(rnd(), 5) * 5) * K;
    bl(rnd() * 1024, (90 - la) * K, Math.min(d / Math.max(0.3, Math.cos(la * RAD)), 128), d, [
      [0, 'rgba(55,55,55,.5)'], [0.72, 'rgba(85,85,85,.25)'],
      [0.88, `rgba(245,245,245,${0.25 + rnd() * 0.35})`], [1, 'rgba(245,245,245,0)'],
    ]);
  }
  return cv;
}

/** Esfera dorada con rayos para marcar la dirección del Sol. */
export function sunCanvas(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = ctx2d(c);
  g.translate(128, 128);
  for (let k = 0; k < 16; k++) {
    g.save(); g.rotate((k * Math.PI) / 8);
    g.fillStyle = k % 2 ? 'rgba(255,200,80,.55)' : 'rgba(255,170,40,.85)';
    g.beginPath(); g.moveTo(0, -122); g.lineTo(-9, -62); g.lineTo(9, -62); g.fill();
    g.restore();
  }
  const gr = g.createRadialGradient(0, 0, 10, 0, 0, 112);
  gr.addColorStop(0, 'rgba(255,250,210,1)'); gr.addColorStop(0.45, 'rgba(255,205,70,.95)');
  gr.addColorStop(0.62, 'rgba(255,170,30,.5)'); gr.addColorStop(1, 'rgba(255,150,0,0)');
  g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 112, 0, 7); g.fill();
  g.fillStyle = '#fff3b0'; g.beginPath(); g.arc(0, 0, 46, 0, 7); g.fill();
  return c;
}

/** Tierra con océanos, continentes y casquetes polares. */
export function earthCanvas(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 256;
  const g = ctx2d(c);
  g.fillStyle = '#1b5fb8'; g.fillRect(0, 0, 512, 256);
  const bb = (x: number, y: number, rx: number, ry: number, col: string): void => {
    for (const dx of [-512, 0, 512]) {
      g.fillStyle = col; g.beginPath(); g.ellipse(x + dx, y, rx, ry, 0, 0, 7); g.fill();
    }
  };
  [[114, 70, 44, 34], [150, 170, 24, 46], [262, 76, 28, 24], [278, 150, 28, 40],
   [380, 70, 76, 30], [430, 170, 28, 20], [100, 40, 26, 14]].forEach(([x, y, rx, ry]) => {
    bb(x, y, rx, ry, '#2f8f4e');
    bb(x + 4, y + 3, rx * 0.55, ry * 0.55, '#8a8d4a');
  });
  g.fillStyle = '#f4f8ff'; g.fillRect(0, 0, 512, 14); g.fillRect(0, 242, 512, 14);
  for (let i = 0; i < 70; i++) bb((i * 131) % 512, (i * 53) % 256, 14 + ((i * 7) % 20), 5 + ((i * 3) % 6), 'rgba(255,255,255,.55)');
  return c;
}
