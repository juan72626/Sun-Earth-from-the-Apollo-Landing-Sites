# Luz y enlace en la Luna (React + Vite + TypeScript)

Versión en React del proyecto del NASA Space Apps Challenge 2026 (Lunar Landing Site Navigator).

## Usar
```bash
npm install
npm run dev      # desarrollo
npm run typecheck # comprobar tipos (tsc --noEmit)
npm run build    # tipos + producción (carpeta dist/)
```

## Estructura
- `src/types.ts` – tipos compartidos (`Site`, `Ephemeris`, `SiteStats`, `Satellite`, …).
- `src/data/` – sitios, fichas de riesgo, satélites y textos (sin lógica).
- `src/lib/astro.ts` – efemérides (Astronomy Engine), elevación/azimut, estadísticas de 30 días, eclipses, ventanas.
- `src/lib/draw/` – funciones puras que dibujan en canvas (cielo, línea de tiempo, mapa polar, zonas, calendario, satélites).
- `src/lib/MoonGlobe.ts` – globo 3D con three.js, fuera de React.
- `src/hooks/` – `useSimulation` (estado global), `SimContext`, `useThrottled`, `useEclipses`.
- `src/components/` – una sección por componente (`GlobeSection`, `PolarMapSection`, `CompareSection`, `ZonesSection`, `RelaySection`, `RecommenderSection`, `CalendarSection`, …).

## Space Apps
Usamos Claude.Ai en el desarrollo con los stack de Typescript + React + HTML5 + CSS 