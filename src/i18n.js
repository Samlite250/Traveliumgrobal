import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import rwTranslation from './locales/rw.json';
import frTranslation from './locales/fr.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      rw: {
        translation: rwTranslation
      },
      fr: {
        translation: frTranslation
      }
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
