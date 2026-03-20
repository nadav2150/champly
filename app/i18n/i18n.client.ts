import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { defaultLanguage, type SupportedLanguage } from './config';
import commonEn from '../../public/locales/en/common.json';
import homeEn from '../../public/locales/en/home.json';
import productsEn from '../../public/locales/en/products.json';
import storesEn from '../../public/locales/en/stores.json';
import tagsEn from '../../public/locales/en/tags.json';
import commonHe from '../../public/locales/he/common.json';
import homeHe from '../../public/locales/he/home.json';
import productsHe from '../../public/locales/he/products.json';
import storesHe from '../../public/locales/he/stores.json';
import tagsHe from '../../public/locales/he/tags.json';

export const resources = {
  en: {
    common: commonEn,
    home: homeEn,
    products: productsEn,
    stores: storesEn,
    tags: tagsEn,
  },
  he: {
    common: commonHe,
    home: homeHe,
    products: productsHe,
    stores: storesHe,
    tags: tagsHe,
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
