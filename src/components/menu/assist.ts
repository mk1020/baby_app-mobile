import {TFunction} from 'i18next';
import {ImageURISource} from 'react-native';
import {Images} from '../../common/imageResources';

type Handlers = {
  onPressDisableAds: ()=> void
  onPressSync: ()=> void
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
export const getSectionsData = (t: TFunction, handlers: Handlers): Section[] => [
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
        title: t('sync'),
        onPress: handlers.onPressSync,
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
        icon: Images.languages
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
