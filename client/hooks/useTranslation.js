import { useLanguage } from '../contexts/LanguageContext';
import en from '../locales/en.json';
import zh from '../locales/zh.json';
import es from '../locales/es.json';

const translations = {
  en,
  zh,
  es
};

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key) => {
    const keys = key.split('.');
    let translation = translations[language];
    
    for (const k of keys) {
      translation = translation?.[k];
    }
    
    return translation || key;
  };

  return { t };
};