import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export function useTheme() {
  const { user } = useAuthStore();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (user?.settings.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return (user?.settings.theme as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (user?.settings.theme) {
      if (user.settings.theme === 'system') {
        setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      } else {
        setTheme(user.settings.theme as 'light' | 'dark');
      }
    }
  }, [user?.settings.theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return { theme };
}