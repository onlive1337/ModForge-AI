import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useLanguage } from './useLanguage';
import type { Languages } from '../locales';

export function useUserSettings() {
  const { user } = useAuthStore();
  const setLanguage = useLanguage(state => state.setLanguage);

  useEffect(() => {
    if (user?.settings?.language) {
      const userLanguage = user.settings.language as Languages;
      if (userLanguage === 'en' || userLanguage === 'ru') {
        setLanguage(userLanguage);
      }
    }

    if (user?.settings?.theme) {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      
      if (user.settings.theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(isDark ? 'dark' : 'light');

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
          root.classList.remove('light', 'dark');
          root.classList.add(e.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else {
        root.classList.add(user.settings.theme);
      }
    }
  }, [user?.settings, setLanguage]);
}