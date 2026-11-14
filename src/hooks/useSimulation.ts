import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BASE_SITES, DEFAULT_FOCUS } from '../data/sites';
import { DAY, HR, at, makeSite, stats } from '../lib/astro';
import { useThrottled } from './useThrottled';
import type { Ephemeris, SheetState, Site, SiteStats } from '../types';

/** Todo lo que expone la simulación a los componentes (ver `useSimulation`). */
export interface SimState {
  /** Instante simulado (ms UTC) y su cambio; `goTo` además pausa la reproducción. */
  t: number;
  setT: (t: number) => void;
  goTo: (ms: number) => void;
  /** Direcciones del Sol y la Tierra en `t`. */
  e: Ephemeris;
  /** Inicio (ms) de la ventana de 30 días de la línea de tiempo. */
  w0: number;
  /** `t` actualizado como mucho cada 250 ms (para cálculos pesados). */
  tSlow: number;
  /** Máscara de horizonte en grados (0–20). */
  mk: number;
  setMk: (v: number | string) => void;
  /** Índice del sitio en foco. */
  foc: number;
  setFoc: (i: number) => void;
  play: boolean;
  setPlay: (on: boolean) => void;
  stop: () => void;
  /** Velocidad de reproducción en ms simulados por segundo real. */
  speed: number;
  setSpeed: (v: number) => void;
  sites: Site[];
  addSite: (la: number, lo: number) => void;
  /** Filtro "Mostrar" (0 todos, 1 seguros, 2 candidatos, 3 hemisferio oculto). */
  filter: number;
  setFilter: (m: number) => void;
  statsList: SiteStats[];
  sheet: SheetState | null;
  openSite: (i: number) => void;
  openSat: (i: number) => void;
  closeSheet: () => void;
  /** Cambia cada vez que se abre un sitio; el globo lo usa para acercarse. */
  globeNonce: number;
}

/** Crea todo el estado global de la simulación. Se provee con SimContext. */
export function useSimulation(): SimState {
  const [t, setT] = useState(() => Date.now());
  const [mk, setMkRaw] = useState(0);
  const [foc, setFoc] = useState(DEFAULT_FOCUS);
  const [play, setPlay] = useState(false);
  const [speed, setSpeed] = useState(8.64e7);
  const [custom, setCustom] = useState<Site[]>([]);
  const [filter, setFilter] = useState(0);
  const [sheet, setSheet] = useState<SheetState | null>(null);
  const [globeNonce, setGlobeNonce] = useState(0);

  const sites = useMemo(() => [...BASE_SITES, ...custom], [custom]);

  /* Reproducción: avanza t según la velocidad elegida */
  useEffect(() => {
    if (!play) return undefined;
    let last = performance.now();
    let id: number;
    const loop = (ts: number): void => {
      setT((v) => v + ((ts - last) * speed) / 1000);
      last = ts;
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [play, speed]);

  /* Ventana de 30 días de la línea de tiempo */
  const w0Ref = useRef(Math.floor((t - 3 * DAY) / HR) * HR);
  if (t < w0Ref.current || t > w0Ref.current + 719 * HR) {
    w0Ref.current = Math.floor((t - 3 * DAY) / HR) * HR;
  }
  const w0 = w0Ref.current;

  const e = useMemo(() => at(t), [t]);

  /* Estadísticas de 30 días: dependen solo de la hora y la máscara, y se recalculan como mucho cada 250 ms */
  const tSlow = useThrottled(t, 250);
  const hourKey = Math.floor(tSlow / HR);
  const statsList = useMemo(
    () => sites.map((s) => stats(s, hourKey * HR, mk)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sites, hourKey, mk],
  );

  const setMk = useCallback((v: number | string) => setMkRaw(Math.max(0, Math.min(20, +v || 0))), []);
  const stop = useCallback(() => setPlay(false), []);

  const goTo = useCallback((ms: number) => {
    setT(ms);
    setPlay(false);
  }, []);

  const addSite = useCallback(
    (la: number, lo: number) => {
      const name = 'Personalizado ' + (custom.length + 1);
      setCustom((c) => [...c, makeSite(name, la, lo)]);
      setFoc(BASE_SITES.length + custom.length);
    },
    [custom.length],
  );

  const openSite = useCallback((i: number) => {
    setFoc(i);
    setSheet({ type: 'site', i });
    setGlobeNonce((n) => n + 1);
  }, []);
  const openSat = useCallback((i: number) => setSheet({ type: 'sat', i }), []);
  const closeSheet = useCallback(() => setSheet(null), []);

  return {
    t, setT, goTo, e, w0, tSlow,
    mk, setMk,
    foc, setFoc,
    play, setPlay, stop, speed, setSpeed,
    sites, addSite,
    filter, setFilter,
    statsList,
    sheet, openSite, openSat, closeSheet, globeNonce,
  };
}
