import { useEffect, useState, type ChangeEvent } from 'react';
import { useSim } from '../hooks/SimContext';
import { useI18n } from '../i18n/useI18n';

/** Velocidades en ms simulados por segundo; sus etiquetas están en `ui.time.speeds` (mismo orden). */
const SPEEDS: string[] = ['3.6e6', '2.16e7', '8.64e7', '2.592e8'];

/** Fecha y hora (UTC), máscara de horizonte, velocidad y reproducción. */
export default function TimeControls() {
  const { t, goTo, mk, setMk, speed, setSpeed, play, setPlay } = useSim();
  const { ui } = useI18n();
  const [mkText, setMkText] = useState(String(mk));

  useEffect(() => { setMkText(String(mk)); }, [mk]);

  const onDate = (ev: ChangeEvent<HTMLInputElement>): void => {
    const v = Date.parse(ev.target.value + ':00Z');
    if (!isNaN(v)) goTo(v);
  };

  return (
    <section>
      <div className="row">
        <label>
          {ui.time.dateLabel}
          <input type="datetime-local" value={new Date(t).toISOString().slice(0, 16)} onChange={onDate} />
        </label>
        <button onClick={() => goTo(Date.now())}>{ui.time.now}</button>
      </div>
      <div className="row">
        <label>
          {ui.time.mask}
          <input
            type="number" min="0" max="20" step="0.5" inputMode="decimal"
            value={mkText}
            onChange={(ev) => { setMkText(ev.target.value); setMk(ev.target.value); }}
          />
        </label>
        <label>
          {ui.time.speed}
          <select value={String(speed)} onChange={(ev) => setSpeed(+ev.target.value)}>
            {SPEEDS.map((v, i) => <option key={v} value={v}>{ui.time.speeds[i]}</option>)}
          </select>
        </label>
        <button onClick={() => setPlay(!play)}>{play ? ui.time.pause : ui.time.play}</button>
      </div>
      <p className="note">{ui.time.note}</p>
    </section>
  );
}
