import { useLanguage } from './useLanguage';
import { translations } from '../locales';

export function useTranslation() {
  const { language, setLanguage } = useLanguage();
  return {
    t: translations[language],
    language,
    setLanguage
  };
}