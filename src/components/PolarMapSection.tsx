import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { drawPolar, layoutPolar, poleSummary, POLAR_W } from '../lib/draw/drawPolar';
import { passesFilter, ptCol, isCand } from '../lib/classify';
import { f1 } from '../lib/format';
import { useSim } from '../hooks/SimContext';

const RADII: number[] = [2, 5, 10];

/** Mapa del polo sur visto desde arriba, con el Sol, la Tierra y los sitios numerados. */
export default function PolarMapSection() {
  const { sites, foc, e, mk, filter, openSite } = useSim();
  const [S, setS] = useState(10);
  const ref = useRef<HTMLCanvasElement>(null);

  const pts = useMemo(() => layoutPolar(sites, S, (s) => passesFilter(s, filter)), [sites, S, filter]);

  useEffect(() => {
    if (ref.current) drawPolar(ref.current, { e, mk, S, foc, pts, sites });
  }, [e, mk, S, foc, pts, sites]);

  const onUp = (ev: ReactPointerEvent<HTMLCanvasElement>): void => {
    const r = ev.currentTarget.getBoundingClientRect();
    const x = ((ev.clientX - r.left) / r.width) * POLAR_W;
    const y = ((ev.clientY - r.top) / r.height) * POLAR_W;
    let best = -1, bd = 1e9;
    pts.forEach((p) => {
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < bd) { bd = d; best = p.i; }
    });
    if (best >= 0 && bd < 40) openSite(best);
  };

  const { xs, xe } = poleSummary(e, sites);

  return (
    <section id="s2">
      <h2>Mapa del polo sur</h2>
      <div className="pz">
        {RADII.map((r) => (
          <button key={r} className={r === S ? 'on' : ''} onClick={() => setS(r)}>Radio {r}°</button>
        ))}
      </div>
      <canvas ref={ref} id="pm" width={POLAR_W} height={POLAR_W} onPointerUp={onUp} />
      <p className="note">
        En el polo: el Sol está {f1(Math.abs(xs))}° {xs > 0 ? 'sobre' : 'bajo'} el horizonte y la Tierra {f1(Math.abs(xe))}° {xe > 0 ? 'sobre' : 'bajo'} el horizonte.
      </p>
      <div id="pml">
        {pts.map((p, n) => {
          const s = sites[p.i];
          return (
            <div key={p.i} onClick={() => openSite(p.i)}>
              <span className="nn" style={{ background: ptCol(s) }}>{n + 1}</span>
              {s.n}{isCand(s) ? ', candidato' : ''}
            </div>
          );
        })}
      </div>
      <p className="note">
        Cómo leerlo: el mapa se ve desde arriba del polo sur, con el 0° hacia la Tierra y el este a la derecha. El lado amarillo es de donde llega la luz del Sol y el oscuro es la sombra. Cada número es un sitio de la lista de arriba; si dos quedan muy juntos se separan un poco y una línea fina marca su lugar real. Colores: verde seguro, amarillo precaución, rojo peligro o no seguro, morado candidato (los mismos que en el globo y la tabla). La línea punteada violeta es el límite de 6° de latitud que pidió NASA para Artemis. Con los botones de radio acercas el polo.
      </p>
    </section>
  );
}
