import { useState, useEffect } from 'react';

const listeners = new Set<(theme: 'light' | 'dark') => void>();
let currentTheme: 'light' | 'dark' = 'dark'; // Default theme is dark

// Safe load from localStorage
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
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
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
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

export function useColorScheme(): 'light' | 'dark' {
  // Use a mounted flag to avoid hydration mismatch (SSR renders 'dark' as default)
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    setMounted(true);
    setThemeState(currentTheme);

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

  // Before hydration on client completes, return 'dark' (the SSR default)
  return mounted ? theme : 'dark';
}

