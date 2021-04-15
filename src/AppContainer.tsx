import React, { useEffect, useState } from 'react';
import { Platform, UIManager, useColorScheme } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import store from './storage/redux/store';
import {
  ColorSchemes,
  restoreToken,
  setColorScheme,
  setLoadingAppStatus,
} from './storage/redux/appSlice';
import './common/localization/localization';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './navigation/navigationService';
import { RootNavigator } from './navigation/RootNavigator';
import { storeData } from './storage/asyncStorage/utils';
import { NavigationState } from '@react-navigation/routers';
import { restoreNavState } from './navigation/utils';
import { getInternetCredentials } from 'react-native-keychain';
import { RootStoreType } from './storage/redux/rootReducer';
import { App } from './App';
import { ErrorBoundary } from "./common/components/ErrorBoundary";

(function setup() {
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
})();

export const AppContainer = () => {
  const [initialNavState, setInitialNavState] = useState<NavigationState>();
  const scheme = useColorScheme();

  useEffect(() => {
    store.dispatch(setLoadingAppStatus(true));
    const restoreData = async () => {
      const credentials = await getInternetCredentials('token');
      const userToken = credentials && credentials.password;
      userToken && store.dispatch(restoreToken(userToken));

      const navState: NavigationState = await restoreNavState();
      setInitialNavState(navState);
      store.dispatch(setLoadingAppStatus(false));
    };

    restoreData();
  }, []);

  useEffect(() => {
    store.dispatch(setColorScheme(scheme || ColorSchemes.light));
  }, [scheme]);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <App initNavState={initialNavState} />
      </Provider>
    </ErrorBoundary>
  );
};
