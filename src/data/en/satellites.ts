import type { Satellite } from '../../types';

/* Satellite texts in English. Orbital data and colors stay in ../satellites.ts. */
type SatTexts = Pick<Satellite, 'o' | 'y' | 'd' | 'ap' | 'ob'>;

export const SAT_TEXTS_EN: Record<string, SatTexts> = {
  'LRO': { o: 'NASA', y: 'Since 2009', d: 'Lunar Reconnaissance Orbiter, NASA’s lunar orbiter.', ap: 'Its LOLA laser altimeter and its LROC cameras produced the relief and light maps used to choose the south pole sites. It also located spacecraft on the surface from orbit, such as Blue Ghost 1 and Chandrayaan-3.', ob: 'Low polar, from tens of km to about 200 km in altitude.' },
  'Danuri': { o: 'KARI (South Korea) and NASA', y: 'Since 2022', d: 'Danuri (KPLO), South Korea’s first lunar orbiter.', ap: 'It carries NASA’s ShadowCam, which photographs the floors of the permanently shadowed craters at the south pole with a sensitivity about 200 times greater than LROC’s, to see the terrain where the Sun never reaches.', ob: 'Polar, at about 100 km altitude.' },
  'Chandrayaan-2': { o: 'ISRO (India)', y: 'Since 2019', d: 'Orbiter of India’s Chandrayaan-2 mission.', ap: 'Its high-resolution cameras helped choose the Chandrayaan-3 landing zone, and its antenna served as a link with the Vikram lander after landing.', ob: 'Polar, at about 100 km altitude.' },
  'Queqiao-1': { o: 'CNSA (China)', y: 'Since 2018', d: 'Queqiao (Magpie Bridge), the first relay satellite for the far side.', ap: 'It made it possible to communicate with Chang’e-4 and its Yutu-2 rover, the first landing on the far side, where Earth is never visible.', ob: 'Halo orbit around the Earth–Moon L2 point, about 65,000 to 70,000 km beyond the Moon.' },
  'Queqiao-2': { o: 'CNSA (China)', y: 'Since 2024', d: 'China’s second relay satellite.', ap: 'It relayed Chang’e-6, which brought back samples from the far side, and will serve Chang’e-7 and Chang’e-8 at the south pole. It sees both Earth and the far side for a good part of its orbit.', ob: 'Frozen elliptical orbit of 200 × 16,000 km, 24 h and 62.4° inclination; it will move to 12 h for the south pole missions.' },
  'CAPSTONE': { o: 'NASA', y: 'Since 2022', d: 'Small NASA satellite that tested the NRHO orbit.', ap: 'It verified in flight the near-rectilinear halo orbit (NRHO) that Gateway and the Artemis landers will use to descend to the south pole, and it tested an autonomous navigation system.', ob: 'NRHO: passes ~1,500 km from the north pole and ~70,000 km from the south pole, with a period of ~6.5 days.' },
};
