import { el, nextEvent, solarPower } from '../lib/astro';
import { dur } from '../lib/format';
import { useI18n } from '../i18n/useI18n';
import type { EclipseEvent, Ephemeris, NextEvent, Site, SiteStats } from '../types';

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
  const { ui, fmt, siteName } = useI18n();
  const { f1, fd } = fmt;
  const S = ui.status;
  const fv = (v: number): string => (v < 10 ? f1(v) : String(Math.round(v)));
  const evText = (body: 's' | 'e', o: NextEvent): string =>
    o.t == null ? S.noEvent(body, o.up) : S.event(body, o.up, dur(o.t));

  const xs = el(site, e.s);
  const xe = el(site, e.e);
  const us = xs + 0.27 > mk;
  const ue = xe > mk;
  const both = us && ue;
  const pw = solarPower(site, t, mk, xs);

  return (
    <>
      <h2>{`${siteName(site)} (${f1(site.la)}°, ${f1(site.lo)}°)`}</h2>
      <span className="badge" style={{ background: both ? '#4aa3ff' : us || ue ? '#9fb0d6' : '#7b86a6' }}>
        {both ? S.badgeBoth : us ? S.badgeSun : ue ? S.badgeEarth : S.badgeNone}
      </span>

      <div className="two">
        <div className="box">
          <span>{S.sun}</span>
          <b>{f1(xs)}°</b>
          <span>{us ? S.above : S.below}<br />{evText('s', nextEvent(site, 's', t, mk))}</span>
        </div>
        <div className="box">
          <span>{S.earth}</span>
          <b>{f1(xe)}°</b>
          <span>{ue ? S.above : S.below}<br />{evText('e', nextEvent(site, 'e', t, mk))}</span>
        </div>
      </div>

      <p className="note">
        {S.summary({
          ms: f1(st.ms),
          me: f1(st.me),
          c: ui.pct(Math.round(st.c)),
          night: st.bd ? dur(st.bd * 36e5) : null,
          win: st.bb ? S.windowSince(dur(st.bb * 36e5), fd(st.bs)) : null,
          ref: st.bb >= 156,
        })}
      </p>

      <p className="note">
        {eclipses === null
          ? S.searching
          : eclipses.length
            ? S.eclipsesHead +
              eclipses.map((q) => S.eclipseItem(fd(q.a), fd(q.b), dur(q.b - q.a), q.tot, q.up < 0.5)).join('; ') + '.'
            : S.eclipsesNone}
      </p>

      <p className="note">
        {S.power({ nowH: fv(pw.nowH), nowV: fv(pw.nowV), avgH: fv(pw.avgH), avgV: fv(pw.avgV) })}
      </p>
    </>
  );
}
