import React, {memo, useEffect, useLayoutEffect, useState} from 'react';
import {Platform, UIManager, useColorScheme} from 'react-native';
import {useDispatch} from 'react-redux';
import {InitialState, NavigationState} from '@react-navigation/routers';
import {NavContainer} from './navigation/NavRoot';
import {ColorSchemes, TColorScheme} from './redux/types';
import {googleOAuthClientId} from './common/consts';
import {Spinner} from './common/components/Spinner';
import {setColorScheme} from './redux/appSlice';
import {restoreNavState} from './navigation/utils';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {createDiaryIfNotExist} from './model/assist';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {useTranslation} from 'react-i18next';

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
  const db = useDatabase();
  const {t} = useTranslation();

  useEffect(() => {
    const restoreNav = async () => {
      const navState: NavigationState = await restoreNavState();
      if (navState !== undefined) setInitialNavState(navState);
    };
    restoreNav().finally(() => setIsAppReady(true));

    GoogleSignin.configure({
      webClientId: googleOAuthClientId
    });
  }, []);

  useEffect(() => {
    createDiaryIfNotExist(db, t('diaryTitle'));
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
