import { useEffect, useRef, useState, type ChangeEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { monthRow } from '../lib/astro';
import { drawHeatmap, HM } from '../lib/draw/drawHeatmap';
import { useSim } from '../hooks/SimContext';
import { useI18n } from '../i18n/useI18n';
import type { HeatMode, MonthRow } from '../types';

/** Calendario de 12 meses para el sitio elegido: horas por día con Sol y/o Tierra. */
export default function CalendarSection() {
  const { sites, foc, t, mk, goTo } = useSim();
  const { ui, lang, siteName } = useI18n();
  const [mode, setMode] = useState<HeatMode>(0);
  const [data, setData] = useState<{ D: MonthRow[]; n: string } | null>(null);
  /** Cálculo en curso (se guarda el sitio y el avance, no el texto, para poder traducirlo). */
  const [busy, setBusy] = useState<{ n: string; p?: number } | null>(null);
  const ref = useRef<HTMLCanvasElement>(null);
  const job = useRef(0);

  const calc = () => {
    const s = sites[foc];
    const d0 = new Date(t);
    const y = d0.getUTCFullYear();
    const m0 = d0.getUTCMonth();
    const id = ++job.current;
    const D: MonthRow[] = [];
    setBusy({ n: s.n });

    const step = () => {
      if (id !== job.current) return; // se pidió otro cálculo
      D.push(monthRow(s, y, m0, D.length, mk));
      if (D.length < 12) {
        setBusy({ n: s.n, p: Math.round((D.length / 12) * 100) });
        setTimeout(step, 0);
      } else {
        setBusy(null);
        setData({ D, n: s.n });
      }
    };
    setTimeout(step, 0);
  };

  useEffect(() => {
    if (!data || !ref.current) return;
    drawHeatmap(ref.current, data.D, mode, t, lang);
  }, [data, mode, t, lang]);

  const info = busy
    ? ui.calendar.calculating(siteName(busy.n), busy.p)
    : data
      ? ui.calendar.legend(siteName(data.n), ui.calendar.modeText[mode])
      : ui.calendar.hint;

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
      <h2>{ui.calendar.title}</h2>
      <p className="note" style={{ margin: '0 0 10px' }}>{ui.calendar.intro}</p>
      <div className="row">
        <label>
          {ui.calendar.show}
          <select value={mode} onChange={(e: ChangeEvent<HTMLSelectElement>) => setMode(+e.target.value as HeatMode)}>
            {ui.calendar.modeOptions.map((label, i) => <option key={i} value={i}>{label}</option>)}
          </select>
        </label>
        <button onClick={calc}>{ui.calendar.calc}</button>
      </div>
      <canvas ref={ref} id="hc" width={HM.W} height={HM.H} onPointerUp={onUp} />
      <p className="note">{info}</p>
    </section>
  );
}
