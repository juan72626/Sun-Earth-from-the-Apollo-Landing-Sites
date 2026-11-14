import { RESEARCH } from '../data/content';

export default function ResearchSection() {
  return (
    <section id="s6">
      <h2>Lo que dice la investigación</h2>
      <ul className="cx">{RESEARCH.map((t) => <li key={t}>{t}</li>)}</ul>
    </section>
  );
}
