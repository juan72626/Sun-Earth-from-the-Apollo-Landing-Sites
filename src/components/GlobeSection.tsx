import { useEffect, useMemo, useRef, useState } from 'react';
import { MoonGlobe } from '../lib/MoonGlobe';
import { SAT } from '../data/satellites';
import { satIcon } from '../lib/draw/satIcon';
import { ptCol, passesFilter } from '../lib/classify';
import { useSim } from '../hooks/SimContext';

function scrollGlobeIntoView(canvas: HTMLCanvasElement): void {
  const b = canvas.getBoundingClientRect();
  if (b.top < 0 || b.bottom > innerHeight * 0.55) canvas.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

/** Globo lunar 3D con puntos de sitios, Sol, Tierra y satélites. */
export default function GlobeSection() {
  const { sites, foc, e, t, filter, sheet, globeNonce, openSite, openSat } = useSim();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sunLabel = useRef<HTMLSpanElement>(null);
  const earthLabel = useRef<HTMLSpanElement>(null);
  const globeRef = useRef<MoonGlobe | null>(null);
  const [satOn, setSatOn] = useState(true);
  const [failed, setFailed] = useState(false);

  // Callbacks siempre actuales sin recrear el globo
  const cb = useRef({ openSite, openSat });
  cb.current = { openSite, openSat };

  const satIcons = useMemo(() => SAT.map((s) => satIcon(s, 48).toDataURL()), []);

  /* Crear y destruir el globo */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    try {
      globeRef.current = new MoonGlobe(canvas, {
        sunLabel: sunLabel.current,
        earthLabel: earthLabel.current,
        onSiteClick: (i) => cb.current.openSite(i),
        onSatClick: (i) => cb.current.openSat(i),
      });
    } catch {
      setFailed(true);
    }
    return () => { globeRef.current?.dispose(); globeRef.current = null; };
  }, []);

  /* Redibujar cuando cambia el tiempo, el foco o el filtro */
  useEffect(() => {
    globeRef.current?.update({
      e, t, sites, foc,
      colorOf: (i) => ptCol(sites[i]),
      visibleOf: (i) => passesFilter(sites[i], filter),
    });
  }, [e, t, sites, foc, filter]);

  /* Al abrir la ficha de un sitio, el globo se acerca a él */
  useEffect(() => {
    if (!globeNonce || !globeRef.current || !canvasRef.current) return;
    globeRef.current.setView('site');
    scrollGlobeIntoView(canvasRef.current);
  }, [globeNonce]);

  /* Al abrir la ficha de un satélite, se resalta su órbita */
  useEffect(() => {
    if (sheet?.type !== 'sat' || !globeRef.current || !canvasRef.current) return;
    globeRef.current.selectSat(sheet.i);
    scrollGlobeIntoView(canvasRef.current);
  }, [sheet]);

  const toggleSats = () => {
    setSatOn((v) => {
      globeRef.current?.setSatellitesVisible(!v);
      return !v;
    });
  };

  return (
    <section id="s1">
      <h2>Globo lunar</h2>
      <div id="glw">
        <canvas ref={canvasRef} id="gl" width="600" height="600" style={failed ? { display: 'none' } : undefined} />
        <span ref={sunLabel} className="gt" style={{ color: '#ffc94d', display: 'none' }}>Sol</span>
        <span ref={earthLabel} className="gt" style={{ color: '#6fb7ff', display: 'none' }}>Tierra</span>
      </div>
      <div className="btns">
        <button onClick={() => globeRef.current?.setView('earth')}>Ver desde la Tierra</button>
        <button onClick={() => globeRef.current?.setView('site')}>Ver el sitio elegido</button>
        <button onClick={() => globeRef.current?.zoomIn()}>Acercar</button>
        <button onClick={() => globeRef.current?.zoomOut()}>Alejar</button>
        <button onClick={toggleSats}>Satélites: {satOn ? 'sí' : 'no'}</button>
      </div>
      <div className="btns">
        {SAT.map((s, i) => (
          <button
            key={s.n}
            onClick={() => openSat(i)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: s.c }}
          >
            <img src={satIcons[i]} width="24" height="24" alt="" style={{ marginRight: 6 }} />
            {s.n}
          </button>
        ))}
      </div>
      <p className="note">
        La luz y la sombra siguen la posición real del Sol. Colores de los puntos (los mismos en el globo, el mapa, la tabla y la ficha): verde = seguro, amarillo = precaución, rojo = peligro o no seguro, morado = candidato. Al tocar un sitio el globo se acerca a él; con Acercar y Alejar ajustas el zoom. Los satélites (cada uno con su ilustración y su órbita) están a una escala comprimida y sus órbitas son ilustrativas: toca uno, o su botón, para ver su nombre y en qué aportó. Arrastra para girar y toca un punto para ver su ficha: cuándo se visitó, quiénes fueron y por qué es seguro, riesgoso o candidato. Fuera de la vista desde la Tierra aparecen el Sol (esfera dorada con rayos, más lejos) y la Tierra (esfera azul con océanos y continentes, más cerca), cada uno con su nombre y una línea que apunta hacia él. La Tierra se ve con fase porque la ilumina el Sol, y gira con el paso del tiempo.
      </p>
    </section>
  );
}
