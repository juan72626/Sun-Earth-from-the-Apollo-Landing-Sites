import CompareTable from './CompareTable';
import CustomCoords from './CustomCoords';
import { useI18n } from '../i18n/useI18n';

/** Sección "Comparar sitios": tabla + coordenadas propias. */
export default function CompareSection() {
  const { ui } = useI18n();
  return (
    <section id="s3">
      <h2>{ui.compare.title}</h2>
      <CompareTable />
      <CustomCoords />
    </section>
  );
}
