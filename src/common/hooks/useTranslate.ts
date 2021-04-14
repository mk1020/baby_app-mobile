import { useTranslation } from 'react-i18next';
import { TLanguage } from '../localization/localization';
import { getStorageData, storeData } from '../../storage/asyncStorage/utils';

export const useTranslate = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: TLanguage) => {
    i18n.changeLanguage(lng);

    const storageLng = getStorageData('app_language');
    if (!storageLng) {
      storeData('app_language', lng);
    }
  };
  return { t, i18n, changeLanguage };
};
