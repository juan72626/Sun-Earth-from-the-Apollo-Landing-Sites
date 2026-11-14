import { l2Point } from '../lib/astro';
import { f1, sem } from '../lib/format';
import { RELAY_TIPS } from '../data/content';
import { useSim } from '../hooks/SimContext';
import type { Site, SiteStats } from '../types';

/** Lado oculto y satélites de relevo: tabla de relevo L2, silencio de radio y enlace total. */
export default function RelaySection() {
  const { sites, e, statsList } = useSim();
  const { la, lo } = l2Point(e);
  const rows = sites.map((s, i): [Site, SiteStats] => [s, statsList[i]]).filter(([s]) => s.la < -80 || Math.abs(s.lo) > 90);

  return (
    <section id="s4">
      <h2>Lado oculto y satélites de relevo</h2>
      <p className="note" style={{ margin: '0 0 10px' }}>
        Desde la cara oculta la Tierra nunca se ve, así que hace falta un satélite de relevo. A cambio, la Luna bloquea el ruido de radio de la Tierra, ideal para radiotelescopios. Relevo L2 es el tiempo con un satélite en halo sobre el punto L2 Tierra–Luna (tipo Queqiao-1) por encima del horizonte; silencio de radio es el tiempo con la Tierra más de 1° bajo el horizonte; enlace total es Tierra directa o relevo.
      </p>
      <p style={{ margin: '0 0 10px', fontSize: 14 }}>
        Punto de la Luna justo debajo del halo L2 hoy:{' '}
        <b>{f1(Math.abs(la))}° {la < 0 ? 'S' : 'N'}, {f1(Math.abs(lo))}° {lo < 0 ? 'O' : 'E'}</b>.
        {' '}Es también el punto de mayor silencio de radio y se mueve hasta unos 8° a lo largo del mes.
      </p>
      <table>
        <thead>
          <tr><th>Sitio</th><th>Relevo L2</th><th>Silencio de radio</th><th>Enlace total</th></tr>
        </thead>
        <tbody>
          {rows.map(([s, k]) => (
            <tr key={s.n}>
              <td>{s.n}</td>
              <td>{Math.round(k.rl)} %</td>
              <td>{Math.round(k.q)} %</td>
              <td><span style={{ color: '#8fb4e8' }}>{Math.round(k.lk)} % {sem(k.lk)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 style={{ marginTop: 14 }}>Dónde enviar un satélite</h2>
      <ul className="cx">{RELAY_TIPS.map((t) => <li key={t}>{t}</li>)}</ul>
    </section>
  );
}
