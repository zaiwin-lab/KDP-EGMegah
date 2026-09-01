import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { DICTIONARIES, LANGUAGES, type Lang } from './dictionary';

export { LANGUAGES };
export type { Lang };

const STORAGE_KEY = 'l2h.lang';

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /* Falls back to English, then to the key, so a missing translation
     degrades to readable text rather than a raw identifier. */
  t: (key: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const readStored = (): Lang => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && stored in DICTIONARIES) return stored as Lang;
  } catch {
    /* Blocked storage: fall through to the default. */
  }
  return 'en';
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStored);

  useEffect(() => {
    document.documentElement.lang = lang === 'bm' ? 'ms' : lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Preference simply is not remembered. */
    }
  }, []);

  const t = useCallback(
    (key: string) => DICTIONARIES[lang][key] ?? DICTIONARIES.en[key] ?? key,
    [lang],
  );

  const value = useMemo<I18nValue>(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
