import {TFunction} from 'i18next';
import {ImageURISource} from 'react-native';
import {Images} from '../../common/imageResources';
import {TModalDataItem} from '../../common/components/ModalSelectorList';
import {TLanguage} from '../../common/localization/localization';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {googleOAuthClientId} from '../../common/consts';

type Handlers = {
  onPressDisableAds: ()=> void
  onPressSaveInternet: ()=> void
  onPressExport: ()=> void
  onPressImport: ()=> void
  onPressChangeLanguage: ()=> void
  onPressNotifications: ()=> void
  onPressFeatureRequest: ()=> void
  onPressRateApp: ()=> void
  onPressWriteUs: ()=> void
  onPressTermsUse: ()=> void
  onPressPrivacyPolicy: ()=> void
}
export type TMenuItem = {
  title: string
  subTitle?: string
  icon: ImageURISource
  onPress: ()=> void
  iconTintColor?: string
}

export type Section = {
  title: string | null
  data: TMenuItem[]
}
type SectionOptions = {
  language: TLanguage
}
export const getSectionsData = (t: TFunction, handlers: Handlers, options: SectionOptions): Section[] => [
  {
    title: t('general'),
    data: [
      {
        title: t('disableAds'),
        onPress: handlers.onPressDisableAds,
        icon: Images.adBlock,
        iconTintColor: '#FFA100'
      },
      {
        title: t('cloud'),
        onPress: handlers.onPressSaveInternet,
        icon: Images.cloudSync
      },
      {
        title: t('export'),
        onPress: handlers.onPressExport,
        icon: Images.export,
        iconTintColor: '#31A0B2'
      },
      {
        title: t('import'),
        onPress: handlers.onPressImport,
        icon: Images.import,
        iconTintColor: '#31A0B2'
      },
      {
        title: t('changeLanguage'),
        onPress: handlers.onPressChangeLanguage,
        icon: Images.languages,
        subTitle: t(options.language)
      },
    ]
  },
  {
    title: t('supportUs'),
    data: [
      {
        title: t('newFeatureRequest'),
        onPress: handlers.onPressFeatureRequest,
        icon: Images.clipboard
      },
      {
        title: t('rateApp'),
        onPress: handlers.onPressRateApp,
        icon: Images.rate
      },
      {
        title: t('writeUs'),
        onPress: handlers.onPressWriteUs,
        icon: Images.writing
      },
    ]
  },
  {
    title: null,
    data: [
      {
        title: t('termsUse'),
        onPress: handlers.onPressTermsUse,
        icon: Images.contract
      },
      {
        title: t('privacyPolicy'),
        onPress: handlers.onPressPrivacyPolicy,
        icon: Images.insurance
      },
    ]
  }
];
export const getLanguagesData = (t: TFunction, handler: (lang: TLanguage) => void, currLang: TLanguage): TModalDataItem[] => [
  {
    title: t('ru'),
    onPress: () => handler('ru'),
    icon: Images.language,
    check: currLang === 'ru'
  },
  {
    title: t('en'),
    onPress: () => handler('en'),
    icon: Images.language,
    check: currLang === 'en'
  },
];

export const signInGoogle = async () => {
  await GoogleSignin.hasPlayServices();
  await GoogleSignin.signIn();
  const userInfo = await GoogleSignin.getTokens();

  return userInfo.accessToken;
}