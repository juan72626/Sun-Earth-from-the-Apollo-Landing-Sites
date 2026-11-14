import NavBar from './NavBar';
import { COLOR_KEY } from '../data/content';

/** Título, navegación y leyenda de colores del semáforo. */
export default function Header() {
  return (
    <>
      <h1>Luz y enlace en la Luna</h1>
      <p className="sub">Compara sitios y fechas de alunizaje según dónde están el Sol y la Tierra en el cielo lunar.</p>
      <NavBar />
      <div className="lg" style={{ margin: '0 0 12px' }}>
        {COLOR_KEY.map(([c, label]) => (
          <span key={c}><i style={{ background: c }} />{label}</span>
        ))}
      </div>
    </>
  );
}
