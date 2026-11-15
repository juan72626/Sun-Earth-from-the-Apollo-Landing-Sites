import { I as I_ES } from '../siteInfo';
import type { SiteInfo, SiteLevel } from '../../types';

/* Info sheets in English: [when, who, what, why]. The level and the candidate flag are taken from the Spanish data so both languages always agree. */

export const LV: Record<SiteLevel, [name: string, color: string]> = {
  ok: ['Safe', '#34d65a'],
  wn: ['Caution', '#ffd23f'],
  bad: ['Unsafe', '#ff4d4d'],
  na: ['Unclassified', '#cfd3da'],
};

/** Default sheet for custom sites. */
export const DEFAULT_INFO: SiteInfo = [
  'na',
  0,
  '—',
  '—',
  'Custom site.',
  'No risk data: check the light and link in the table.',
];

const TEXTS: Record<string, [when: string, who: string, what: string, why: string]> = {
  'Polo sur': ['Never landed at the exact point', 'Nobody', 'Reference point: the Moon’s rotation axis comes out inside Shackleton crater.', 'Unsafe: the Sun barely rises above the horizon (maximum ~1.5°), shadows are extremely long and much of the terrain never receives light.'],
  'Shackleton (centro)': ['Studied from orbit since 2007', 'Kaguya (JAXA), SMART-1 (ESA) and LRO (NASA)', '~21 km crater: the floor is about 2.8 km below the reference and the highest point of the rim is at +1.7 km (Kaguya data).', 'Unsafe: the floor is in permanent shadow and very cold, with no solar power or link with Earth. Only the rim receives almost continuous light.'],
  'Chang’e-7 (objetivo)': ['Planned: the August 2026 launch was postponed because of weather', 'CNSA (China)', 'Orbiter, lander, rover and hopper probe, with a relay satellite, to look for water ice near Shackleton.', 'Illuminated southeast ridge of Shackleton: plenty of light with ice in shadow nearby. Risk: it demands precision under 100 m and there are slopes.'],
  'Peak Near Shackleton (cráter)': ['Candidate region announced in August 2022', 'NASA (Artemis)', 'Fresh 120 m crater (89.0066°S, 132.0596°E) with a slope of ~8° and signs of water, according to the LPI.', 'The slope meets the 10° limit and the area has good light, but it sits next to permanent shadows and requires 100 m precision.'],
  'Faustini Rim A (cráter)': ['Candidate region from 2022', 'NASA (Artemis)', '~2.7 km crater (88.0573°S, 89.1596°E) with hematite, water in M3 data and a hydrogen signal.', 'It is near the boundary between the near and far sides, so Earth is barely visible and a direct link is difficult. There is a lot of shadowed terrain.'],
  'de Gerlache (centro)': ['Candidate regions from 2022 (rims 1 and 2 and the Gerlache–Kocher massif)', 'NASA (Artemis)', '32 km crater at 88.5°S with a permanently shadowed floor; an illuminated ridge connects it to Shackleton.', 'The center is no good (extreme darkness and cold). The candidates are on the rim: there is light, but with steep slopes.'],
  'Amundsen (centro)': ['Amundsen Rim region, candidate in 2022', 'NASA (Artemis)', '~105 km crater, 5.6 km deep, at 84.5°S; its rim is about 110 km from the pole.', 'Large crater with steep walls and a lot of shadow. The rim offers light, but far from the pole.'],
  'IM-2 Athena': ['March 6, 2025', 'Intuitive Machines (NASA, CLPS)', 'Landed on Mons Mouton, near the south pole; its altimeter failed during descent, just like on IM-1.', 'Unsafe: it ended up on its side and the mission was cut very short; sloped terrain near the pole, low Sun and an altimeter failure.'],
  'IM-1 Odysseus': ['February 22, 2024', 'Intuitive Machines (NASA, CLPS)', 'First commercial landing: Malapert A crater (80.13°S, 1.44°E), about 1.5 km from the planned point.', 'Caution: it touched down with a faulty altimeter and ended up tilted; the pole demands precise navigation and the terrain has slopes.'],
  'Chandrayaan-3': ['August 23, 2023', 'ISRO (India)', 'Vikram lander and Pragyan rover at 69.37°S, 32.32°E, about 350 m from the target and about 600 km from the pole; they operated for around 14 days.', 'Caution: it landed well and operated, but at 69°S the Sun is low, the terrain is highlands and its predecessor Chandrayaan-2 crashed nearby in 2019 (70.88°S). The landing zone was 4 × 2.5 km.'],
  'Blue Ghost 1': ['March 2, 2025', 'Firefly Aerospace (NASA, CLPS)', 'Landed in Mare Crisium (18.56°N, 61.81°E) and operated for one lunar day with 10 NASA payloads.', 'Safe: smooth mare, Earth in view and a perfect landing.'],
  'Apolo 11': ['July 20, 1969', 'Neil Armstrong and Buzz Aldrin (Michael Collins in orbit), NASA', 'First crewed lunar landing, in Mare Tranquillitatis; they brought back about 22 kg of samples.', 'Caution: Armstrong took manual control to avoid a boulder field and fuel ran low. The landing ellipse was 17 × 5 km.'],
  'Apolo 12': ['November 19, 1969', 'Pete Conrad and Alan Bean (Richard Gordon in orbit), NASA', 'Precision landing in Oceanus Procellarum, about 180 m from the Surveyor 3 probe; they brought back parts of the probe and 34 kg of samples.', 'Safe: smooth mare and a precision landing (classified by its track record; in the project’s original classification it had been left uncolored).'],
  'Apolo 14': ['February 5, 1971', 'Alan Shepard and Edgar Mitchell (Stuart Roosa in orbit), NASA', 'Fra Mauro highlands; 42 kg of samples; Shepard hit golf balls.', 'Caution: rolling highland terrain and radar problems during descent.'],
  'Apolo 15': ['July 30, 1971', 'David Scott and James Irwin (Alfred Worden in orbit), NASA', 'First mission with a lunar rover, next to Hadley Rille and the Apennine Mountains; about 77 kg of samples.', 'Safe according to the project’s original classification: it landed near the target on a plain, although the lander ended up slightly tilted.'],
  'Apolo 16': ['April 21, 1972', 'John Young and Charles Duke (Ken Mattingly in orbit), NASA', 'First mission to the lunar highlands, at Descartes; about 96 kg of samples.', 'Unsafe according to the project’s original classification: heavily cratered highlands and a main engine fault delayed the descent by about 6 hours.'],
  'Apolo 17': ['December 11, 1972', 'Eugene Cernan and Harrison Schmitt (Ronald Evans in orbit), NASA', 'Last crewed mission, in the Taurus–Littrow valley; Schmitt was the only geologist; about 110 kg of samples.', 'Caution: narrow valley surrounded by tall massifs, with a steep descent.'],
  'SLIM': ['January 19, 2024', 'JAXA (Japan)', 'Precision landing near Shioli crater (13.32°S, 25.25°E).', 'Caution: it arrived with very good precision, but an engine failed and it ended up tilted with the solar panels poorly oriented; it survived anyway.'],
  'Chang’e-4 (lado oculto)': ['January 3, 2019', 'CNSA (China)', 'First landing on the far side (Von Kármán crater, 45.46°S, 177.59°E), with the Yutu-2 rover.', 'Caution: Earth is never visible there, so it depends on the Queqiao relay satellite.'],
  'Chang’e-5': ['December 1, 2020', 'CNSA (China)', 'Collected about 1.7 kg of samples in the Mons Rümker area (43.06°N, 51.92°W) and brought them to Earth.', 'Safe: volcanic plain on the near side, with Sun and Earth in view; the samples reached Earth.'],
  'Chang’e-6 (lado oculto)': ['June 1, 2024', 'CNSA (China)', 'First samples from the far side: 1.9 kg from the southern mare of the Apollo basin (41.64°S, 153.99°W).', 'Caution: with no view of Earth, it used a relay satellite; it succeeded.'],
  'IM-3 Reiner Gamma (objetivo)': ['Planned for early 2027', 'Intuitive Machines (NASA, CLPS)', 'It will go to Reiner Gamma, an area with a local magnetic field, with the Lunar Vertex experiment.', 'Near side with good light and link, but IM-1 and IM-2 ended up tipped over because of altimeter failures: the risk is in the descent.'],
  'Connecting Ridge': ['Candidate region from 2022; studied for its light since 2011', 'NASA, ESA and DLR', 'Ridge that joins Shackleton with de Gerlache (89.684°S, 196.739°E at the junction with the Shackleton rim). Blue Moon MK1 will go to this area.', 'Candidate for its light: light was calculated 92 to 96% of the time, with nights of 3 to 5 days. Risk: few flat areas and a grazing Sun.'],
  'Malapert Massif': ['Candidate region from 2022', 'NASA (Artemis)', 'Massif thought to be a remnant of the South Pole–Aitken basin rim, almost on the 0° meridian (approximate coordinate).', 'Candidate because it sees both Earth and Shackleton, useful for communications. Risk: mountain with steep slopes.'],
  'Haworth': ['Candidate region from 2022; used by the student challenge teams', 'NASA', '~51 km crater (86.9°S, 4°W) over 3.9 billion years old, with frost in the low areas.', 'Much of it is permanent shadow and among the coldest (under 40 K): the interest is the ice; the risk, the extreme cold and little light.'],
  'Nobile': ['Nobile Rim 1 and 2 regions, candidates in 2022', 'NASA and Astrobotic (Griffin-1)', '~79 km crater (center 85.28°S, 53.27°E), almost always in shadow except for very oblique light.', 'Candidate because of the ice and because Griffin-1 targets this region. Risk: very dark interior and oblique light.'],
  'Cabeus': ['LCROSS impact in 2009; nearby region a candidate in recent studies', 'NASA (LCROSS and LRO)', 'Crater near the pole (84.9°S, 35.5°W, approx.): the impact looked for water in the ejected material.', 'Scientific candidate because of the ice. High risk: permanently shadowed floor and steep walls.'],
  'Pozo de Marius Hills': ['Discovered in 2009', 'JAXA (Kaguya) and NASA (LRO)', 'Pit about 50 m wide and ~40 m deep (14.09°N, 56.77°W) inside a sinuous rille; possible entrance to a lava tube.', 'Candidate for shelters and geology. Risk: vertical walls, rocks on the floor and a landing that needs great precision.'],
  'Pozo de Mare Tranquillitatis': ['Seen in 2009; a 2024 radar study found an accessible cave', 'JAXA (Kaguya), NASA (LRO) and a radar team', 'Elliptical pit of ~100 m and ~105 m deep (8.34°N, 33.22°E), about 400 km from the Apollo 11 site.', 'Candidate for being the first proven lunar cave, in a smooth mare on the near side. Risk: rim with vertical walls.'],
  'Domos Gruithuisen': ['Blue Ghost 3 is planned for 2028', 'Firefly Aerospace (NASA, CLPS)', 'Volcanic domes on the near side (36.6°N, 40°W, approx.) that have not yet been explored on the surface.', 'Candidate for its unique geology. Risk: dome slopes and uneven terrain.'],
  'Cuenca Schrödinger': ['Scientific proposal; no confirmed mission', 'Scientific community', 'Far-side impact basin near the south pole (75°S, 132.4°E, approx.), with a peak ring and young volcanism.', 'Candidate for its geological variety. Risk: no view of Earth (needs a relay) and rugged impact-melt terrain.'],
  'Blue Ghost 2 / LuSEE-Night (objetivo)': ['Planned no earlier than 2027', 'Firefly Aerospace and NASA/DOE (CLPS), with the United Arab Emirates’ Rashid 2 rover', 'First commercial landing on the far side, near Nassau crater and almost at the antipode of Earth, with the LuSEE-Night radio telescope (0.1 to 50 MHz).', 'Candidate for the radio quiet: the Moon blocks Earth’s noise. Risk: no view of Earth (it will use the Elytra Dark and Lunar Pathfinder relays) and it must survive the 14-day night.'],
  'Daedalus': ['Scientific proposal for decades; no confirmed mission', 'Scientific community', '~93 km crater almost at the center of the far side, proposed for radio telescopes (approximate coordinate).', 'Candidate because it is almost at the antipode of Earth: the greatest radio isolation. Risk: no view of Earth (needs a relay) and steep walls.'],
  'Mare Moscoviense': ['Scientific proposal; no confirmed mission', 'Scientific community', 'Far-side basaltic mare, surrounded by a mountain ring (approximate coordinate).', 'Candidate for its smooth ground, suitable for landing, and its distance from Earth for radio. Risk: no view of Earth and mountainous edges.'],
  'Tsiolkovsky': ['Scientific proposal; no confirmed mission', 'Scientific community', '~180 km far-side crater with a lava floor and a central peak (approximate coordinate).', 'Candidate for its smooth floor and its central peak of geological interest. Risk: no view of Earth and uneven terrain next to the peak.'],
};

/** Level and candidate flag come from the Spanish data; the texts come from TEXTS. */
export const I: Record<string, SiteInfo> = Object.fromEntries(
  Object.entries(I_ES).map(([name, [level, cand]]) => {
    const t = TEXTS[name];
    if (!t) throw new Error(`Missing English info sheet for site: ${name}`);
    return [name, [level, cand, ...t] as SiteInfo];
  }),
);
