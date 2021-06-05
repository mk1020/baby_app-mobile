import React, {memo} from 'react';
import {Platform, UIManager} from 'react-native';
import {useSelector} from 'react-redux';
import {TColorScheme} from './redux/appSlice';
import './common/localization/localization';
import {storeData} from './common/assistant/asyncStorage';
import {InitialState, NavigationState} from '@react-navigation/routers';
import {RootStoreType} from './redux/rootReducer';
import {NavContainer} from './navigation/NavRoot';

(function setup() {
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
})();

type TProps = {
  initNavState?: InitialState;
  colorScheme?: TColorScheme;
};
export const App = memo((props: TProps) => {
  const appState = useSelector((state: RootStoreType) => state.app);
  const onStateChangeNav = (state?: NavigationState) => storeData('navigation_state', state);

  return (
    <NavContainer
      isAuth={!!appState.userToken}
      initState={props.initNavState}
      onChange={onStateChangeNav}
    />
  );
});
