import { useMemo, useState } from 'react';
import { el } from '../lib/astro';
import { catName, isCand, lvName, passesFilter, ptCol, ptCol0 } from '../lib/classify';
import { f1, sem } from '../lib/format';
import { I } from '../data/siteInfo';
import { useSim } from '../hooks/SimContext';

const BAR = '#6fa8ff';

/** Tabla comparativa de todos los sitios en el instante elegido. */
export default function CompareTable() {
  const { sites, foc, e, mk, filter, setFilter, statsList, play, openSite } = useSim();
  const [sortMode, setSortMode] = useState(0);

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
        Ordenar por
        <select value={sortMode} onChange={(ev) => setSortMode(+ev.target.value)}>
          <option value="0">Orden original</option>
          <option value="1">Mejor luz y enlace</option>
          <option value="2">Más cerca del polo sur</option>
          <option value="3">Candidatos primero</option>
          <option value="4">Más silencio de radio</option>
        </select>
      </label>
      <label style={{ marginBottom: 8 }}>
        Mostrar
        <select value={filter} onChange={(ev) => setFilter(+ev.target.value)}>
          <option value="0">Todos los sitios</option>
          <option value="1">Solo seguros</option>
          <option value="2">Solo candidatos</option>
          <option value="3">Solo hemisferio oculto (longitud mayor a 90°)</option>
        </select>
      </label>

      <table>
        <thead>
          <tr><th>Sitio y categoría</th><th>Sol</th><th>Tierra</th><th>Luz y enlace (30 días)</th></tr>
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
                  {s.n}
                  <small>
                    <b style={{ color: ptCol(s) }}>{catName(s)}</b>
                    {isCand(s) && I[s.n] && <> (riesgo <span style={{ color: ptCol0(s) }}>{lvName(s).toLowerCase()}</span>)</>}
                    {' '}{f1(s.la)}°, {f1(s.lo)}°
                  </small>
                </td>
                <td className={x + 0.27 > mk ? 'su' : 'sd'}>{f1(x)}°</td>
                <td className={y > mk ? 'eu' : 'ed'}>{f1(y)}°</td>
                <td>
                  <div className="bar"><i style={{ width: k.c + '%', background: BAR }} /></div>
                  {Math.round(k.c)} % <span style={{ color: BAR, fontSize: 12 }}>{sem(k.c)}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="lg">
        <span><i style={{ background: '#6fa8ff' }} />Barra azul: tiempo con Sol y Tierra a la vez (alta: 60 % o más, media: 25 a 60 %, baja: menos de 25 %)</span>
      </div>
      <p className="note">
        Bajo cada nombre está su categoría, con el mismo color que en el globo: seguro (verde), precaución (amarillo), no seguro (rojo) o candidato (morado, con su riesgo estimado entre paréntesis). A la derecha, la barra azul es el porcentaje de los próximos 30 días con Sol y Tierra a la vez sobre el horizonte (luz y enlace); no mide el riesgo del terreno. Toca una fila para verla en el globo con su ficha.
      </p>
    </>
  );
}
