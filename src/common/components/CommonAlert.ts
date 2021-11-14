import {Alert} from 'react-native';
import {TFunction} from 'i18next';

export const commonAlert = (t: TFunction, title: string, subTitle: string, onPress?: ()=> void, onPressCancel?: ()=> void) =>
  Alert.alert(
    title,
    subTitle,
    [
      {
        text: t('cancel'),
        style: 'cancel',
        onPress: onPressCancel
      },
      {text: t('ok'), onPress}
    ], {
      cancelable: true,
    }
  );