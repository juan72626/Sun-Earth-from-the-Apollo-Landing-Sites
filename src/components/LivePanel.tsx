import { useSim } from '../hooks/SimContext';
import { useEclipses } from '../hooks/useEclipses';
import { useI18n } from '../i18n/useI18n';
import SiteStatus from './SiteStatus';
import SkyView from './SkyView';
import TimelineChart from './TimelineChart';

/** Panel principal: estado del sitio en foco en la fecha elegida. */
export default function LivePanel() {
  const { sites, foc, t, e, mk, tSlow, statsList } = useSim();
  const { ui } = useI18n();
  const site = sites[foc];
  const eclipses = useEclipses(site, tSlow, mk);

  return (
    <section>
      <SiteStatus site={site} t={t} e={e} mk={mk} st={statsList[foc]} eclipses={eclipses} />
      <SkyView site={site} e={e} mk={mk} />
      <TimelineChart site={site} eclipses={eclipses} />
      <div className="lg">
        <span><i style={{ background: '#ffb83d' }} />{ui.live.sun}</span>
        <span><i style={{ background: '#4aa3ff' }} />{ui.live.earth}</span>
        <span><i style={{ background: '#5fd7c8' }} />{ui.live.both}</span>
        <span><i style={{ background: '#ff7ab6' }} />{ui.live.eclipse}</span>
      </div>
      <p className="note">{ui.live.note}</p>
    </section>
  );
}
