import { useState, type ChangeEvent } from 'react';
import { useSim } from '../hooks/SimContext';

/** Agrega un sitio propio por latitud y longitud. */
export default function CustomCoords() {
  const { addSite } = useSim();
  const [la, setLa] = useState('');
  const [lo, setLo] = useState('');
  const [err, setErr] = useState('');

  const add = () => {
    const a = parseFloat(la);
    const o = parseFloat(lo);
    if (isNaN(a) || isNaN(o) || Math.abs(a) > 90 || Math.abs(o) > 180) {
      setErr('Latitud entre −90 y 90, longitud entre −180 y 180 (este positivo).');
      return;
    }
    setErr('');
    addSite(a, o);
  };

  return (
    <>
      <h2 style={{ marginTop: 14 }}>Coordenadas propias</h2>
      <div className="row">
        <label>
          Latitud
          <input type="number" step="any" placeholder="-85.0" inputMode="decimal" value={la} onChange={(e: ChangeEvent<HTMLInputElement>) => setLa(e.target.value)} />
        </label>
        <label>
          Longitud (este +)
          <input type="number" step="any" placeholder="30.0" inputMode="decimal" value={lo} onChange={(e: ChangeEvent<HTMLInputElement>) => setLo(e.target.value)} />
        </label>
        <button onClick={add}>Agregar</button>
      </div>
      <p className="note">{err}</p>
    </>
  );
}
