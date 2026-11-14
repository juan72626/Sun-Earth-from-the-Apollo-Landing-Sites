import { SOURCES } from '../data/content';

export default function SourcesSection() {
  return (
    <section id="s7">
      <h2>Fuentes</h2>
      <ul className="cx">{SOURCES.map((t) => <li key={t}>{t}</li>)}</ul>
    </section>
  );
}
