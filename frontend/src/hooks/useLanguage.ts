import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Languages } from '../locales';

interface LanguageStore {
  language: Languages;
  setLanguage: (lang: Languages) => void;
}

export const useLanguage = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'ru',
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'language-storage',
    }
  )
);