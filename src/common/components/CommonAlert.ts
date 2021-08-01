import {Alert} from 'react-native';
import {TFunction} from 'i18next';

export const commonAlert = (t: TFunction, title: string, subTitle: string, onPress: ()=> void) =>
  Alert.alert(
    title,
    subTitle,
    [
      {
        text: t('cancel'),
        style: 'cancel',
      },
      {text: t('ok'), onPress}
    ], {
      cancelable: true,
    }
  );