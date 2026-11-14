import CompareTable from './CompareTable';
import CustomCoords from './CustomCoords';

/** Sección "Comparar sitios": tabla + coordenadas propias. */
export default function CompareSection() {
  return (
    <section id="s3">
      <h2>Comparar sitios</h2>
      <CompareTable />
      <CustomCoords />
    </section>
  );
}
