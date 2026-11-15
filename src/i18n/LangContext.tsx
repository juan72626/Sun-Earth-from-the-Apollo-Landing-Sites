import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { UI } from './ui';
import type { Lang } from './types';

const STORAGE_KEY = 'lunar-lang';

interface LangState {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangState | null>(null);

/** Idioma inicial: el guardado en el navegador o, si no hay, español. */
function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'es' || saved === 'en') return saved;
  } catch {
    /* localStorage no disponible: se usa el valor por defecto */
  }
  return 'es';
}

/** Provee el idioma actual, lo guarda y actualiza <html lang> y el título de la pestaña. */
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = UI[lang].htmlTitle;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignorar */
    }
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang }), [lang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangState {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang debe usarse dentro de <LangProvider>');
  return ctx;
}
