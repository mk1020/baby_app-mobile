import React, { useEffect, useState } from 'react';
import { Platform, UIManager, useColorScheme } from 'react-native';
import { Provider } from 'react-redux';
import { ColorSchemes, setColorScheme, setLoadingAppStatus } from './redux/appSlice';
import './common/localization/localization';
import { NavigationState } from '@react-navigation/routers';
import { restoreNavState } from './navigation/utils';
import { App } from './App';
import { ErrorBoundary } from './common/components/ErrorBoundary';
import { store } from './redux/store';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import i18n from './common/localization/localization';

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
    const restoreNav = async () => {
      const navState: NavigationState = await restoreNavState();
      setInitialNavState(navState);
      store.dispatch(setLoadingAppStatus(false));
    };

    restoreNav().then();
  }, []);

  useEffect(() => {
    store.dispatch(setColorScheme(scheme || ColorSchemes.light));
  }, [scheme]);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate persistor={persistStore(store)}>
          <App initNavState={initialNavState} />
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
};
