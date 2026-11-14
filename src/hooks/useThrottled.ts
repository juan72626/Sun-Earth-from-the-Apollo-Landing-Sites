import { useEffect, useRef, useState } from 'react';

/** Devuelve `value` actualizado como máximo cada `ms` milisegundos (para cálculos pesados durante la reproducción). */
export function useThrottled<T>(value: T, ms: number): T {
  const [v, setV] = useState<T>(value);
  const last = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const now = performance.now();
    const wait = ms - (now - last.current);
    if (wait <= 0) {
      last.current = now;
      setV(value);
    } else {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        last.current = performance.now();
        setV(value);
      }, wait);
    }
    return () => clearTimeout(timer.current);
  }, [value, ms]);

  return v;
}
