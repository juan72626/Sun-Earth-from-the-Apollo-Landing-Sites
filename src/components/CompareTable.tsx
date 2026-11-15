import { useMemo, useState } from 'react';
import { el } from '../lib/astro';
import { catName, isCand, lvName, passesFilter, ptCol, ptCol0 } from '../lib/classify';
import { useSim } from '../hooks/SimContext';
import { useI18n } from '../i18n/useI18n';

const BAR = '#6fa8ff';

/** Tabla comparativa de todos los sitios en el instante elegido. */
export default function CompareTable() {
  const { sites, foc, e, mk, filter, setFilter, statsList, play, openSite } = useSim();
  const [sortMode, setSortMode] = useState(0);
  const { ui, data, lang, fmt, siteName } = useI18n();
  const { f1 } = fmt;
  const C = ui.compare;
  const I = data.I;

  // Mientras se reproduce, el orden se congela para que las filas no salten.
  const live = sortMode === 1 || sortMode === 4;
  const orderKey = live && !play ? statsList : null;

  const order = useMemo(() => {
    const ix = sites.map((_s, i) => i).filter((i) => passesFilter(sites[i], filter));
    if (sortMode === 1) ix.sort((a, b) => statsList[b].c - statsList[a].c);
    else if (sortMode === 2) ix.sort((a, b) => sites[a].la - sites[b].la || a - b);
    else if (sortMode === 3) ix.sort((a, b) => Number(isCand(sites[b])) - Number(isCand(sites[a])) || a - b);
    else if (sortMode === 4) ix.sort((a, b) => statsList[b].q - statsList[a].q || a - b);
    return ix;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sites, filter, sortMode, orderKey]);

  return (
    <>
      <label style={{ marginBottom: 8 }}>
        {C.sortBy}
        <select value={sortMode} onChange={(ev) => setSortMode(+ev.target.value)}>
          {C.sortOptions.map((label, i) => <option key={i} value={i}>{label}</option>)}
        </select>
      </label>
      <label style={{ marginBottom: 8 }}>
        {C.show}
        <select value={filter} onChange={(ev) => setFilter(+ev.target.value)}>
          {C.filterOptions.map((label, i) => <option key={i} value={i}>{label}</option>)}
        </select>
      </label>

      <table>
        <thead>
          <tr><th>{C.colSite}</th><th>{C.colSun}</th><th>{C.colEarth}</th><th>{C.colLight}</th></tr>
        </thead>
        <tbody>
          {order.map((i) => {
            const s = sites[i];
            const x = el(s, e.s);
            const y = el(s, e.e);
            const k = statsList[i];
            return (
              <tr key={i} className={i === foc ? 'on' : ''} onClick={() => openSite(i)}>
                <td>
                  <i className="dt" style={{ background: ptCol(s) }} />
                  {siteName(s)}
                  <small>
                    <b style={{ color: ptCol(s) }}>{catName(s, lang, ui.sheet.candidate)}</b>
                    {isCand(s) && I[s.n] && <> ({C.risk} <span style={{ color: ptCol0(s) }}>{lvName(s, lang).toLowerCase()}</span>)</>}
                    {' '}{f1(s.la)}°, {f1(s.lo)}°
                  </small>
                </td>
                <td className={x + 0.27 > mk ? 'su' : 'sd'}>{f1(x)}°</td>
                <td className={y > mk ? 'eu' : 'ed'}>{f1(y)}°</td>
                <td>
                  <div className="bar"><i style={{ width: k.c + '%', background: BAR }} /></div>
                  {ui.pct(Math.round(k.c))} <span style={{ color: BAR, fontSize: 12 }}>{ui.sem(k.c)}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="lg">
        <span><i style={{ background: '#6fa8ff' }} />{C.legend}</span>
      </div>
      <p className="note">{C.note}</p>
    </>
  );
}
