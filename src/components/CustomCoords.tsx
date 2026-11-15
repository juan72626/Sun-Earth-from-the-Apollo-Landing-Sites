import { useState, type ChangeEvent } from 'react';
import { useSim } from '../hooks/SimContext';
import { useI18n } from '../i18n/useI18n';

/** Agrega un sitio propio por latitud y longitud. */
export default function CustomCoords() {
  const { addSite } = useSim();
  const { ui } = useI18n();
  const [errKey, setErrKey] = useState(false);
  const [la, setLa] = useState('');
  const [lo, setLo] = useState('');

  const add = () => {
    const a = parseFloat(la);
    const o = parseFloat(lo);
    if (isNaN(a) || isNaN(o) || Math.abs(a) > 90 || Math.abs(o) > 180) {
      setErrKey(true);
      return;
    }
    setErrKey(false);
    addSite(a, o);
  };

  return (
    <>
      <h2 style={{ marginTop: 14 }}>{ui.compare.customTitle}</h2>
      <div className="row">
        <label>
          {ui.compare.lat}
          <input type="number" step="any" placeholder="-85.0" inputMode="decimal" value={la} onChange={(e: ChangeEvent<HTMLInputElement>) => setLa(e.target.value)} />
        </label>
        <label>
          {ui.compare.lon}
          <input type="number" step="any" placeholder="30.0" inputMode="decimal" value={lo} onChange={(e: ChangeEvent<HTMLInputElement>) => setLo(e.target.value)} />
        </label>
        <button onClick={add}>{ui.compare.add}</button>
      </div>
      <p className="note">{errKey ? ui.compare.coordsError : ''}</p>
    </>
  );
}
