import { l2Point } from '../lib/astro';
import { useSim } from '../hooks/SimContext';
import { useI18n } from '../i18n/useI18n';
import type { Site, SiteStats } from '../types';

/** Lado oculto y satélites de relevo: tabla de relevo L2, silencio de radio y enlace total. */
export default function RelaySection() {
  const { sites, e, statsList } = useSim();
  const { ui, data, fmt, siteName } = useI18n();
  const { la, lo } = l2Point(e);
  const rows = sites.map((s, i): [Site, SiteStats] => [s, statsList[i]]).filter(([s]) => s.la < -80 || Math.abs(s.lo) > 90);
  const R = ui.relay;

  return (
    <section id="s4">
      <h2>{R.title}</h2>
      <p className="note" style={{ margin: '0 0 10px' }}>{R.intro}</p>
      <p style={{ margin: '0 0 10px', fontSize: 14 }}>
        {R.pointBelow}{' '}
        <b>{R.coord(fmt.f1(Math.abs(la)), la < 0 ? 'S' : 'N', fmt.f1(Math.abs(lo)), lo < 0 ? 'O' : 'E')}</b>.
        {' '}{R.pointNote}
      </p>
      <table>
        <thead>
          <tr><th>{R.colSite}</th><th>{R.colL2}</th><th>{R.colQuiet}</th><th>{R.colTotal}</th></tr>
        </thead>
        <tbody>
          {rows.map(([s, k]) => (
            <tr key={s.n}>
              <td>{siteName(s)}</td>
              <td>{ui.pct(Math.round(k.rl))}</td>
              <td>{ui.pct(Math.round(k.q))}</td>
              <td><span style={{ color: '#8fb4e8' }}>{ui.pct(Math.round(k.lk))} {ui.sem(k.lk)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 style={{ marginTop: 14 }}>{R.whereTitle}</h2>
      <ul className="cx">{data.RELAY_TIPS.map((t) => <li key={t}>{t}</li>)}</ul>
    </section>
  );
}
