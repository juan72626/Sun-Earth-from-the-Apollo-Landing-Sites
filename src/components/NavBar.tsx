import { NAV_ITEMS } from '../data/content';

/** Barra de botones que salta a cada sección. */
export default function NavBar() {
  return (
    <div className="nv">
      {NAV_ITEMS.map(([id, label]) => (
        <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
          {label}
        </button>
      ))}
    </div>
  );
}
