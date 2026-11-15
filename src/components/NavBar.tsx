import { useI18n } from '../i18n/useI18n';

/** Barra de botones que salta a cada sección. */
export default function NavBar() {
  const { data } = useI18n();
  return (
    <div className="nv">
      {data.NAV_ITEMS.map(([id, label]) => (
        <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
          {label}
        </button>
      ))}
    </div>
  );
}
