import { RAD } from './astro';
import type { OrbitElements, Vec3 } from '../types';

/** Posición en una órbita kepleriana ilustrativa (anomalía media M, radios en radios lunares). */
export function kep(s: OrbitElements, M: number): Vec3 {
  let E = M;
  for (let k = 0; k < 7; k++) E = M + s.e * Math.sin(E);
  const i = s.i * RAD, O = s.om * RAD, w = s.w * RAD;
  const c = Math.cos, n = Math.sin;
  const P = [c(w) * c(O) - n(w) * n(O) * c(i), c(w) * n(O) + n(w) * c(O) * c(i), n(w) * n(i)];
  const Q = [-n(w) * c(O) - c(w) * n(O) * c(i), -n(w) * n(O) + c(w) * c(O) * c(i), c(w) * n(i)];
  const x = s.sa * (Math.cos(E) - s.e);
  const y = s.sa * Math.sqrt(1 - s.e * s.e) * Math.sin(E);
  return [x * P[0] + y * Q[0], x * P[1] + y * Q[1], x * P[2] + y * Q[2]];
}
