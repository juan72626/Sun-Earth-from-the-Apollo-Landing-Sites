import type { Lang } from './types';

const pct = (n: string | number): string => `${n} %`;

/** Textos de la interfaz en español (es también la forma de la que se deriva `Dict`). */
export const es = {
  lang: 'es' as Lang,
  htmlTitle: 'Luz y enlace en la Luna',
  pct,
  sem: (p: number): string => (p >= 60 ? 'alta' : p >= 25 ? 'media' : 'baja'),
  and: ' y ',
  close: 'Cerrar',

  toggle: { group: 'Idioma / Language' },

  header: {
    title: 'Luz y enlace en la Luna',
    sub: 'Compara sitios y fechas de alunizaje según dónde están el Sol y la Tierra en el cielo lunar.',
  },

  time: {
    dateLabel: 'Fecha y hora (UTC)',
    now: 'Ahora',
    mask: 'Máscara de horizonte (°)',
    speed: 'Velocidad',
    speeds: ['1 hora por segundo', '6 horas por segundo', '1 día por segundo', '3 días por segundo'],
    pause: 'Pausar',
    play: 'Reproducir',
    note: 'En los polos el Sol casi no sube de 1,5°, así que un relieve de 100 m cambia el resultado. Sube la máscara para simular montañas en el horizonte.',
  },

  live: {
    sun: 'Sol sobre el horizonte',
    earth: 'Tierra visible',
    both: 'Ambos a la vez',
    eclipse: 'Eclipse de Sol por la Tierra',
    note: 'Toca o arrastra la gráfica de 30 días para cambiar la fecha.',
  },

  status: {
    badgeBoth: 'Energía y enlace disponibles',
    badgeSun: 'Solo energía solar',
    badgeEarth: 'Solo enlace con la Tierra',
    badgeNone: 'Sin Sol ni Tierra',
    sun: 'Sol',
    earth: 'Tierra',
    above: 'Sobre el horizonte',
    below: 'Bajo el horizonte',
    /** body: 's' | 'e'; up: ahora está sobre el horizonte (el próximo evento es la puesta). */
    noEvent: (_body: 's' | 'e', up: boolean): string =>
      `Sin ${up ? 'puesta' : 'salida'} en 45 días`,
    event: (body: 's' | 'e', up: boolean, d: string): string =>
      `${up ? 'Puesta' : 'Salida'} ${body === 's' ? 'del Sol' : 'de la Tierra'} en ${d}`,
    summary: (a: { ms: string; me: string; c: string; night: string | null; win: string | null; ref: boolean }): string =>
      `En los próximos 30 días el Sol llega como máximo a ${a.ms}° y la Tierra a ${a.me}°. Ambos están sobre el horizonte el ${a.c} del tiempo. La noche solar más larga dura ${a.night ?? 'menos de 1 h'}. La mayor ventana con Sol y Tierra a la vez dura ${a.win ?? '0 min'}.${a.ref ? ' Eso alcanza los 6,5 días que NASA usó como referencia para Artemis III.' : ''}`,
    windowSince: (d: string, since: string): string => `${d} (desde el ${since})`,
    searching: 'Buscando eclipses…',
    eclipsesNone: 'Eclipses de Sol por la Tierra: ninguno en los próximos 120 días.',
    eclipsesHead: 'Eclipses de Sol por la Tierra (la Tierra tapa al Sol), próximos 120 días: ',
    eclipseItem: (a: string, b: string, d: string, total: boolean, sunDown: boolean): string =>
      `${a} a ${b} (${d}, ${total ? 'total' : 'parcial'}${sunDown ? ', con el Sol bajo el horizonte' : ''})`,
    power: (p: { nowH: string; nowV: string; avgH: string; avgV: string }): string =>
      `Potencia solar relativa (100 % = panel que sigue al Sol, con el Sol arriba): ahora, panel horizontal ${pct(p.nowH)} y panel vertical orientable ${pct(p.nowV)}; promedio de 30 días, horizontal ${pct(p.avgH)} y vertical ${pct(p.avgV)}. Con el Sol muy bajo, como en los polos, un panel vertical produce mucho más que uno horizontal.`,
  },

  globe: {
    title: 'Globo lunar',
    sun: 'Sol',
    earth: 'Tierra',
    fromEarth: 'Ver desde la Tierra',
    chosenSite: 'Ver el sitio elegido',
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
    satellites: (on: boolean): string => `Satélites: ${on ? 'sí' : 'no'}`,
    note: 'La luz y la sombra siguen la posición real del Sol. Colores de los puntos (los mismos en el globo, el mapa, la tabla y la ficha): verde = seguro, amarillo = precaución, rojo = peligro o no seguro, morado = candidato. Al tocar un sitio el globo se acerca a él; con Acercar y Alejar ajustas el zoom. Los satélites (cada uno con su ilustración y su órbita) están a una escala comprimida y sus órbitas son ilustrativas: toca uno, o su botón, para ver su nombre y en qué aportó. Arrastra para girar y toca un punto para ver su ficha: cuándo se visitó, quiénes fueron y por qué es seguro, riesgoso o candidato. Fuera de la vista desde la Tierra aparecen el Sol (esfera dorada con rayos, más lejos) y la Tierra (esfera azul con océanos y continentes, más cerca), cada uno con su nombre y una línea que apunta hacia él. La Tierra se ve con fase porque la ilumina el Sol, y gira con el paso del tiempo.',
  },

  polar: {
    title: 'Mapa del polo sur',
    radius: (r: number): string => `Radio ${r}°`,
    atPole: (xs: string, sunUp: boolean, xe: string, earthUp: boolean): string =>
      `En el polo: el Sol está ${xs}° ${sunUp ? 'sobre' : 'bajo'} el horizonte y la Tierra ${xe}° ${earthUp ? 'sobre' : 'bajo'} el horizonte.`,
    candidateSuffix: ', candidato',
    howTo: 'Cómo leerlo: el mapa se ve desde arriba del polo sur, con el 0° hacia la Tierra y el este a la derecha. El lado amarillo es de donde llega la luz del Sol y el oscuro es la sombra. Cada número es un sitio de la lista de arriba; si dos quedan muy juntos se separan un poco y una línea fina marca su lugar real. Colores: verde seguro, amarillo precaución, rojo peligro o no seguro, morado candidato (los mismos que en el globo y la tabla). La línea punteada violeta es el límite de 6° de latitud que pidió NASA para Artemis. Con los botones de radio acercas el polo.',
  },

  compare: {
    title: 'Comparar sitios',
    sortBy: 'Ordenar por',
    sortOptions: ['Orden original', 'Mejor luz y enlace', 'Más cerca del polo sur', 'Candidatos primero', 'Más silencio de radio'],
    show: 'Mostrar',
    filterOptions: ['Todos los sitios', 'Solo seguros', 'Solo candidatos', 'Solo hemisferio oculto (longitud mayor a 90°)'],
    colSite: 'Sitio y categoría',
    colSun: 'Sol',
    colEarth: 'Tierra',
    colLight: 'Luz y enlace (30 días)',
    risk: 'riesgo',
    legend: 'Barra azul: tiempo con Sol y Tierra a la vez (alta: 60 % o más, media: 25 a 60 %, baja: menos de 25 %)',
    note: 'Bajo cada nombre está su categoría, con el mismo color que en el globo: seguro (verde), precaución (amarillo), no seguro (rojo) o candidato (morado, con su riesgo estimado entre paréntesis). A la derecha, la barra azul es el porcentaje de los próximos 30 días con Sol y Tierra a la vez sobre el horizonte (luz y enlace); no mide el riesgo del terreno. Toca una fila para verla en el globo con su ficha.',
    customTitle: 'Coordenadas propias',
    lat: 'Latitud',
    lon: 'Longitud (este +)',
    add: 'Agregar',
    coordsError: 'Latitud entre −90 y 90, longitud entre −180 y 180 (este positivo).',
    customName: (n: number): string => `Personalizado ${n}`,
  },

  zones: {
    title: 'Cómo se ve una zona segura y una peligrosa',
    intro: 'Dibujo animado y esquemático: arriba baja un módulo a una zona apta; abajo, a una peligrosa.',
    okTitle: 'Zona donde sí se puede aterrizar (verde)',
    badTitle: 'Zona donde no se puede aterrizar (rojo)',
    legend: 'Amarillo (precaución): se puede aterrizar, pero con riesgos conocidos, como rocas, pendientes moderadas, luz baja o dependencia de un relevo. Morado (candidato): lugar propuesto que aún no tiene un aterrizaje probado; su riesgo estimado está en la ficha.',
    photos: 'Fotos reales de LROC (NASA):',
  },

  relay: {
    title: 'Lado oculto y satélites de relevo',
    intro: 'Desde la cara oculta la Tierra nunca se ve, así que hace falta un satélite de relevo. A cambio, la Luna bloquea el ruido de radio de la Tierra, ideal para radiotelescopios. Relevo L2 es el tiempo con un satélite en halo sobre el punto L2 Tierra–Luna (tipo Queqiao-1) por encima del horizonte; silencio de radio es el tiempo con la Tierra más de 1° bajo el horizonte; enlace total es Tierra directa o relevo.',
    pointBelow: 'Punto de la Luna justo debajo del halo L2 hoy:',
    coord: (la: string, ns: 'S' | 'N', lo: string, ew: 'O' | 'E'): string => `${la}° ${ns}, ${lo}° ${ew}`,
    pointNote: 'Es también el punto de mayor silencio de radio y se mueve hasta unos 8° a lo largo del mes.',
    colSite: 'Sitio',
    colL2: 'Relevo L2',
    colQuiet: 'Silencio de radio',
    colTotal: 'Enlace total',
    whereTitle: 'Dónde enviar un satélite',
  },

  reco: {
    title: 'Recomendador de sitio y fecha',
    intro: 'Dime qué necesitas y te propongo los sitios y el primer momento de los próximos 120 días que lo cumple. Usa la máscara de horizonte actual. Toca un resultado para ir a esa fecha.',
    days: 'Días seguidos con Sol',
    link: 'Enlace con la Tierra',
    linkOptions: ['Tierra directa', 'Tierra directa o relevo L2', 'No necesito enlace'],
    sites: 'Sitios',
    kindOptions: { '2': 'Verdes y amarillos', '1': 'Solo verdes (seguros)', '3': 'Solo candidatos', '0': 'Todos' } as Record<string, string>,
    orderBy: 'Ordenar por',
    orderOptions: ['Fecha más pronto', 'Ventana más larga', 'Más seguro primero'],
    search: 'Buscar',
    busy: 'Buscando…',
    found: (n: number): string => `${n} sitios cumplen. El punto de color es la categoría del sitio.`,
    recommended: 'Recomendado: ',
    nowLabel: 'ahora',
    daysShort: (d: string): string => `${d} d`,
    none: 'Ningún sitio cumple eso en los próximos 120 días. Prueba con menos días, con relevo L2 o con más tipos de sitio.',
    withoutWindow: (d: string, names: string): string => `Sin ventana de ${d} d en 120 días: ${names}.`,
  },

  calendar: {
    title: 'Calendario de 12 meses',
    intro: 'Cada casilla es un día: más clara significa más horas con Sol y Tierra a la vez. Se calcula para el sitio elegido arriba, desde el mes de la fecha elegida. Muestra las estaciones del polo y cuánto cambia el resultado al mover la fecha unos días.',
    show: 'Mostrar',
    modeOptions: ['Sol y Tierra a la vez', 'Solo Sol', 'Solo Tierra'],
    modeText: ['horas con Sol y Tierra a la vez', 'horas con Sol', 'horas con la Tierra'],
    calc: 'Calcular',
    hint: 'Toca Calcular para ver el calendario del sitio elegido.',
    calculating: (name: string, p?: number): string => (p === undefined ? `Calculando… (${name})` : `Calculando… ${p} % (${name})`),
    legend: (name: string, mode: string): string =>
      `${name}: ${mode} de cada día (oscuro 0 h, claro 24 h). El recuadro blanco es la fecha elegida. Toca una casilla para ir a ese día.`,
  },

  research: { title: 'Lo que dice la investigación' },
  sources: { title: 'Fuentes' },

  sheet: {
    candidate: 'Candidato',
    estimatedRisk: 'Riesgo estimado: ',
    light30: (p: number, s: string): string => `Luz y enlace en 30 días: ${pct(p)} (${s})`,
    quiet: (p: number): string => `Silencio de radio: ${pct(p)}`,
    linkTotal: (p: number): string => `Enlace total con relevo: ${pct(p)}`,
    when: 'Cuándo',
    who: 'Quiénes',
    what: 'Qué se hizo',
    why: 'Por qué',
    satWhat: 'Qué es',
    satContribution: 'En qué aportó',
    satOrbit: 'Órbita',
    satAlt: (n: string): string => `Ilustración esquemática de ${n}`,
    satNote: 'Ilustración esquemática, no es una foto; la escala y la órbita en el globo son ilustrativas.',
  },

  /** Textos dibujados en canvas. */
  canvas: {
    sun: 'Sol',
    earth: 'Tierra',
    cardinals: ['N', 'E', 'S', 'O'],
    artemisLimit: 'límite Artemis 6°',
    meridians: ['0° (Tierra)', '90°E', '180° (lado oculto)', '90°O'],
    radius: (S: number, km: number): string => `Radio ${S}° (~${km} km)`,
    earthInView: 'Tierra a la vista',
    slope: (deg: number): string => `Pendiente de unos ${deg}°`,
    zoneBad: 'Zona peligrosa',
    zoneOk: 'Zona apta',
    zoneBadDesc: 'Sol casi rasante y sombras largas; el relieve tapa la Tierra',
    zoneOkDesc: 'Terreno casi plano, pocas rocas pequeñas, Sol alto y Tierra visible',
    noLink: 'Sin enlace con la Tierra',
  },
};

export type Dict = typeof es;
