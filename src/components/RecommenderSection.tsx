import { useState, type ChangeEvent } from 'react';
import { findWindow } from '../lib/astro';
import { OKS, ptCol, recoFilter } from '../lib/classify';
import { f1, fd } from '../lib/format';
import { HR } from '../lib/astro';
import { useSim } from '../hooks/SimContext';
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
      <h2>Recomendador de sitio y fecha</h2>
      <p className="note" style={{ margin: '0 0 10px' }}>
        Dime qué necesitas y te propongo los sitios y el primer momento de los próximos 120 días que lo cumple. Usa la máscara de horizonte actual. Toca un resultado para ir a esa fecha.
      </p>
      <div className="row">
        <label>
          Días seguidos con Sol
          <input type="number" min="0.5" max="30" step="0.5" inputMode="decimal" value={days} onChange={(e: ChangeEvent<HTMLInputElement>) => setDays(e.target.value)} />
        </label>
        <label>
          Enlace con la Tierra
          <select value={link} onChange={(e: ChangeEvent<HTMLSelectElement>) => setLink(+e.target.value as LinkMode)}>
            <option value="0">Tierra directa</option>
            <option value="1">Tierra directa o relevo L2</option>
            <option value="2">No necesito enlace</option>
          </select>
        </label>
      </div>
      <div className="row">
        <label>
          Sitios
          <select value={kind} onChange={(e: ChangeEvent<HTMLSelectElement>) => setKind(+e.target.value)}>
            <option value="2">Verdes y amarillos</option>
            <option value="1">Solo verdes (seguros)</option>
            <option value="3">Solo candidatos</option>
            <option value="0">Todos</option>
          </select>
        </label>
        <label>
          Ordenar por
          <select value={orderBy} onChange={(e: ChangeEvent<HTMLSelectElement>) => setOrderBy(+e.target.value)}>
            <option value="0">Fecha más pronto</option>
            <option value="1">Ventana más larga</option>
            <option value="2">Más seguro primero</option>
          </select>
        </label>
        <button onClick={search}>Buscar</button>
      </div>

      <div>
        {result === 'busy' && <p className="note">Buscando…</p>}
        {result && result !== 'busy' && <Results result={result} t={t} onPick={pick} />}
      </div>
    </section>
  );
}

function Results({ result, t, onPick }: { result: RecoResult; t: number; onPick: (r: RecoRow, q: TimeWindow) => void }) {
  const { A, B, d, od } = result;
  return (
    <>
      {A.length ? (
        <>
          <p className="note" style={{ margin: '0 0 6px' }}>
            {A.length} sitios cumplen. El punto de color es la categoría del sitio.
          </p>
          {A.map((r, k) => {
            const q = od === 1 ? r.w.b : r.w.f;
            return (
              <div className="wi" key={r.i} onClick={() => onPick(r, q)}>
                <b>
                  <i className="dt" style={{ background: ptCol(r.s) }} />
                  {k === 0 ? 'Recomendado: ' : ''}{r.s.n}
                </b>
                <span>{q.s <= t + HR ? 'ahora' : fd(q.s)}</span>
                <span>{f1(q.d / 24)} d</span>
              </div>
            );
          })}
        </>
      ) : (
        <p className="note">Ningún sitio cumple eso en los próximos 120 días. Prueba con menos días, con relevo L2 o con más tipos de sitio.</p>
      )}
      {A.length > 0 && B.length > 0 && (
        <p className="note">Sin ventana de {f1(d)} d en 120 días: {B.map((r) => r.s.n).join(', ')}.</p>
      )}
    </>
  );
}
