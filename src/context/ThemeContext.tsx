import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  toggleTheme: () => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  dyslexiaFont: boolean;
  toggleDyslexiaFont: () => void;
  resetAccessibility: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('siparana_theme');
    return (saved as Theme) || 'light';
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    const saved = localStorage.getItem('siparana_font_size');
    return (saved as FontSize) || 'md';
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('siparana_high_contrast') === 'true';
  });

  const [dyslexiaFont, setDyslexiaFont] = useState<boolean>(() => {
    return localStorage.getItem('siparana_dyslexia_font') === 'true';
  });

  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const effectiveDark = theme === 'dark' || (theme === 'system' && systemDark);

    setIsDark(effectiveDark);
    if (effectiveDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('siparana_theme', theme);
  }, [theme]);

  // Font Size Effect
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-font-size', fontSize);
    localStorage.setItem('siparana_font_size', fontSize);
  }, [fontSize]);

  // High Contrast Effect
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('siparana_high_contrast', String(highContrast));
  }, [highContrast]);

  // Dyslexia Font Effect
  useEffect(() => {
    const root = document.documentElement;
    if (dyslexiaFont) {
      root.classList.add('dyslexia-friendly');
    } else {
      root.classList.remove('dyslexia-friendly');
    }
    localStorage.setItem('siparana_dyslexia_font', String(dyslexiaFont));
  }, [dyslexiaFont]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  const toggleDyslexiaFont = () => {
    setDyslexiaFont(prev => !prev);
  };

  const resetAccessibility = () => {
    setFontSizeState('md');
    setHighContrast(false);
    setDyslexiaFont(false);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isDark,
        toggleTheme,
        fontSize,
        setFontSize,
        highContrast,
        toggleHighContrast,
        dyslexiaFont,
        toggleDyslexiaFont,
        resetAccessibility,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
