import { useEffect, useState } from 'react';
import { DAY, findEclipses } from '../lib/astro';
import type { EclipseEvent, Site } from '../types';

/**
 * Eclipses de Sol por la Tierra (próximos 120 días) para un sitio.
 * Se recalcula al cambiar el sitio, el día o la máscara; devuelve null mientras busca.
 */
export function useEclipses(site: Site, t: number, mk: number): EclipseEvent[] | null {
  const [list, setList] = useState<EclipseEvent[] | null>(null);
  const day = Math.floor(t / DAY);

  useEffect(() => {
    setList(null);
    const id = setTimeout(() => setList(findEclipses(site, day * DAY, mk).slice(0, 3)), 20);
    return () => clearTimeout(id);
  }, [site, day, mk]);

  return list;
}
