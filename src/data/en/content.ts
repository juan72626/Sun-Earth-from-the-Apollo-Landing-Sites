/* Static section texts — English */

export const NAV_ITEMS: [id: string, label: string][] = [
  ['s1', 'Globe'],
  ['s2', 'Polar map'],
  ['s3', 'Compare'],
  ['s8', 'Zones'],
  ['s4', 'Relays'],
  ['s5', 'Recommender'],
  ['s9', 'Calendar'],
  ['s6', 'Research'],
  ['s7', 'Sources'],
];

export const COLOR_KEY: [color: string, label: string][] = [
  ['#34d65a', 'Green: safe'],
  ['#ffd23f', 'Yellow: caution'],
  ['#ff4d4d', 'Red: dangerous or unsafe'],
  ['#b48cff', 'Purple: candidate'],
];

export const ZONE_OK: string[] = [
  'Nearly flat terrain: slope under 10° at a 100 m scale (a NASA requirement for Artemis) and under 20° at 2 km for walking.',
  'Few large rocks and few deep craters; smooth ground, like that of a lunar mare.',
  'Sun high enough to see the terrain: with the Sun very low, long shadows hide rocks and holes.',
  'Earth in view (direct link) or a relay satellite, and no permanently shadowed areas.',
];

export const ZONE_BAD: string[] = [
  'Steep slopes, such as crater and pit walls: the lander can tip over (IM-1 and IM-2 ended up tilted and on their side on sloped terrain).',
  'Boulder fields and pit edges with vertical walls.',
  'Permanent shadow and extreme cold, or a grazing Sun that hides hazards.',
  'Relief that blocks Earth: no direct link.',
];

export const LROC_LINKS: [href: string, label: string][] = [
  ['https://www.lroc.asu.edu/images/1314', 'the Chandrayaan-3 landing area'],
  ['https://www.lroc.asu.edu/images/1247', 'the illuminated ridge between Shackleton and de Gerlache'],
  ['https://www.lroc.asu.edu/atlases/pits/3', 'the Mare Tranquillitatis pit'],
  ['https://www.lroc.asu.edu/atlases/pits/1', 'the Marius Hills pit'],
  ['https://lroc.im-ldi.com/posts/1294', 'Malapert Massif'],
];

export const RELAY_TIPS: string[] = [
  'Halo orbit around the Earth–Moon L2 point (Queqiao-1 style): about 61,500 km from the Moon, exactly opposite the direction of Earth. The point on the Moon below it is the one on the line above and is always near 0° latitude and 180° longitude. It gives near-continuous link to the far side and, when Earth is out of view, to the south pole as well.',
  'Frozen elliptical orbit of 200 × 16,000 km (Queqiao-2 style): 24 h period and 62.4° inclination. It sees both Earth and the far side for a good part of the orbit and also serves the south pole.',
  'Planned relays with Blue Ghost 2: Elytra Dark and Lunar Pathfinder will provide link to LuSEE-Night, which will land at 23.81°S, 176.83°E.',
  'NRHO orbit (CAPSTONE, Gateway): passes ~1,500 km from the north pole and ~70,000 km from the south pole, with a period of ~6.5 days. It is the orbit from which the Artemis landers would descend.',
  'Real orbits depend on each mission’s design; they are shown here for reference.',
];

export const RESEARCH: string[] = [
  'Nearly vertical axis: the Moon tilts only 1.54°, so at the exact pole the Sun rises at most ~1.5°. NASA summarizes that the Sun and Earth rise only 2 to 7° and that Earth is visible for two weeks and hidden for two.',
  'Relief rules. Near the rim of Shackleton there is a point with continuous light for 240 days a year and a maximum night of ~1.5 days (Mazarico et al., 2011). On Connecting Ridge, light was calculated 92% of the time at a height of 2 m and 96% at 10 m (Gläser et al., 2014). LROC found areas with light almost 94% of the year and a maximum night of 43 h.',
  'NASA requirements for Artemis III: less than 6° of latitude, slope under 10° (100 m) and 20° (2 km), direct link with Earth without a relay, light on the surface and during approach, and 100 m precision.',
  'Program: Artemis II flew on April 1, 2026. Artemis III is now a low-Earth-orbit test in 2027 and the first landing (Artemis IV) is planned for 2028 near the south pole.',
  'The 13 regions announced in 2022 measure ~15 × 15 km: Faustini Rim A, Peak Near Shackleton, Connecting Ridge, Connecting Ridge Extension, de Gerlache Rim 1 and 2, de Gerlache–Kocher Massif, Haworth, Malapert Massif, Leibnitz Beta Plateau, Nobile Rim 1 and 2, and Amundsen Rim.',
  'CLPS: Peregrine failed, IM-1 ended up tilted, Blue Ghost 1 succeeded and IM-2 ended up on its side. Next are Griffin-1 (no earlier than November 2026), Blue Moon MK1 and IM-3 (early 2027), Blue Ghost 2 (2027), Blue Ghost 3 (2028) and Blue Ghost 4 (2029).',
  'China: Chang’e-7 targets the southeast ridge of Shackleton and Chang’e-8 (2028-29) targets Leibnitz Beta.',
  'Risk criteria in the info sheets: slope and rocks, navigation precision, Sun height, link with Earth and mission track record. An ESA and PTScientists study rated sites almost at the pole as high risk because of the very low Sun, and an equatorial one with a high Sun and direct communication as low risk.',
  'Dubious sources discarded: some pages say NASA has already fixed Malapert for Artemis III in 2026. They contradict official announcements, so I did not use them.',
  'Satellites that helped with the topic: Clementine (1994) and Lunar Prospector (1998–99) gave the first hints of almost always lit areas and of hydrogen at the poles; Chandrayaan-1 (2008–09) detected water on the surface; SMART-1 (2003–06) and Kaguya (2007–09) mapped relief and light; LCROSS (2009) confirmed water in Cabeus; LRO (since 2009) provided the detailed maps; Danuri with ShadowCam (since 2022) looks inside the dark craters.',
  'Radio and the far side: LuSEE-Night will land near the Nassau crater, almost at the antipode of Earth, to avoid its radio noise; the lander will shut down after the first day so it does not generate its own interference, and the data will return through relay satellites (Lunar Pathfinder and Elytra Dark). Chang’e-4 depended on Queqiao-1 and Chang’e-6 on Queqiao-2.',
];

export const SOURCES: string[] = [
  'NASA, Artemis Overview presentation for the 2025 Space Apps challenge (NTRS 20250009323): landing requirements, Sun and Earth at 2 to 7° from the horizon and the Earth visibility cycle.',
  'Mazarico et al. (2011) and Gläser et al. (2014), both in Icarus: polar illumination with LOLA data. LROC (Arizona State University): light on the Shackleton rim, Connecting Ridge and the lunar pit atlas.',
  'LPI/USRA, Artemis III Science Definition workshop (abstract 2042): craters of Peak Near Shackleton and Faustini Rim A.',
  'USGS Gazetteer of Planetary Nomenclature, ESA and Wikipedia: crater coordinates (Nobile, Haworth, Amundsen, de Gerlache).',
  'NASA NSSDCA: landing coordinates (Chandrayaan-3, SLIM, IM-1, Chang’e-4, 5 and 6, Blue Ghost 1).',
  'Brookhaven National Laboratory and Firefly Aerospace: LuSEE-Night and Blue Ghost 2. SpaceNews, The Planetary Society and Wikipedia: Queqiao-1 and 2, Chang’e-7 and the status of CLPS and Artemis.',
  'Astronomy Engine: positions of the Sun and the Moon. The summaries in each info sheet and the risk classification (except for the Apollo sites, which come from the project’s original classification) are the author’s own and indicative.',
];

export const FOOTER_NOTE: string =
  'Calculated with the Astronomy Engine ephemerides, including libration. The Moon is treated as a sphere without relief: the horizon is the mask you set (Sun: upper limb; Earth: center). Sites marked as center, crater or target are references within a region, not decided landing points, and their coordinates are approximate. In the info sheets, the landing classification of the Apollo sites is the project’s original; the rest is the author’s own assessment based on track record, slope, light and link, and is indicative only. The Sun position formula was checked against a simplified independent ephemeris: it reproduces the solar elevation of the Apollo landings with differences of about 1° or less (for example, 10.6° calculated versus about 10.8° documented for Apollo 11).';
