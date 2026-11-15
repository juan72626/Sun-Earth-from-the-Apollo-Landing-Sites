import { useState, type ChangeEvent } from 'react';
import { findWindow } from '../lib/astro';
import { OKS, ptCol, recoFilter } from '../lib/classify';
import { HR } from '../lib/astro';
import { useSim } from '../hooks/SimContext';
import { useI18n } from '../i18n/useI18n';
import type { LinkMode, Site, SiteLevel, TimeWindow, WindowResult } from '../types';

/** Orden "más seguro primero"; los sitios sin clasificar van al final. */
const RANK: Record<SiteLevel, number> = { ok: 0, wn: 1, bad: 2, na: 3 };

/** Sitio con su ventana (A) o sin ella (B, `w` = null). */
interface RecoRow {
  i: number;
  s: Site;
  w: WindowResult | null;
}
type RecoHit = RecoRow & { w: WindowResult };

interface RecoResult {
  A: RecoHit[];
  B: RecoRow[];
  d: number;
  od: number;
}

/** Busca los sitios y el primer momento de los próximos 120 días que cumplen lo que se necesita. */
export default function RecommenderSection() {
  const { sites, t, mk, goTo, openSite } = useSim();
  const { ui } = useI18n();
  const R = ui.reco;
  const [days, setDays] = useState('6.5');
  const [link, setLink] = useState<LinkMode>(0);
  const [kind, setKind] = useState(2);
  const [orderBy, setOrderBy] = useState(0);
  const [result, setResult] = useState<null | 'busy' | RecoResult>(null);

  const search = () => {
    const d = Math.max(0.5, Math.min(30, +days || 6.5));
    const od = orderBy;
    setResult('busy');
    setTimeout(() => {
      const R = sites.flatMap((s, i): RecoRow[] =>
        recoFilter(s, kind) ? [{ i, s, w: findWindow(s, d, link, t, mk) }] : [],
      );
      const A = R.filter((r): r is RecoHit => r.w !== null);
      const B = R.filter((r) => r.w === null);
      A.sort((a, b) =>
        od === 1 ? b.w.b.d - a.w.b.d
        : od === 2 ? RANK[OKS(a.s)] - RANK[OKS(b.s)] || a.w.f.s - b.w.f.s
        : a.w.f.s - b.w.f.s);
      setResult({ A, B, d, od });
    }, 30);
  };

  const pick = (r: RecoRow, q: TimeWindow): void => {
    goTo(q.s);
    openSite(r.i);
  };

  return (
    <section id="s5">
      <h2>{R.title}</h2>
      <p className="note" style={{ margin: '0 0 10px' }}>{R.intro}</p>
      <div className="row">
        <label>
          {R.days}
          <input type="number" min="0.5" max="30" step="0.5" inputMode="decimal" value={days} onChange={(e: ChangeEvent<HTMLInputElement>) => setDays(e.target.value)} />
        </label>
        <label>
          {R.link}
          <select value={link} onChange={(e: ChangeEvent<HTMLSelectElement>) => setLink(+e.target.value as LinkMode)}>
            {R.linkOptions.map((label, i) => <option key={i} value={i}>{label}</option>)}
          </select>
        </label>
      </div>
      <div className="row">
        <label>
          {R.sites}
          <select value={kind} onChange={(e: ChangeEvent<HTMLSelectElement>) => setKind(+e.target.value)}>
            {['2', '1', '3', '0'].map((v) => <option key={v} value={v}>{R.kindOptions[v]}</option>)}
          </select>
        </label>
        <label>
          {R.orderBy}
          <select value={orderBy} onChange={(e: ChangeEvent<HTMLSelectElement>) => setOrderBy(+e.target.value)}>
            {R.orderOptions.map((label, i) => <option key={i} value={i}>{label}</option>)}
          </select>
        </label>
        <button onClick={search}>{R.search}</button>
      </div>

      <div>
        {result === 'busy' && <p className="note">{R.busy}</p>}
        {result && result !== 'busy' && <Results result={result} t={t} onPick={pick} />}
      </div>
    </section>
  );
}

function Results({ result, t, onPick }: { result: RecoResult; t: number; onPick: (r: RecoRow, q: TimeWindow) => void }) {
  const { ui, fmt, siteName } = useI18n();
  const { f1, fd } = fmt;
  const R = ui.reco;
  const { A, B, d, od } = result;
  return (
    <>
      {A.length ? (
        <>
          <p className="note" style={{ margin: '0 0 6px' }}>
            {R.found(A.length)}
          </p>
          {A.map((r, k) => {
            const q = od === 1 ? r.w.b : r.w.f;
            return (
              <div className="wi" key={r.i} onClick={() => onPick(r, q)}>
                <b>
                  <i className="dt" style={{ background: ptCol(r.s) }} />
                  {k === 0 ? R.recommended : ''}{siteName(r.s)}
                </b>
                <span>{q.s <= t + HR ? R.nowLabel : fd(q.s)}</span>
                <span>{R.daysShort(f1(q.d / 24))}</span>
              </div>
            );
          })}
        </>
      ) : (
        <p className="note">{R.none}</p>
      )}
      {A.length > 0 && B.length > 0 && (
        <p className="note">{R.withoutWindow(f1(d), B.map((r) => siteName(r.s)).join(', '))}</p>
      )}
    </>
  );
}
