import {Alert} from 'react-native';
import {TFunction} from 'i18next';

export const deleteAlert = (t: TFunction, onPress: ()=> void) =>
  Alert.alert(
    t('deleteNoteTitle'),
    t('deleteNoteMessage'),
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