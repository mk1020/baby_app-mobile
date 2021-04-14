import React from 'react';
import { Platform, UIManager, useColorScheme } from 'react-native';
import { Provider } from 'react-redux';
import { Navigator } from './features/navigation/Navigator';
import store from './storage/redux/store';
import { ColorSchemes, setColorScheme } from './storage/redux/appSlice';
import './common/localization/localization';

(function setup() {
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
})();

export const App = () => {
  const scheme = useColorScheme();
  store.dispatch(setColorScheme(scheme || ColorSchemes.light));

  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
  );
};
