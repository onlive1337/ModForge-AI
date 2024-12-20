import { ru } from './ru';
import { en } from './en';

export const translations = {
  ru,
  en
} as const;

export type Languages = keyof typeof translations;
export type TranslationKeys = keyof typeof translations.ru;