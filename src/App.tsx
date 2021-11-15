import React, {memo, useEffect, useState} from 'react';
import {Platform, UIManager, useColorScheme} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {InitialState, NavigationState} from '@react-navigation/routers';
import {NavContainer} from './navigation/NavRoot';
import {ColorSchemes, TColorScheme} from './redux/types';
import {googleOAuthClientId} from './common/consts';
import {Spinner} from './common/components/Spinner';
import {changeDiaryTitle, changeLanguage, setColorScheme, setDiaryId} from './redux/appSlice';
import {restoreNavState} from './navigation/utils';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {createDiaryIfNotExist} from './model/assist';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {useTranslation} from 'react-i18next';
import {fallbackLanguage, TLanguage} from './common/localization/localization';
import {RootStoreType} from './redux/rootReducer';

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
  const {t, i18n} = useTranslation();
  const language = useSelector((state: RootStoreType) => state.app.language);
  const diaryTitle = useSelector((state: RootStoreType) => state.app.diaryTitle);

  useEffect(() => {
    const restoreNav = async () => {
      const navState: NavigationState = await restoreNavState();
      if (navState !== undefined) setInitialNavState(navState);
    };
    restoreNav().finally(() => setIsAppReady(true));

    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/drive',
      ],
      webClientId: googleOAuthClientId,
    });
  }, []);

  useEffect(() => {
    if (!language) dispatch(changeLanguage(i18n.language as TLanguage));
    if (i18n.language !== language && language) i18n.changeLanguage(language || fallbackLanguage);
  }, [i18n]);

  useEffect(() => {
    if (!diaryTitle) dispatch(changeDiaryTitle(t('diaryTitle')));
  }, [diaryTitle]);

  useEffect(() => {
    (async () => {
      const diaryId = await createDiaryIfNotExist(db, t('diaryTitle'));
      dispatch(setDiaryId(diaryId));
    })();
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
