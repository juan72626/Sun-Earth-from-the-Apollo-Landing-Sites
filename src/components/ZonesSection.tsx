import { useEffect, useRef } from 'react';
import { zoneScene } from '../lib/draw/drawZones';
import { useI18n } from '../i18n/useI18n';

/** Dibujo animado de una zona apta y una peligrosa, con sus criterios. */
export default function ZonesSection() {
  const { ui, data, lang } = useI18n();
  const { LROC_LINKS, ZONE_BAD, ZONE_OK } = data;
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
      if (okRef.current) zoneScene(okRef.current, false, ph, lang);
      if (badRef.current) zoneScene(badRef.current, true, ph, lang);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [lang]);

  return (
    <section id="s8">
      <h2>{ui.zones.title}</h2>
      <p className="note" style={{ margin: '0 0 10px' }}>{ui.zones.intro}</p>

      <canvas ref={okRef} id="za" width="720" height="360" />
      <h3 className="zh" style={{ color: '#34d65a' }}>{ui.zones.okTitle}</h3>
      <ul className="cx">{ZONE_OK.map((t) => <li key={t}>{t}</li>)}</ul>

      <canvas ref={badRef} id="zb" width="720" height="360" />
      <h3 className="zh" style={{ color: '#ff4d4d' }}>{ui.zones.badTitle}</h3>
      <ul className="cx">{ZONE_BAD.map((t) => <li key={t}>{t}</li>)}</ul>

      <p className="note">{ui.zones.legend}</p>
      <p className="note">
        {ui.zones.photos}{' '}
        {LROC_LINKS.map(([href, label], i) => (
          <span key={href}>
            <a href={href} target="_blank" rel="noopener noreferrer">{label}</a>
            {i < LROC_LINKS.length - 2 ? ', ' : i === LROC_LINKS.length - 2 ? ui.and : '.'}
          </span>
        ))}
      </p>
    </section>
  );
}
