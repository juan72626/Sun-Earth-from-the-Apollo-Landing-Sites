import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { drawPolar, layoutPolar, poleSummary, POLAR_W } from '../lib/draw/drawPolar';
import { passesFilter, ptCol, isCand } from '../lib/classify';
import { useSim } from '../hooks/SimContext';
import { useI18n } from '../i18n/useI18n';

const RADII: number[] = [2, 5, 10];

/** Mapa del polo sur visto desde arriba, con el Sol, la Tierra y los sitios numerados. */
export default function PolarMapSection() {
  const { sites, foc, e, mk, filter, openSite } = useSim();
  const [S, setS] = useState(10);
  const { ui, lang, fmt, siteName } = useI18n();
  const { f1 } = fmt;
  const ref = useRef<HTMLCanvasElement>(null);

  const pts = useMemo(() => layoutPolar(sites, S, (s) => passesFilter(s, filter)), [sites, S, filter]);

  useEffect(() => {
    if (ref.current) drawPolar(ref.current, { e, mk, S, foc, pts, sites, lang, name: (s) => siteName(s) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [e, mk, S, foc, pts, sites, lang]);

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
      <h2>{ui.polar.title}</h2>
      <div className="pz">
        {RADII.map((r) => (
          <button key={r} className={r === S ? 'on' : ''} onClick={() => setS(r)}>{ui.polar.radius(r)}</button>
        ))}
      </div>
      <canvas ref={ref} id="pm" width={POLAR_W} height={POLAR_W} onPointerUp={onUp} />
      <p className="note">{ui.polar.atPole(f1(Math.abs(xs)), xs > 0, f1(Math.abs(xe)), xe > 0)}</p>
      <div id="pml">
        {pts.map((p, n) => {
          const s = sites[p.i];
          return (
            <div key={p.i} onClick={() => openSite(p.i)}>
              <span className="nn" style={{ background: ptCol(s) }}>{n + 1}</span>
              {siteName(s)}{isCand(s) ? ui.polar.candidateSuffix : ''}
            </div>
          );
        })}
      </div>
      <p className="note">{ui.polar.howTo}</p>
    </section>
  );
}
