import React, { useEffect, useState } from 'react';
import { Platform, UIManager, useColorScheme } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import store from './storage/redux/store';
import { ColorSchemes, restoreToken, setColorScheme } from "./storage/redux/appSlice";
import './common/localization/localization';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './services/navigation/navigationService';
import { RootNavigator } from './features/navigation/RootNavigator';
import { storeData } from './storage/asyncStorage/utils';
import { NavigationState } from '@react-navigation/routers';
import { restoreState } from './features/navigation/utils';
import { getInternetCredentials } from 'react-native-keychain';

(function setup() {
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
})();

export const App = () => {
  const [initialState, setInitialState] = useState<NavigationState>();
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const restoreUserToken = async () => {
      const credentials = await getInternetCredentials('not_existing');
      const userToken = credentials && credentials.password;
      userToken && store.dispatch(restoreToken(userToken));
    };

    restoreUserToken();
  }, []);

  useEffect(() => {
    if (!isReady) {
      restoreState().then((state?: NavigationState) => {
        setInitialState(state);
        setIsReady(true);
      });
    }
  }, [isReady]);

  const scheme = useColorScheme();
  store.dispatch(setColorScheme(scheme || ColorSchemes.light));

  const onStateChangeNav = (state?: NavigationState) => storeData('navigation_state', state);

  if (!isReady) {
    return null;
  }
  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef} initialState={initialState} onStateChange={onStateChangeNav}>
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
};
