import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { defaultLanguage, type SupportedLanguage } from './config';
import commonEn from './locales/en/common.json';
import homeEn from './locales/en/home.json';
import productsEn from './locales/en/products.json';
import storesEn from './locales/en/stores.json';
import tagsEn from './locales/en/tags.json';
import authEn from './locales/en/auth.json';
import commonHe from './locales/he/common.json';
import homeHe from './locales/he/home.json';
import productsHe from './locales/he/products.json';
import storesHe from './locales/he/stores.json';
import tagsHe from './locales/he/tags.json';
import authHe from './locales/he/auth.json';

export const resources = {
  en: {
    common: commonEn,
    home: homeEn,
    products: productsEn,
    stores: storesEn,
    tags: tagsEn,
    auth: authEn,
  },
  he: {
    common: commonHe,
    home: homeHe,
    products: productsHe,
    stores: storesHe,
    tags: tagsHe,
    auth: authHe,
  },
} as const;

if (!i18next.isInitialized) {
  void i18next.use(initReactI18next).init({
    resources,
    lng: defaultLanguage,
    fallbackLng: defaultLanguage,
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });
}

export function setI18nLanguage(language: SupportedLanguage) {
  if (i18next.language !== language) {
    void i18next.changeLanguage(language);
  }
}

export default i18next;
