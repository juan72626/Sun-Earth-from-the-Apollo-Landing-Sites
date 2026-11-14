import { useSim } from '../hooks/SimContext';
import { useEclipses } from '../hooks/useEclipses';
import SiteStatus from './SiteStatus';
import SkyView from './SkyView';
import TimelineChart from './TimelineChart';

/** Panel principal: estado del sitio en foco en la fecha elegida. */
export default function LivePanel() {
  const { sites, foc, t, e, mk, tSlow, statsList } = useSim();
  const site = sites[foc];
  const eclipses = useEclipses(site, tSlow, mk);

  return (
    <section>
      <SiteStatus site={site} t={t} e={e} mk={mk} st={statsList[foc]} eclipses={eclipses} />
      <SkyView site={site} e={e} mk={mk} />
      <TimelineChart site={site} eclipses={eclipses} />
      <div className="lg">
        <span><i style={{ background: '#ffb83d' }} />Sol sobre el horizonte</span>
        <span><i style={{ background: '#4aa3ff' }} />Tierra visible</span>
        <span><i style={{ background: '#5fd7c8' }} />Ambos a la vez</span>
        <span><i style={{ background: '#ff7ab6' }} />Eclipse de Sol por la Tierra</span>
      </div>
      <p className="note">Toca o arrastra la gráfica de 30 días para cambiar la fecha.</p>
    </section>
  );
}
