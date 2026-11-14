import { el, nextEvent, solarPower } from '../lib/astro';
import { dur, evText, f1, fd } from '../lib/format';
import type { EclipseEvent, Ephemeris, Site, SiteStats } from '../types';

const fv = (v: number): string | number => (v < 10 ? f1(v) : Math.round(v));

/** Encabezado del sitio: badge, cajas de Sol y Tierra, resumen de 30 días, eclipses y potencia solar. */
interface SiteStatusProps {
  site: Site;
  t: number;
  e: Ephemeris;
  mk: number;
  st: SiteStats;
  /** null mientras se buscan. */
  eclipses: EclipseEvent[] | null;
}

export default function SiteStatus({ site, t, e, mk, st, eclipses }: SiteStatusProps) {
  const xs = el(site, e.s);
  const xe = el(site, e.e);
  const us = xs + 0.27 > mk;
  const ue = xe > mk;
  const both = us && ue;
  const pw = solarPower(site, t, mk, xs);

  return (
    <>
      <h2>{`${site.n} (${f1(site.la)}°, ${f1(site.lo)}°)`}</h2>
      <span className="badge" style={{ background: both ? '#4aa3ff' : us || ue ? '#9fb0d6' : '#7b86a6' }}>
        {both ? 'Energía y enlace disponibles' : us ? 'Solo energía solar' : ue ? 'Solo enlace con la Tierra' : 'Sin Sol ni Tierra'}
      </span>

      <div className="two">
        <div className="box">
          <span>Sol</span>
          <b>{f1(xs)}°</b>
          <span>{us ? 'Sobre' : 'Bajo'} el horizonte<br />{evText(nextEvent(site, 's', t, mk), 'del Sol')}</span>
        </div>
        <div className="box">
          <span>Tierra</span>
          <b>{f1(xe)}°</b>
          <span>{ue ? 'Sobre' : 'Bajo'} el horizonte<br />{evText(nextEvent(site, 'e', t, mk), 'de la Tierra')}</span>
        </div>
      </div>

      <p className="note">
        {`En los próximos 30 días el Sol llega como máximo a ${f1(st.ms)}° y la Tierra a ${f1(st.me)}°. Ambos están sobre el horizonte el ${Math.round(st.c)} % del tiempo. La noche solar más larga dura ${st.bd ? dur(st.bd * 36e5) : 'menos de 1 h'}. La mayor ventana con Sol y Tierra a la vez dura ${st.bb ? dur(st.bb * 36e5) + ' (desde el ' + fd(st.bs) + ')' : '0 min'}.${st.bb >= 156 ? ' Eso alcanza los 6,5 días que NASA usó como referencia para Artemis III.' : ''}`}
      </p>

      <p className="note">
        {eclipses === null
          ? 'Buscando eclipses…'
          : eclipses.length
            ? 'Eclipses de Sol por la Tierra (la Tierra tapa al Sol), próximos 120 días: ' +
              eclipses.map((q) => `${fd(q.a)} a ${fd(q.b)} (${dur(q.b - q.a)}, ${q.tot ? 'total' : 'parcial'}${q.up < 0.5 ? ', con el Sol bajo el horizonte' : ''})`).join('; ') + '.'
            : 'Eclipses de Sol por la Tierra: ninguno en los próximos 120 días.'}
      </p>

      <p className="note">
        {`Potencia solar relativa (100 % = panel que sigue al Sol, con el Sol arriba): ahora, panel horizontal ${fv(pw.nowH)} % y panel vertical orientable ${fv(pw.nowV)} %; promedio de 30 días, horizontal ${fv(pw.avgH)} % y vertical ${fv(pw.avgV)} %. Con el Sol muy bajo, como en los polos, un panel vertical produce mucho más que uno horizontal.`}
      </p>
    </>
  );
}
