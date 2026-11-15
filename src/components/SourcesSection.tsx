import { useI18n } from '../i18n/useI18n';

export default function SourcesSection() {
  const { ui, data } = useI18n();
  return (
    <section id="s7">
      <h2>{ui.sources.title}</h2>
      <ul className="cx">{data.SOURCES.map((t) => <li key={t}>{t}</li>)}</ul>
    </section>
  );
}
