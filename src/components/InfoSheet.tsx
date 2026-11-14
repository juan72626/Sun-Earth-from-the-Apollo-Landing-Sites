import { useMemo } from 'react';
import { DEFAULT_INFO, I, LV } from '../data/siteInfo';
import { SAT } from '../data/satellites';
import { satIcon } from '../lib/draw/satIcon';
import { sem } from '../lib/format';
import { useSim } from '../hooks/SimContext';

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
  const s = sites[i];
  const st = statsList[i];
  const [k, c, y, w, t, r] = I[s.n] || DEFAULT_INFO;
  const [ln, lc] = LV[k];
  const p = Math.round(st.c || 0);

  return (
    <>
      <h3>
        {s.n}
        <button id="fx" aria-label="Cerrar" onClick={onClose}>×</button>
      </h3>
      {c ? (
        <>
          <span className="bd" style={{ background: '#b48cff' }}>Candidato</span>
          <span className="bd" style={{ background: lc }}>Riesgo estimado: {ln}</span>
        </>
      ) : (
        <span className="bd" style={{ background: lc }}>{ln}</span>
      )}
      <span className="bd" style={{ background: '#9aa7c7' }}>Luz y enlace en 30 días: {p} % ({sem(p)})</span>
      <span className="bd" style={{ background: '#9aa7c7' }}>Silencio de radio: {Math.round(st.q)} %</span>
      <span className="bd" style={{ background: '#9aa7c7' }}>Enlace total con relevo: {Math.round(st.lk)} %</span>
      <dl>
        <dt>Cuándo</dt><dd>{y}</dd>
        <dt>Quiénes</dt><dd>{w}</dd>
        <dt>Qué se hizo</dt><dd>{t}</dd>
        <dt>Por qué</dt><dd>{r}</dd>
      </dl>
    </>
  );
}

function SatSheet({ i, onClose }: { i: number; onClose: () => void }) {
  const s = SAT[i];
  const icon = useMemo(() => satIcon(s, 160).toDataURL(), [s]);
  return (
    <>
      <h3>
        {s.n}
        <button id="fx" aria-label="Cerrar" onClick={onClose}>×</button>
      </h3>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <img src={icon} alt={`Ilustración esquemática de ${s.n}`} style={{ width: 84, height: 84, flex: 'none' }} />
        <div>
          <span className="bd" style={{ background: s.c }}>{s.o}</span>
          <span className="bd" style={{ background: '#cfd3da' }}>{s.y}</span>
        </div>
      </div>
      <dl>
        <dt>Qué es</dt><dd>{s.d}</dd>
        <dt>En qué aportó</dt><dd>{s.ap}</dd>
        <dt>Órbita</dt><dd>{s.ob}</dd>
      </dl>
      <p className="note">Ilustración esquemática, no es una foto; la escala y la órbita en el globo son ilustrativas.</p>
    </>
  );
}
