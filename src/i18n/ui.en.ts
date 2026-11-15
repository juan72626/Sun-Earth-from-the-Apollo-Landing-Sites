import type { Dict } from './ui.es';

const pct = (n: string | number): string => `${n}%`;

/** Interface texts in English. */
export const en: Dict = {
  lang: 'en',
  htmlTitle: 'Light and Link on the Moon',
  pct,
  sem: (p: number): string => (p >= 60 ? 'high' : p >= 25 ? 'medium' : 'low'),
  and: ' and ',
  close: 'Close',

  toggle: { group: 'Idioma / Language' },

  header: {
    title: 'Light and Link on the Moon',
    sub: 'Compare landing sites and dates based on where the Sun and Earth are in the lunar sky.',
  },

  time: {
    dateLabel: 'Date and time (UTC)',
    now: 'Now',
    mask: 'Horizon mask (°)',
    speed: 'Speed',
    speeds: ['1 hour per second', '6 hours per second', '1 day per second', '3 days per second'],
    pause: 'Pause',
    play: 'Play',
    note: 'At the poles the Sun barely rises above 1.5°, so 100 m of terrain relief changes the result. Raise the mask to simulate mountains on the horizon.',
  },

  live: {
    sun: 'Sun above the horizon',
    earth: 'Earth visible',
    both: 'Both at once',
    eclipse: 'Solar eclipse by Earth',
    note: 'Tap or drag the 30-day chart to change the date.',
  },

  status: {
    badgeBoth: 'Power and link available',
    badgeSun: 'Solar power only',
    badgeEarth: 'Earth link only',
    badgeNone: 'No Sun or Earth',
    sun: 'Sun',
    earth: 'Earth',
    above: 'Above the horizon',
    below: 'Below the horizon',
    noEvent: (body, up) => {
      const word = body === 's' ? (up ? 'sunset' : 'sunrise') : up ? 'Earthset' : 'Earthrise';
      return `No ${word} in 45 days`;
    },
    event: (body, up, d) => {
      const word = body === 's' ? (up ? 'Sunset' : 'Sunrise') : up ? 'Earthset' : 'Earthrise';
      return `${word} in ${d}`;
    },
    summary: (a) =>
      `Over the next 30 days the Sun reaches at most ${a.ms}° and Earth reaches ${a.me}°. Both are above the horizon ${a.c} of the time. The longest solar night lasts ${a.night ?? 'less than 1 h'}. The longest window with Sun and Earth at the same time lasts ${a.win ?? '0 min'}.${a.ref ? ' That reaches the 6.5 days NASA used as a reference for Artemis III.' : ''}`,
    windowSince: (d, since) => `${d} (from ${since})`,
    searching: 'Searching for eclipses…',
    eclipsesNone: 'Solar eclipses by Earth: none in the next 120 days.',
    eclipsesHead: 'Solar eclipses by Earth (Earth blocks the Sun), next 120 days: ',
    eclipseItem: (a, b, d, total, sunDown) =>
      `${a} to ${b} (${d}, ${total ? 'total' : 'partial'}${sunDown ? ', with the Sun below the horizon' : ''})`,
    power: (p) =>
      `Relative solar power (100% = panel tracking the Sun, with the Sun overhead): right now, horizontal panel ${pct(p.nowH)} and steerable vertical panel ${pct(p.nowV)}; 30-day average, horizontal ${pct(p.avgH)} and vertical ${pct(p.avgV)}. With the Sun very low, as at the poles, a vertical panel produces much more than a horizontal one.`,
  },

  globe: {
    title: 'Lunar globe',
    sun: 'Sun',
    earth: 'Earth',
    fromEarth: 'View from Earth',
    chosenSite: 'View the chosen site',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    satellites: (on) => `Satellites: ${on ? 'on' : 'off'}`,
    note: 'Light and shadow follow the real position of the Sun. Dot colors (the same on the globe, the map, the table and the info sheet): green = safe, yellow = caution, red = dangerous or unsafe, purple = candidate. Tapping a site zooms the globe in on it; use Zoom in and Zoom out to adjust. Satellites (each with its own illustration and orbit) are drawn at a compressed scale and their orbits are illustrative: tap one, or its button, to see its name and what it contributed. Drag to rotate and tap a dot to see its info sheet: when it was visited, who was involved and why it is safe, risky or a candidate. Out of view from Earth you will see the Sun (a golden sphere with rays, farther away) and Earth (a blue sphere with oceans and continents, closer), each with its name and a line pointing toward it. Earth shows phases because the Sun lights it, and it rotates as time passes.',
  },

  polar: {
    title: 'South pole map',
    radius: (r) => `Radius ${r}°`,
    atPole: (xs, sunUp, xe, earthUp) =>
      `At the pole: the Sun is ${xs}° ${sunUp ? 'above' : 'below'} the horizon and Earth is ${xe}° ${earthUp ? 'above' : 'below'} the horizon.`,
    candidateSuffix: ', candidate',
    howTo: 'How to read it: the map is seen from above the south pole, with 0° pointing toward Earth and east to the right. The yellow side is where sunlight comes from and the dark side is shadow. Each number is a site from the list above; if two are very close together they are nudged apart and a thin line marks their real location. Colors: green safe, yellow caution, red dangerous or unsafe, purple candidate (the same as on the globe and the table). The dashed violet line is the 6° latitude limit NASA set for Artemis. The radius buttons zoom in on the pole.',
  },

  compare: {
    title: 'Compare sites',
    sortBy: 'Sort by',
    sortOptions: ['Original order', 'Best light and link', 'Closest to the south pole', 'Candidates first', 'Most radio quiet'],
    show: 'Show',
    filterOptions: ['All sites', 'Safe only', 'Candidates only', 'Far side only (longitude beyond 90°)'],
    colSite: 'Site and category',
    colSun: 'Sun',
    colEarth: 'Earth',
    colLight: 'Light and link (30 days)',
    risk: 'risk',
    legend: 'Blue bar: time with Sun and Earth at once (high: 60% or more, medium: 25 to 60%, low: under 25%)',
    note: 'Under each name is its category, in the same color as on the globe: safe (green), caution (yellow), unsafe (red) or candidate (purple, with its estimated risk in parentheses). On the right, the blue bar is the percentage of the next 30 days with both Sun and Earth above the horizon (light and link); it does not measure terrain risk. Tap a row to see it on the globe with its info sheet.',
    customTitle: 'Custom coordinates',
    lat: 'Latitude',
    lon: 'Longitude (east +)',
    add: 'Add',
    coordsError: 'Latitude between −90 and 90, longitude between −180 and 180 (east positive).',
    customName: (n) => `Custom ${n}`,
  },

  zones: {
    title: 'What a safe zone and a dangerous zone look like',
    intro: 'Animated, schematic drawing: on top, a lander descends to a suitable zone; below, to a dangerous one.',
    okTitle: 'A zone where landing is possible (green)',
    badTitle: 'A zone where landing is not possible (red)',
    legend: 'Yellow (caution): landing is possible, but with known risks such as rocks, moderate slopes, low light or reliance on a relay. Purple (candidate): a proposed place with no proven landing yet; its estimated risk is in the info sheet.',
    photos: 'Real LROC photos (NASA):',
  },

  relay: {
    title: 'Far side and relay satellites',
    intro: 'From the far side Earth is never visible, so a relay satellite is needed. In exchange, the Moon blocks Earth’s radio noise, which is ideal for radio telescopes. L2 relay is the time a satellite in a halo orbit around the Earth–Moon L2 point (Queqiao-1 style) is above the horizon; radio quiet is the time with Earth more than 1° below the horizon; total link is direct Earth or relay.',
    pointBelow: 'Point on the Moon directly below the L2 halo today:',
    coord: (la, ns, lo, ew) => `${la}° ${ns}, ${lo}° ${ew === 'O' ? 'W' : 'E'}`,
    pointNote: 'It is also the point with the most radio quiet, and it moves by up to about 8° over the month.',
    colSite: 'Site',
    colL2: 'L2 relay',
    colQuiet: 'Radio quiet',
    colTotal: 'Total link',
    whereTitle: 'Where to send a satellite',
  },

  reco: {
    title: 'Site and date recommender',
    intro: 'Tell me what you need and I will suggest the sites and the first moment in the next 120 days that meets it. It uses the current horizon mask. Tap a result to jump to that date.',
    days: 'Consecutive days of Sun',
    link: 'Link with Earth',
    linkOptions: ['Direct Earth', 'Direct Earth or L2 relay', 'No link needed'],
    sites: 'Sites',
    kindOptions: { '2': 'Green and yellow', '1': 'Green only (safe)', '3': 'Candidates only', '0': 'All' },
    orderBy: 'Sort by',
    orderOptions: ['Earliest date', 'Longest window', 'Safest first'],
    search: 'Search',
    busy: 'Searching…',
    found: (n) => `${n} sites qualify. The colored dot is the site’s category.`,
    recommended: 'Recommended: ',
    nowLabel: 'now',
    daysShort: (d) => `${d} d`,
    none: 'No site meets that in the next 120 days. Try fewer days, an L2 relay or more site types.',
    withoutWindow: (d, names) => `No ${d}-day window in 120 days: ${names}.`,
  },

  calendar: {
    title: '12-month calendar',
    intro: 'Each cell is one day: lighter means more hours with Sun and Earth at once. It is calculated for the site chosen above, starting from the month of the chosen date. It shows the pole’s seasons and how much the result changes when you move the date by a few days.',
    show: 'Show',
    modeOptions: ['Sun and Earth at once', 'Sun only', 'Earth only'],
    modeText: ['hours with Sun and Earth at once', 'hours with the Sun', 'hours with Earth'],
    calc: 'Calculate',
    hint: 'Tap Calculate to see the calendar for the chosen site.',
    calculating: (name, p) => (p === undefined ? `Calculating… (${name})` : `Calculating… ${p}% (${name})`),
    legend: (name, mode) =>
      `${name}: ${mode} each day (dark 0 h, light 24 h). The white box is the chosen date. Tap a cell to jump to that day.`,
  },

  research: { title: 'What the research says' },
  sources: { title: 'Sources' },

  sheet: {
    candidate: 'Candidate',
    estimatedRisk: 'Estimated risk: ',
    light30: (p, s) => `Light and link over 30 days: ${pct(p)} (${s})`,
    quiet: (p) => `Radio quiet: ${pct(p)}`,
    linkTotal: (p) => `Total link with relay: ${pct(p)}`,
    when: 'When',
    who: 'Who',
    what: 'What happened',
    why: 'Why',
    satWhat: 'What it is',
    satContribution: 'What it contributed',
    satOrbit: 'Orbit',
    satAlt: (n) => `Schematic illustration of ${n}`,
    satNote: 'Schematic illustration, not a photo; the scale and orbit on the globe are illustrative.',
  },

  canvas: {
    sun: 'Sun',
    earth: 'Earth',
    cardinals: ['N', 'E', 'S', 'W'],
    artemisLimit: 'Artemis limit 6°',
    meridians: ['0° (Earth)', '90°E', '180° (far side)', '90°W'],
    radius: (S, km) => `Radius ${S}° (~${km} km)`,
    earthInView: 'Earth in view',
    slope: (deg) => `Slope of about ${deg}°`,
    zoneBad: 'Dangerous zone',
    zoneOk: 'Suitable zone',
    zoneBadDesc: 'Grazing Sun and long shadows; the terrain blocks Earth',
    zoneOkDesc: 'Nearly flat terrain, few small rocks, high Sun and Earth visible',
    noLink: 'No link with Earth',
  },
};
