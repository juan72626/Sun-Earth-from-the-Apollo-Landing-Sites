import { useLang } from '../i18n/LangContext';
import { LANGS, type Lang } from '../i18n/types';
import { UI } from '../i18n/ui';

const LABELS: Record<Lang, { short: string; name: string }> = {
  es: { short: 'ES', name: 'Español' },
  en: { short: 'EN', name: 'English' },
};

/** Grupo de dos botones (ES | EN) que cambia el idioma de toda la página. */
export default function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <div className="lang" role="group" aria-label={UI[lang].toggle.group}>
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          title={LABELS[code].name}
          aria-label={LABELS[code].name}
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
        >
          {LABELS[code].short}
        </button>
      ))}
    </div>
  );
}
