import {Linking, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getStorageData} from '../common/assistant/asyncStorage';
import {PERSISTENCE_NAV_KEY} from '../common/consts';

export const restoreNavState = async () => {
  const initialUrl = await Linking.getInitialURL();

  if (Platform.OS !== 'web' && initialUrl === null) {
    // Only restore state if there's no deep link and we're not on web
    const savedStateString = await getStorageData(PERSISTENCE_NAV_KEY);
    const state = savedStateString ? JSON.parse(savedStateString) : undefined;

    return state;
  }
};
