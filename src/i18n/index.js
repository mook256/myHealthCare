import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './translations/en.json';
import th from './translations/th.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en,
      th,
    },
    lng: 'th',
    fallbackLng: 'th',

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
