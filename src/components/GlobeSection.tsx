import { useEffect, useMemo, useRef, useState } from 'react';
import { MoonGlobe } from '../lib/MoonGlobe';
import { SAT } from '../data/satellites';
import { satIcon } from '../lib/draw/satIcon';
import { ptCol, passesFilter } from '../lib/classify';
import { useSim } from '../hooks/SimContext';
import { useI18n } from '../i18n/useI18n';

function scrollGlobeIntoView(canvas: HTMLCanvasElement): void {
  const b = canvas.getBoundingClientRect();
  if (b.top < 0 || b.bottom > innerHeight * 0.55) canvas.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

/** Globo lunar 3D con puntos de sitios, Sol, Tierra y satélites. */
export default function GlobeSection() {
  const { sites, foc, e, t, filter, sheet, globeNonce, openSite, openSat } = useSim();
  const { ui } = useI18n();
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
      <h2>{ui.globe.title}</h2>
      <div id="glw">
        <canvas ref={canvasRef} id="gl" width="600" height="600" style={failed ? { display: 'none' } : undefined} />
        <span ref={sunLabel} className="gt" style={{ color: '#ffc94d', display: 'none' }}>{ui.globe.sun}</span>
        <span ref={earthLabel} className="gt" style={{ color: '#6fb7ff', display: 'none' }}>{ui.globe.earth}</span>
      </div>
      <div className="btns">
        <button onClick={() => globeRef.current?.setView('earth')}>{ui.globe.fromEarth}</button>
        <button onClick={() => globeRef.current?.setView('site')}>{ui.globe.chosenSite}</button>
        <button onClick={() => globeRef.current?.zoomIn()}>{ui.globe.zoomIn}</button>
        <button onClick={() => globeRef.current?.zoomOut()}>{ui.globe.zoomOut}</button>
        <button onClick={toggleSats}>{ui.globe.satellites(satOn)}</button>
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
      <p className="note">{ui.globe.note}</p>
    </section>
  );
}
