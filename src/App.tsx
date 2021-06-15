import React, {memo, useEffect, useState} from 'react';
import {Platform, UIManager, useColorScheme} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import './common/localization/localization';
import {storeData} from './common/assistant/asyncStorage';
import {InitialState, NavigationState} from '@react-navigation/routers';
import {RootStoreType} from './redux/rootReducer';
import {NavContainer} from './navigation/NavRoot';
import {ColorSchemes, TColorScheme} from './redux/types';
import {PERSISTENCE_NAV_KEY} from './common/consts';
import {Spinner} from './common/components/Spinner';
import {store} from './redux/store';
import {setColorScheme, setLoadingAppStatus} from './redux/appSlice';
import {restoreNavState} from './navigation/utils';

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
  const [initialNavState, setInitialNavState] = useState<InitialState>();
  const [isAppReady, setIsAppReady] = useState(false);

  const dispatch = useDispatch();
  const scheme = useColorScheme();

  useEffect(() => {
    const restoreNav = async () => {
      const navState: NavigationState = await restoreNavState();
      if (navState !== undefined) setInitialNavState(navState);
    };
    restoreNav().finally(() => setIsAppReady(true));
  }, []);

  useEffect(() => {
    dispatch(setColorScheme(scheme || ColorSchemes.light));
  }, [scheme]);

  if (!isAppReady) {
    return <Spinner />;
  }

  return (
    <NavContainer
      initState={initialNavState}
    />
  );
});
