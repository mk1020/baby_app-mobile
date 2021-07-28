import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {en} from './translations/en';
import {ru} from './translations/ru';
import * as RNLocalize from 'react-native-localize';

export type TLanguage = 'ru' | 'en';

const translations = {en, ru};
export const fallbackLanguage: TLanguage = 'en';

let language = RNLocalize.findBestAvailableLanguage(Object.keys(translations))?.languageTag;
language = language || fallbackLanguage;

i18n.use(initReactI18next).init({
  resources: translations,
  lng: language,
  fallbackLng: fallbackLanguage,
  interpolation: {
    escapeValue: false,
  },
  cleanCode: true,
});
export default i18n;
