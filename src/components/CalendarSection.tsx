import { useEffect, useRef, useState, type ChangeEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { monthRow } from '../lib/astro';
import { drawHeatmap, HM } from '../lib/draw/drawHeatmap';
import { useSim } from '../hooks/SimContext';
import type { HeatMode, MonthRow } from '../types';

const MODES: string[] = [
  'horas con Sol y Tierra a la vez',
  'horas con Sol',
  'horas con la Tierra',
];

/** Calendario de 12 meses para el sitio elegido: horas por día con Sol y/o Tierra. */
export default function CalendarSection() {
  const { sites, foc, t, mk, goTo } = useSim();
  const [mode, setMode] = useState<HeatMode>(0);
  const [data, setData] = useState<{ D: MonthRow[]; n: string } | null>(null);
  const [info, setInfo] = useState('Toca Calcular para ver el calendario del sitio elegido.');
  const ref = useRef<HTMLCanvasElement>(null);
  const job = useRef(0);

  const calc = () => {
    const s = sites[foc];
    const d0 = new Date(t);
    const y = d0.getUTCFullYear();
    const m0 = d0.getUTCMonth();
    const id = ++job.current;
    const D: MonthRow[] = [];
    setInfo('Calculando… (' + s.n + ')');

    const step = () => {
      if (id !== job.current) return; // se pidió otro cálculo
      D.push(monthRow(s, y, m0, D.length, mk));
      if (D.length < 12) {
        setInfo('Calculando… ' + Math.round((D.length / 12) * 100) + ' % (' + s.n + ')');
        setTimeout(step, 0);
      } else {
        setData({ D, n: s.n });
      }
    };
    setTimeout(step, 0);
  };

  useEffect(() => {
    if (!data || !ref.current) return;
    drawHeatmap(ref.current, data.D, mode, t);
    setInfo(`${data.n}: ${MODES[mode]} de cada día (oscuro 0 h, claro 24 h). El recuadro blanco es la fecha elegida. Toca una casilla para ir a ese día.`);
  }, [data, mode, t]);

  const onUp = (ev: ReactPointerEvent<HTMLCanvasElement>): void => {
    if (!data) return;
    const r = ev.currentTarget.getBoundingClientRect();
    const x = ((ev.clientX - r.left) / r.width) * HM.W;
    const y = ((ev.clientY - r.top) / r.height) * HM.H;
    const j = Math.floor((x - HM.L) / HM.cw);
    const i = Math.floor((y - HM.T) / HM.ch);
    if (i >= 0 && i < 12 && j >= 0 && data.D[i] && j < data.D[i].row.length) {
      goTo(data.D[i].st + j * 864e5 + 12 * 36e5);
    }
  };

  return (
    <section id="s9">
      <h2>Calendario de 12 meses</h2>
      <p className="note" style={{ margin: '0 0 10px' }}>
        Cada casilla es un día: más clara significa más horas con Sol y Tierra a la vez. Se calcula para el sitio elegido arriba, desde el mes de la fecha elegida. Muestra las estaciones del polo y cuánto cambia el resultado al mover la fecha unos días.
      </p>
      <div className="row">
        <label>
          Mostrar
          <select value={mode} onChange={(e: ChangeEvent<HTMLSelectElement>) => setMode(+e.target.value as HeatMode)}>
            <option value="0">Sol y Tierra a la vez</option>
            <option value="1">Solo Sol</option>
            <option value="2">Solo Tierra</option>
          </select>
        </label>
        <button onClick={calc}>Calcular</button>
      </div>
      <canvas ref={ref} id="hc" width={HM.W} height={HM.H} onPointerUp={onUp} />
      <p className="note">{info}</p>
    </section>
  );
}
