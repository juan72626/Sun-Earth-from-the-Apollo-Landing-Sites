import { useEffect, useRef } from 'react';
import { zoneScene } from '../lib/draw/drawZones';
import { LROC_LINKS, ZONE_BAD, ZONE_OK } from '../data/content';

/** Dibujo animado de una zona apta y una peligrosa, con sus criterios. */
export default function ZonesSection() {
  const okRef = useRef<HTMLCanvasElement>(null);
  const badRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let id: number;
    let last = 0;
    const loop = (ts: number): void => {
      id = requestAnimationFrame(loop);
      if (ts - last < 34) return;
      last = ts;
      const ph = ((ts / 1000) % 7) / 7;
      if (okRef.current) zoneScene(okRef.current, false, ph);
      if (badRef.current) zoneScene(badRef.current, true, ph);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section id="s8">
      <h2>Cómo se ve una zona segura y una peligrosa</h2>
      <p className="note" style={{ margin: '0 0 10px' }}>
        Dibujo animado y esquemático: arriba baja un módulo a una zona apta; abajo, a una peligrosa.
      </p>

      <canvas ref={okRef} id="za" width="720" height="360" />
      <h3 className="zh" style={{ color: '#34d65a' }}>Zona donde sí se puede aterrizar (verde)</h3>
      <ul className="cx">{ZONE_OK.map((t) => <li key={t}>{t}</li>)}</ul>

      <canvas ref={badRef} id="zb" width="720" height="360" />
      <h3 className="zh" style={{ color: '#ff4d4d' }}>Zona donde no se puede aterrizar (rojo)</h3>
      <ul className="cx">{ZONE_BAD.map((t) => <li key={t}>{t}</li>)}</ul>

      <p className="note">
        Amarillo (precaución): se puede aterrizar, pero con riesgos conocidos, como rocas, pendientes moderadas, luz baja o dependencia de un relevo. Morado (candidato): lugar propuesto que aún no tiene un aterrizaje probado; su riesgo estimado está en la ficha.
      </p>
      <p className="note">
        Fotos reales de LROC (NASA):{' '}
        {LROC_LINKS.map(([href, label], i) => (
          <span key={href}>
            <a href={href} target="_blank" rel="noopener noreferrer">{label}</a>
            {i < LROC_LINKS.length - 2 ? ', ' : i === LROC_LINKS.length - 2 ? ' y ' : '.'}
          </span>
        ))}
      </p>
    </section>
  );
}
