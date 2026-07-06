import { createContext, useContext, useEffect, useMemo, useState } from "react";

import i18n, { initializeLocale, setAppLocale } from "@/i18n";

type Locale = "en" | "vi";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  toggleLocale: () => Promise<void>;
  isReady: boolean;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

const normalizeLocale = (locale: string | null | undefined): Locale => {
  return locale?.toLowerCase().startsWith("en") ? "en" : "vi";
};

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(normalizeLocale(i18n.locale));
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      await initializeLocale();
      if (mounted) {
        setLocaleState(normalizeLocale(i18n.locale));
        setIsReady(true);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const setLocale = async (nextLocale: Locale) => {
    await setAppLocale(nextLocale);
    setLocaleState(normalizeLocale(i18n.locale));
  };

  const toggleLocale = async () => {
    const nextLocale: Locale = locale === "en" ? "vi" : "en";
    await setLocale(nextLocale);
  };

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale, isReady }),
    [locale, isReady],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
