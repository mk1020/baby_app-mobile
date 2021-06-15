import React, {memo, useEffect, useState} from 'react';
import {Platform, UIManager, useColorScheme} from 'react-native';
import {Provider} from 'react-redux';
import {setColorScheme, setLoadingAppStatus} from './redux/appSlice';
import './common/localization/localization';
import {InitialState, NavigationState} from '@react-navigation/routers';
import {restoreNavState} from './navigation/utils';
import {App} from './App';
import {ErrorBoundary} from './common/components/ErrorBoundary';
import {store} from './redux/store';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import {ColorSchemes} from './redux/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

(function setup() {
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
})();

export const AppContainer = memo(() => {

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate persistor={persistStore(store)}>
          <App />
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
});
