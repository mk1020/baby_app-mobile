import React, { memo } from 'react';
import { Platform, UIManager } from 'react-native';
import { useSelector } from 'react-redux';
import { TColorScheme } from './redux/appSlice';
import './common/localization/localization';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './navigation/navigationService';
import { RootNavigator } from './navigation/RootNavigator';
import { storeData } from './common/assistant/asyncStorage';
import { NavigationState } from '@react-navigation/routers';
import { RootStoreType } from './redux/rootReducer';

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
      <RootNavigator isAuthorized={!!appState.userToken == false} />
    </NavigationContainer>
  );
});
