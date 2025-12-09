import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { de } from './locales/translations';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            de
        },
        lng: 'de',
        fallbackLng: 'de',
        debug: false,
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;
