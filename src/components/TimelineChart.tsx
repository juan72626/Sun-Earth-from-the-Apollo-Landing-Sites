import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { drawTimeline } from '../lib/draw/drawTimeline';
import { HR } from '../lib/astro';
import { useSim } from '../hooks/SimContext';
import type { EclipseEvent, Site } from '../types';

/** Gráfica de 30 días con elevaciones, ventanas operativas y eclipses. Se arrastra para cambiar la fecha. */
export default function TimelineChart({ site, eclipses }: { site: Site; eclipses: EclipseEvent[] | null }) {
  const { t, w0, mk, goTo } = useSim();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current) drawTimeline(ref.current, site, { t, w0, mk, eclipses });
  }, [site, t, w0, mk, eclipses]);

  const seek = (ev: ReactPointerEvent<HTMLCanvasElement>): void => {
    const r = ev.currentTarget.getBoundingClientRect();
    goTo(w0 + Math.max(0, Math.min(0.998, (ev.clientX - r.left) / r.width)) * 720 * HR);
  };

  return (
    <canvas
      ref={ref} id="tl" width="720" height="330"
      onPointerDown={(ev) => { ev.currentTarget.setPointerCapture(ev.pointerId); seek(ev); }}
      onPointerMove={(ev) => { if (ev.buttons) seek(ev); }}
    />
  );
}
