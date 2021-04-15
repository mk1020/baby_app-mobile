import React, { memo, useEffect, useState } from 'react';
import { Platform, UIManager, useColorScheme } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import store from './storage/redux/store';
import {
  ColorSchemes,
  restoreToken,
  setColorScheme,
  setLoadingAppStatus,
  TColorScheme,
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

(function setup() {
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
})();

type TProps = {
  initNavState?: NavigationState;
  colorScheme?: TColorScheme;
};
export const App = memo((props: TProps) => {
  const appState = useSelector((state: RootStoreType) => state.app);
  const onStateChangeNav = (state?: NavigationState) => storeData('navigation_state', state);

  return (
    <NavigationContainer
      ref={navigationRef}
      initialState={props.initNavState}
      onStateChange={onStateChangeNav}>
      <RootNavigator isAuthorized={appState.userToken !== 'null'} />
    </NavigationContainer>
  );
});
