import { useState, useEffect } from 'react';
import { useColorScheme as useColorSchemeCore, Platform } from 'react-native';

const listeners = new Set<(theme: 'light' | 'dark') => void>();
let currentTheme: 'light' | 'dark' = 'dark'; // Default theme is dark

// Read initial theme preference from localStorage on Web
if (Platform.OS === 'web') {
  try {
    const saved = localStorage.getItem('portfolio_theme');
    if (saved === 'light' || saved === 'dark') {
      currentTheme = saved;
    }
  } catch (e) {
    console.error("Failed to load theme from localStorage", e);
  }
}

export const setThemeGlobal = (theme: 'light' | 'dark') => {
  currentTheme = theme;
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem('portfolio_theme', theme);
      
      const bgColor = theme === 'dark' ? '#1f242d' : '#F9FAFB';
      const body = document.body;
      if (body) {
        body.style.backgroundColor = bgColor;
      }
      const docEl = document.documentElement;
      if (docEl) {
        docEl.style.backgroundColor = bgColor;
      }
    } catch (e) {
      console.error("Failed to save theme to localStorage", e);
    }
  }
  listeners.forEach(listener => listener(theme));
};

export const useColorScheme = (): 'light' | 'dark' => {
  const [theme, setThemeState] = useState<'light' | 'dark'>(currentTheme);

  useEffect(() => {
    const handleThemeChange = (newTheme: 'light' | 'dark') => {
      setThemeState(newTheme);
    };
    listeners.add(handleThemeChange);
    
    // Sync local state if currentTheme changed elsewhere
    if (theme !== currentTheme) {
      setThemeState(currentTheme);
    }
    
    return () => {
      listeners.delete(handleThemeChange);
    };
  }, [theme]);

  return theme;
};
