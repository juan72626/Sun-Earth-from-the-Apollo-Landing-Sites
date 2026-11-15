import { useEffect, useRef } from 'react';
import { drawSky } from '../lib/draw/drawSky';
import { useLang } from '../i18n/LangContext';
import type { Ephemeris, Site } from '../types';

/** Vista del horizonte del sitio: Sol y Tierra por azimut y elevación. */
export default function SkyView({ site, e, mk }: { site: Site; e: Ephemeris; mk: number }) {
  const { lang } = useLang();
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) drawSky(ref.current, site, e, mk, lang);
  }, [site, e, mk, lang]);
  return <canvas ref={ref} id="sky" width="720" height="300" />;
}
