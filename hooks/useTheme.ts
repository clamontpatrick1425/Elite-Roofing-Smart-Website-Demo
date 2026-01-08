
import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = (): [Theme, () => void] => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    const initialTheme = localStorage.getItem('theme') as Theme || 'light';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      root.classList.add('dark');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const root = window.document.documentElement;
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    root.classList.toggle('dark', newTheme === 'dark');
  }, [theme]);
  
  return [theme, toggleTheme];
};
