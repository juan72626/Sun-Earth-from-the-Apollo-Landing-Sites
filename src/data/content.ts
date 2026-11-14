/* Textos estáticos de las secciones */

export const NAV_ITEMS: [id: string, label: string][] = [
  ['s1', 'Globo'],
  ['s2', 'Mapa polar'],
  ['s3', 'Comparar'],
  ['s8', 'Zonas'],
  ['s4', 'Relevos'],
  ['s5', 'Recomendador'],
  ['s9', 'Calendario'],
  ['s6', 'Investigación'],
  ['s7', 'Fuentes'],
];

export const COLOR_KEY: [color: string, label: string][] = [
  ['#34d65a', 'Verde: seguro'],
  ['#ffd23f', 'Amarillo: precaución'],
  ['#ff4d4d', 'Rojo: peligro o no seguro'],
  ['#b48cff', 'Morado: candidato'],
];

export const ZONE_OK: string[] = [
  'Terreno casi plano: pendiente menor a 10° a escala de 100 m (requisito de NASA para Artemis) y menor a 20° a 2 km para caminar.',
  'Pocas rocas grandes y pocos cráteres profundos; suelo liso, como el de un mar lunar.',
  'Sol a una altura suficiente para ver el terreno: con el Sol muy bajo, las sombras largas esconden rocas y huecos.',
  'La Tierra a la vista (enlace directo) o un satélite de relevo, y sin zonas de sombra permanente.',
];

export const ZONE_BAD: string[] = [
  'Pendientes fuertes, como las paredes de cráteres y de pozos: el módulo puede volcar (IM-1 e IM-2 quedaron inclinado y de lado en terreno con pendiente).',
  'Campos de rocas y bordes de pozos con paredes verticales.',
  'Sombra permanente y frío extremo, o un Sol casi rasante que oculta los peligros.',
  'Relieve que bloquea la Tierra: sin enlace directo.',
];

export const LROC_LINKS: [href: string, label: string][] = [
  ['https://www.lroc.asu.edu/images/1314', 'zona de aterrizaje de Chandrayaan-3'],
  ['https://www.lroc.asu.edu/images/1247', 'cresta iluminada entre Shackleton y de Gerlache'],
  ['https://www.lroc.asu.edu/atlases/pits/3', 'pozo de Mare Tranquillitatis'],
  ['https://www.lroc.asu.edu/atlases/pits/1', 'pozo de Marius Hills'],
  ['https://lroc.im-ldi.com/posts/1294', 'Malapert Massif'],
];

export const RELAY_TIPS: string[] = [
  'Halo en torno al punto L2 Tierra–Luna (tipo Queqiao-1): a unos 61.500 km de la Luna, justo en la dirección opuesta a la Tierra. El punto de la Luna que queda debajo es el de la línea de arriba y siempre está cerca de 0° de latitud y 180° de longitud. Da enlace casi continuo a la cara oculta y, cuando la Tierra no se ve, también al polo sur.',
  'Órbita elíptica congelada de 200 × 16.000 km (tipo Queqiao-2): periodo de 24 h e inclinación de 62,4°. Ve a la vez la Tierra y la cara oculta durante buena parte de la órbita y sirve también al polo sur.',
  'Relevos previstos con Blue Ghost 2: Elytra Dark y Lunar Pathfinder darán enlace a LuSEE-Night, que se posará en 23,81°S, 176,83°E.',
  'Órbita NRHO (CAPSTONE, Gateway): pasa a ~1.500 km del polo norte y a ~70.000 km del polo sur, con periodo de ~6,5 días. Es la órbita desde la que bajarían los módulos de Artemis.',
  'Las órbitas reales dependen del diseño de cada misión; aquí se muestran como referencia.',
];

export const RESEARCH: string[] = [
  'Eje casi vertical: la Luna se inclina solo 1,54°, así que en el polo exacto el Sol sube como mucho ~1,5°. NASA resume que Sol y Tierra suben solo de 2 a 7° y que la Tierra se ve dos semanas sí y dos no.',
  'El relieve manda. Cerca del borde de Shackleton hay un punto con luz continua 240 días al año y noche máxima de ~1,5 días (Mazarico y otros, 2011). En Connecting Ridge se calculó luz el 92 % del tiempo a 2 m de altura y el 96 % a 10 m (Gläser y otros, 2014). LROC halló zonas con luz casi el 94 % del año y noche máxima de 43 h.',
  'Requisitos de NASA para Artemis III: menos de 6° de latitud, pendiente menor a 10° (100 m) y a 20° (2 km), enlace directo con la Tierra sin relevo, luz en superficie y en la aproximación, y precisión de 100 m.',
  'Programa: Artemis II voló el 1 de abril de 2026. Artemis III es ahora una prueba en órbita baja en 2027 y el primer alunizaje (Artemis IV) está previsto para 2028 cerca del polo sur.',
  'Las 13 regiones de 2022 miden ~15 × 15 km: Faustini Rim A, Peak Near Shackleton, Connecting Ridge, Connecting Ridge Extension, de Gerlache Rim 1 y 2, de Gerlache–Kocher Massif, Haworth, Malapert Massif, Leibnitz Beta Plateau, Nobile Rim 1 y 2 y Amundsen Rim.',
  'CLPS: Peregrine falló, IM-1 quedó inclinado, Blue Ghost 1 tuvo éxito e IM-2 quedó de lado. Siguen Griffin-1 (no antes de noviembre de 2026), Blue Moon MK1 e IM-3 (inicios de 2027), Blue Ghost 2 (2027), Blue Ghost 3 (2028) y Blue Ghost 4 (2029).',
  'China: Chang’e-7 apunta a la cresta sureste de Shackleton y Chang’e-8 (2028-29) a Leibnitz Beta.',
  'Criterios de riesgo de las fichas: pendiente y rocas, precisión de navegación, altura del Sol, enlace con la Tierra e historial de la misión. Un estudio de ESA y PTScientists calificó como riesgo alto los sitios casi en el polo por el Sol muy bajo, y como bajo uno ecuatorial con Sol alto y comunicación directa.',
  'Fuentes dudosas descartadas: hay páginas que dicen que NASA ya fijó Malapert para Artemis III en 2026. Contradicen los anuncios oficiales, así que no las usé.',
  'Satélites que ayudaron al tema: Clementine (1994) y Lunar Prospector (1998–99) dieron las primeras pistas de zonas casi siempre iluminadas y de hidrógeno en los polos; Chandrayaan-1 (2008–09) detectó agua en la superficie; SMART-1 (2003–06) y Kaguya (2007–09) cartografiaron relieve y luz; LCROSS (2009) confirmó agua en Cabeus; LRO (desde 2009) aportó los mapas de detalle; Danuri con ShadowCam (desde 2022) mira dentro de los cráteres oscuros.',
  'Radio y lado oculto: LuSEE-Night se posará cerca del cráter Nassau, casi en el antípoda de la Tierra, para evitar su ruido de radio; el módulo se apagará tras el primer día para no generar interferencias propias y los datos volverán por satélites de relevo (Lunar Pathfinder y Elytra Dark). Chang’e-4 dependió de Queqiao-1 y Chang’e-6 de Queqiao-2.',
];

export const SOURCES: string[] = [
  'NASA, presentación Artemis Overview para el reto Space Apps 2025 (NTRS 20250009323): requisitos de aterrizaje, Sol y Tierra a 2 a 7° del horizonte y ciclo de visibilidad de la Tierra.',
  'Mazarico y otros (2011) y Gläser y otros (2014), ambos en Icarus: iluminación polar con datos de LOLA. LROC (Universidad Estatal de Arizona): luz en el borde de Shackleton, Connecting Ridge y atlas de pozos lunares.',
  'LPI/USRA, taller Artemis III Science Definition (resumen 2042): cráteres de Peak Near Shackleton y Faustini Rim A.',
  'USGS Gazetteer of Planetary Nomenclature, ESA y Wikipedia: coordenadas de cráteres (Nobile, Haworth, Amundsen, de Gerlache).',
  'NSSDCA de NASA: coordenadas de aterrizajes (Chandrayaan-3, SLIM, IM-1, Chang’e-4, 5 y 6, Blue Ghost 1).',
  'Brookhaven National Laboratory y Firefly Aerospace: LuSEE-Night y Blue Ghost 2. SpaceNews, The Planetary Society y Wikipedia: Queqiao-1 y 2, Chang’e-7 y estado de CLPS y Artemis.',
  'Astronomy Engine: posiciones del Sol y de la Luna. Los resúmenes de cada ficha y la clasificación de riesgo (salvo la de los sitios Apolo, que viene de la clasificación original del proyecto) son elaboración propia y orientativa.',
];

export const FOOTER_NOTE: string =
  'Cálculo con las efemérides de Astronomy Engine, incluida la libración. La Luna se trata como una esfera sin relieve: el horizonte es la máscara que indiques (Sol: borde superior; Tierra: centro). Los sitios marcados como centro, cráter u objetivo son referencias dentro de una región, no puntos de aterrizaje decididos, y sus coordenadas son aproximadas. En las fichas, la clasificación de aterrizaje de los sitios Apolo es la original del proyecto; el resto es una evaluación propia según historial, pendiente, luz y enlace, y es solo orientativa. La fórmula de posición del Sol se comprobó con una efeméride independiente simplificada: reproduce la elevación solar de los alunizajes del Apolo con diferencias cercanas a 1° o menos (por ejemplo, 10,6° calculado frente a unos 10,8° documentados en el Apolo 11).';
