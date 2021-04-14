//import i18n from 'i18n-js';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './translations/en';
import { ru } from './translations/ru';
import * as RNLocalize from 'react-native-localize';
import { getStorageData, storeData } from '../../storage/asyncStorage/utils';

export type TLanguage = 'ru' | 'en';

const translations = { en, ru };
const fallbackLanguage: TLanguage = 'ru';

let language = RNLocalize.findBestAvailableLanguage(Object.keys(translations))?.languageTag;
language = language || fallbackLanguage;

const storageLng = getStorageData('app_language');
if (!storageLng) {
  storeData('app_language', language || fallbackLanguage);
}

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

/*
export const translate = (key, config) => i18n.t(key, config);


export const i18nConfig = language => {
  i18n.translations = { [language]: translationGetters[language]() };
  i18n.locale = language;
};
*/
