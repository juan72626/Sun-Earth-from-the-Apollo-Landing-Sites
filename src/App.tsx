import { SimContext } from './hooks/SimContext';
import { useSimulation } from './hooks/useSimulation';
import { useI18n } from './i18n/useI18n';

import Header from './components/Header';
import TimeControls from './components/TimeControls';
import LivePanel from './components/LivePanel';
import GlobeSection from './components/GlobeSection';
import PolarMapSection from './components/PolarMapSection';
import CompareSection from './components/CompareSection';
import ZonesSection from './components/ZonesSection';
import RelaySection from './components/RelaySection';
import RecommenderSection from './components/RecommenderSection';
import CalendarSection from './components/CalendarSection';
import ResearchSection from './components/ResearchSection';
import SourcesSection from './components/SourcesSection';
import InfoSheet from './components/InfoSheet';

export default function App() {
  const sim = useSimulation();
  const { data } = useI18n();

  return (
    <SimContext.Provider value={sim}>
      <main>
        <Header />
        <TimeControls />
        <LivePanel />
        <GlobeSection />
        <PolarMapSection />
        <CompareSection />
        <ZonesSection />
        <RelaySection />
        <RecommenderSection />
        <CalendarSection />
        <ResearchSection />
        <SourcesSection />
        <InfoSheet />
        <p className="note">{data.FOOTER_NOTE}</p>
      </main>
    </SimContext.Provider>
  );
}
