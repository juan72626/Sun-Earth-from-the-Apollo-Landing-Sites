import { useI18n } from '../i18n/useI18n';

export default function ResearchSection() {
  const { ui, data } = useI18n();
  return (
    <section id="s6">
      <h2>{ui.research.title}</h2>
      <ul className="cx">{data.RESEARCH.map((t) => <li key={t}>{t}</li>)}</ul>
    </section>
  );
}
