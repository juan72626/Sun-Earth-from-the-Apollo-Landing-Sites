import { createContext, useContext } from 'react';
import type { SimState } from './useSimulation';

export const SimContext = createContext<SimState | null>(null);

/** Estado compartido de la simulación: fecha, máscara, sitio en foco, sitios, estadísticas… */
export function useSim(): SimState {
  const sim = useContext(SimContext);
  if (!sim) throw new Error('useSim debe usarse dentro de <SimContext.Provider>');
  return sim;
}
