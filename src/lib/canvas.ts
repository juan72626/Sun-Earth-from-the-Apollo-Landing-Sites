/** Contexto 2D de un canvas; lanza un error claro si el navegador no lo ofrece. */
export function ctx2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const g = canvas.getContext('2d');
  if (!g) throw new Error('Canvas 2D no disponible');
  return g;
}
