import NavBar from './NavBar';
import LanguageToggle from './LanguageToggle';
import { useI18n } from '../i18n/useI18n';

/** Título, selector de idioma, navegación y leyenda de colores del semáforo. */
export default function Header() {
  const { ui, data } = useI18n();
  return (
    <>
      <div className="top">
        <h1>{ui.header.title}</h1>
        <LanguageToggle />
      </div>
      <p className="sub">{ui.header.sub}</p>
      <NavBar />
      <div className="lg" style={{ margin: '0 0 12px' }}>
        {data.COLOR_KEY.map(([c, label]) => (
          <span key={c}><i style={{ background: c }} />{label}</span>
        ))}
      </div>
    </>
  );
}
