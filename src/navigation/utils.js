import { Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const restoreNavState = async () => {
  const initialUrl = await Linking.getInitialURL();

  if (Platform.OS !== 'web' && initialUrl == null) {
    // Only restore state if there's no deep link and we're not on web
    const savedStateString = await AsyncStorage.getItem('navigation_state');
    const state = savedStateString ? JSON.parse(savedStateString) : undefined;
    return state;
  }
};
