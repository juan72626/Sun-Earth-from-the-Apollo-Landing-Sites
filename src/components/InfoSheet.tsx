import { useMemo } from 'react';
import { satIcon } from '../lib/draw/satIcon';
import { useSim } from '../hooks/SimContext';
import { useI18n } from '../i18n/useI18n';

/** Ficha flotante (abajo) de un sitio o de un satélite. */
export default function InfoSheet() {
  const { sheet, closeSheet } = useSim();
  if (!sheet) return <div id="fi" />;
  return (
    <div id="fi" className="on">
      {sheet.type === 'sat' ? <SatSheet i={sheet.i} onClose={closeSheet} /> : <SiteSheet i={sheet.i} onClose={closeSheet} />}
    </div>
  );
}

function SiteSheet({ i, onClose }: { i: number; onClose: () => void }) {
  const { sites, statsList } = useSim();
  const { ui, data, siteName } = useI18n();
  const s = sites[i];
  const st = statsList[i];
  const [k, c, y, w, t, r] = data.I[s.n] || data.DEFAULT_INFO;
  const [ln, lc] = data.LV[k];
  const p = Math.round(st.c || 0);
  const S = ui.sheet;

  return (
    <>
      <h3>
        {siteName(s)}
        <button id="fx" aria-label={ui.close} onClick={onClose}>×</button>
      </h3>
      {c ? (
        <>
          <span className="bd" style={{ background: '#b48cff' }}>{S.candidate}</span>
          <span className="bd" style={{ background: lc }}>{S.estimatedRisk}{ln}</span>
        </>
      ) : (
        <span className="bd" style={{ background: lc }}>{ln}</span>
      )}
      <span className="bd" style={{ background: '#9aa7c7' }}>{S.light30(p, ui.sem(p))}</span>
      <span className="bd" style={{ background: '#9aa7c7' }}>{S.quiet(Math.round(st.q))}</span>
      <span className="bd" style={{ background: '#9aa7c7' }}>{S.linkTotal(Math.round(st.lk))}</span>
      <dl>
        <dt>{S.when}</dt><dd>{y}</dd>
        <dt>{S.who}</dt><dd>{w}</dd>
        <dt>{S.what}</dt><dd>{t}</dd>
        <dt>{S.why}</dt><dd>{r}</dd>
      </dl>
    </>
  );
}

function SatSheet({ i, onClose }: { i: number; onClose: () => void }) {
  const { ui, data } = useI18n();
  const s = data.SAT[i];
  const icon = useMemo(() => satIcon(s, 160).toDataURL(), [s]);
  const S = ui.sheet;
  return (
    <>
      <h3>
        {s.n}
        <button id="fx" aria-label={ui.close} onClick={onClose}>×</button>
      </h3>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <img src={icon} alt={S.satAlt(s.n)} style={{ width: 84, height: 84, flex: 'none' }} />
        <div>
          <span className="bd" style={{ background: s.c }}>{s.o}</span>
          <span className="bd" style={{ background: '#cfd3da' }}>{s.y}</span>
        </div>
      </div>
      <dl>
        <dt>{S.satWhat}</dt><dd>{s.d}</dd>
        <dt>{S.satContribution}</dt><dd>{s.ap}</dd>
        <dt>{S.satOrbit}</dt><dd>{s.ob}</dd>
      </dl>
      <p className="note">{S.satNote}</p>
    </>
  );
}
