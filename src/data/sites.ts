import { makeSite } from '../lib/astro';
import type { Site } from '../types';

/** [nombre, latitud, longitud (este +)] */
export const SITES_RAW: [name: string, lat: number, lon: number][] = [
  ['Polo sur', -90, 0],
  ['Shackleton (centro)', -89.66, 129.2],
  ['Chang’e-7 (objetivo)', -88.8, 123.4],
  ['Peak Near Shackleton (cráter)', -89.0066, 132.0596],
  ['Faustini Rim A (cráter)', -88.0573, 89.1596],
  ['de Gerlache (centro)', -88.5, -87.1],
  ['Amundsen (centro)', -84.5, 82.8],
  ['IM-2 Athena', -84.8, 29.2],
  ['IM-1 Odysseus', -80.13, 1.44],
  ['Chandrayaan-3', -69.374, 32.32],
  ['Blue Ghost 1', 18.56, 61.81],
  ['Apolo 11', 0.674, 23.473],
  ['Apolo 12', -3.012, -23.422],
  ['Apolo 14', -3.645, -17.471],
  ['Apolo 15', 26.132, 3.633],
  ['Apolo 16', -8.973, 15.5],
  ['Apolo 17', 20.191, 30.772],
  ['SLIM', -13.3, 25.25],
  ['Chang’e-4 (lado oculto)', -45.457, 177.588],
  ['Chang’e-5', 43.058, -51.916],
  ['Chang’e-6 (lado oculto)', -41.6385, -153.9852],
  ['IM-3 Reiner Gamma (objetivo)', 7.5, -59],
  ['Connecting Ridge', -89.684, -163.261],
  ['Malapert Massif', -86, 0],
  ['Haworth', -86.9, -4],
  ['Nobile', -85.28, 53.27],
  ['Cabeus', -84.9, -35.5],
  ['Pozo de Marius Hills', 14.0917, -56.7701],
  ['Pozo de Mare Tranquillitatis', 8.3355, 33.222],
  ['Domos Gruithuisen', 36.6, -40],
  ['Cuenca Schrödinger', -75, 132.4],
  ['Blue Ghost 2 / LuSEE-Night (objetivo)', -23.8139, 176.8297],
  ['Daedalus', -5.9, 179.4],
  ['Mare Moscoviense', 27.3, 147.9],
  ['Tsiolkovsky', -20.4, 129.1],
];

export const BASE_SITES: Site[] = SITES_RAW.map((a) => makeSite(...a));

/** Índice inicial del sitio en foco (Shackleton). */
export const DEFAULT_FOCUS: number = 1;
