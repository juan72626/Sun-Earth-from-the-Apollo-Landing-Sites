import type { SatIllustration, Satellite } from '../types';

/* Satélites que ayudaron: datos y órbita ilustrativa (distancias comprimidas para verlos) */
export const SAT: Satellite[] = [
  { n: 'LRO', o: 'NASA', y: 'Desde 2009', c: '#ffffff', d: 'Lunar Reconnaissance Orbiter, orbitador lunar de NASA.', ap: 'Su altímetro láser LOLA y sus cámaras LROC produjeron los mapas de relieve y de luz con los que se eligen los sitios del polo sur. También localizó desde órbita naves en superficie, como Blue Ghost 1 y Chandrayaan-3.', ob: 'Polar baja, de decenas de km a unos 200 km de altura.', sa: 1.10, e: 0, i: 90, om: 0, w: 0, per: 2 },
  { n: 'Danuri', o: 'KARI (Corea del Sur) y NASA', y: 'Desde 2022', c: '#5de6ff', d: 'Danuri (KPLO), primer orbitador lunar de Corea del Sur.', ap: 'Lleva ShadowCam, de NASA, que fotografía el fondo de los cráteres en sombra permanente del polo sur con una sensibilidad unas 200 veces mayor que la de LROC, para ver el terreno donde nunca llega el Sol.', ob: 'Polar, a unos 100 km de altura.', sa: 1.15, e: 0, i: 90, om: 60, w: 0, per: 2 },
  { n: 'Chandrayaan-2', o: 'ISRO (India)', y: 'Desde 2019', c: '#ff9ad5', d: 'Orbitador de la misión Chandrayaan-2 de India.', ap: 'Sus cámaras de alta resolución ayudaron a elegir la zona de aterrizaje de Chandrayaan-3, y su antena sirvió de enlace con el módulo Vikram tras aterrizar.', ob: 'Polar, a unos 100 km de altura.', sa: 1.20, e: 0, i: 90, om: 120, w: 0, per: 2 },
  { n: 'Queqiao-1', o: 'CNSA (China)', y: 'Desde 2018', c: '#ff8a65', d: 'Queqiao (Puente de las Urracas), primer satélite de relevo para la cara oculta.', ap: 'Permitió comunicarse con Chang’e-4 y su rover Yutu-2, el primer aterrizaje en la cara oculta, donde la Tierra nunca se ve.', ob: 'Órbita halo en torno al punto L2 Tierra–Luna, a unos 65.000 a 70.000 km más allá de la Luna.', l2: 1, sa: 2.93, per: 336 },
  { n: 'Queqiao-2', o: 'CNSA (China)', y: 'Desde 2024', c: '#e6d6a8', d: 'Segundo satélite de relevo de China.', ap: 'Dio relevo a Chang’e-6, que trajo muestras de la cara oculta, y dará servicio a Chang’e-7 y Chang’e-8 en el polo sur. Ve a la vez la Tierra y la cara oculta durante buena parte de su órbita.', ob: 'Elíptica congelada de 200 × 16.000 km, 24 h e inclinación de 62,4°; pasará a 12 h para las misiones del polo sur.', sa: 1.885, e: 0.326, i: 62.4, om: 200, w: 90, per: 24 },
  { n: 'CAPSTONE', o: 'NASA', y: 'Desde 2022', c: '#9fb4ff', d: 'Pequeño satélite de NASA que probó la órbita NRHO.', ap: 'Comprobó en vuelo la órbita casi rectilínea en halo (NRHO) que usarán Gateway y los módulos de Artemis para bajar al polo sur, y probó un sistema de navegación autónomo.', ob: 'NRHO: pasa a ~1.500 km del polo norte y a ~70.000 km del polo sur, con periodo de ~6,5 días.', sa: 2.37, e: 0.253, i: 90, om: 20, w: 90, per: 156 },
];

/** Parámetros de la ilustración de cada satélite. */
export const SIC: Record<string, SatIllustration> = {
  'LRO': { bc: '#d8b24e', bw: 30, bh: 34, pl: 40, pn: 1, dr: 22 },
  'Danuri': { bc: '#cfd6e6', bw: 30, bh: 30, pl: 30, pn: 2, dr: 14 },
  'Chandrayaan-2': { bc: '#d9a441', bw: 30, bh: 32, pl: 40, pn: 1, dr: 20 },
  'Queqiao-1': { bc: '#d8b24e', bw: 30, bh: 34, pl: 28, pn: 2, dr: 46 },
  'Queqiao-2': { bc: '#e0c070', bw: 32, bh: 36, pl: 28, pn: 2, dr: 54 },
  'CAPSTONE': { bc: '#aeb7c9', bw: 20, bh: 26, pl: 28, pn: 2, dr: 0 },
};
