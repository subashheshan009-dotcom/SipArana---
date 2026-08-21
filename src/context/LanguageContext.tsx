import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, SUPPORTED_LANGUAGES, type AppLanguage, type LanguageOption } from '@/data/translations';
import type { Medium } from '@/types';

export { SUPPORTED_LANGUAGES, TRANSLATIONS };
export type { AppLanguage, LanguageOption };

interface LanguageContextType {
  language: AppLanguage;
  medium: Medium;
  setLanguage: (lang: AppLanguage) => void;
  setMedium: (med: Medium) => void;
  t: (key: string, fallback?: string) => string;
  tText: (obj?: { si?: string; ta?: string; en?: string; [key: string]: any }, fallback?: string) => string;
  currentLanguageOption: LanguageOption;
  supportedLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function mediumToLanguage(medium?: Medium): AppLanguage {
  if (!medium) return 'si';
  if (medium === 'Tamil') return 'ta';
  if (medium === 'English') return 'en';
  return 'si';
}

export function languageToMedium(lang: AppLanguage): Medium {
  if (lang === 'ta') return 'Tamil';
  if (lang === 'en') return 'English';
  return 'Sinhala';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem('siparana_app_language') as AppLanguage;
      if (saved && (saved === 'si' || saved === 'ta' || saved === 'en')) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'si';
  });

  const [medium, setMediumState] = useState<Medium>(() => languageToMedium(language));

  useEffect(() => {
    try {
      localStorage.setItem('siparana_app_language', language);
    } catch {
      // ignore
    }
    setMediumState(languageToMedium(language));
    document.documentElement.lang = language === 'si' ? 'si-LK' : language === 'ta' ? 'ta-LK' : 'en';
  }, [language]);

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('siparana_app_language', lang);
      // Also update user profile in local storage if present
      const stored = localStorage.getItem('siparana_user');
      if (stored) {
        const user = JSON.parse(stored);
        user.medium = languageToMedium(lang);
        localStorage.setItem('siparana_user', JSON.stringify(user));
      }
    } catch {
      // ignore
    }
  };

  const setMedium = (med: Medium) => {
    const lang = mediumToLanguage(med);
    setLanguage(lang);
  };

  const t = (key: string, fallback?: string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.si;
    if (dict[key]) {
      return dict[key];
    }
    // Try Sinhala default
    if (TRANSLATIONS.si[key]) {
      return TRANSLATIONS.si[key];
    }
    // Try English default
    if (TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  const tText = (obj?: { si?: string; ta?: string; en?: string; [key: string]: any }, fallback = ''): string => {
    if (!obj) return fallback;
    if (language === 'si' && obj.si) return obj.si;
    if (language === 'ta' && obj.ta) return obj.ta;
    if (language === 'en' && obj.en) return obj.en;
    return obj.si || obj.ta || obj.en || fallback;
  };

  const currentLanguageOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        medium,
        setLanguage,
        setMedium,
        t,
        tText,
        currentLanguageOption,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
