import { useEffect, useState, type ChangeEvent } from 'react';
import { useSim } from '../hooks/SimContext';

const SPEEDS: [ms: string, label: string][] = [
  ['3.6e6', '1 hora por segundo'],
  ['2.16e7', '6 horas por segundo'],
  ['8.64e7', '1 día por segundo'],
  ['2.592e8', '3 días por segundo'],
];

/** Fecha y hora (UTC), máscara de horizonte, velocidad y reproducción. */
export default function TimeControls() {
  const { t, goTo, mk, setMk, speed, setSpeed, play, setPlay } = useSim();
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
          Fecha y hora (UTC)
          <input type="datetime-local" value={new Date(t).toISOString().slice(0, 16)} onChange={onDate} />
        </label>
        <button onClick={() => goTo(Date.now())}>Ahora</button>
      </div>
      <div className="row">
        <label>
          Máscara de horizonte (°)
          <input
            type="number" min="0" max="20" step="0.5" inputMode="decimal"
            value={mkText}
            onChange={(ev) => { setMkText(ev.target.value); setMk(ev.target.value); }}
          />
        </label>
        <label>
          Velocidad
          <select value={String(speed)} onChange={(ev) => setSpeed(+ev.target.value)}>
            {SPEEDS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <button onClick={() => setPlay(!play)}>{play ? 'Pausar' : 'Reproducir'}</button>
      </div>
      <p className="note">
        En los polos el Sol casi no sube de 1,5°, así que un relieve de 100 m cambia el resultado. Sube la máscara para simular montañas en el horizonte.
      </p>
    </section>
  );
}
