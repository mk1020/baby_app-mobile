import React, {memo, useEffect, useState} from 'react';
import {Linking, StyleSheet} from 'react-native';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import {Database, Q} from '@nozbe/watermelondb';
import {DiaryTableName} from '../../model/schema';
import {useTranslation} from 'react-i18next';
import {Menu} from './Menu';
import {getLanguagesData, getSectionsData} from './assist';
import {ModalSelectorList} from '../../common/components/ModalSelectorList';
import {TLanguage} from '../../common/localization/localization';
import {useDispatch, useSelector} from 'react-redux';
import {changeDiaryTitle, changeLanguage, forceUpdate, setNotificationAfterChangeAcc} from '../../redux/appSlice';
import {Fonts} from '../../common/phone/fonts';
import {RootStoreType} from '../../redux/rootReducer';
import {ModalSaveData} from './ModalSaveData';
import {ExportModal} from './SaveToPhone/ExportModal';
import {ImportModal} from './SaveToPhone/ImportModal';
import {commonAlert} from '../../common/components/CommonAlert';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

type TProps = {
    database?: Database
    diary: any
}

export const MenuContainer_ = memo((props: TProps) => {
  const {database, diary} = props;
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();

  const userToken = useSelector((state: RootStoreType) => state.app.userToken);
  const lastSyncedAt = useSelector((state: RootStoreType) => state.app.lastSyncAt);
  const email = useSelector((state: RootStoreType) => state.app.userEmail);
  const isAuthError = useSelector((state: RootStoreType) => state.app.isAuthError);

  const notificationAfterChangeAccWasShown = useSelector((state: RootStoreType) => state.app.notificationAfterChangeAccWasShown);
  const lastUserEmail = useSelector((state: RootStoreType) => state.app.lastUserEmail);
  const userEmail = useSelector((state: RootStoreType) => state.app.userEmail);

  const language = i18n.language as TLanguage;
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [importStarted, setImportStarted] = useState(false);
  const [exportStarted, setExportStarted] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);

  useEffect(() => {
    if (userEmail !== lastUserEmail && !notificationAfterChangeAccWasShown && !!userEmail) {
      console.log(userEmail, lastUserEmail, notificationAfterChangeAccWasShown);
      console.log(userEmail !== lastUserEmail && !notificationAfterChangeAccWasShown);
      commonAlert(t, t('attention'), t('notificAfterChangeAcc'));
      dispatch(setNotificationAfterChangeAcc(true));
    }
  }, [userEmail]);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onPressDisableAds = () => {
  };

  const onPressChangeLanguage = async () => {
    setLanguageModalVisible(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onPressNotifications = () => {
  };

  const onPressFeatureRequest = async () => {
    const url = `mailto:app.mikhail.kovalchuk@gmail.com?subject=${t('newFeatureRequest')}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onPressRateApp = () => {
  };
  const onPressWriteUs = async () => {
    const url = `mailto:app.mikhail.kovalchuk@gmail.com?subject=${t('writeUs')}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onPressTermsUse = async () => {
    await GoogleSignin.signOut();

  };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onPressPrivacyPolicy = () => {
  };

  const changeLanguage_ = async (language: TLanguage) => {
    try {
      await i18n.changeLanguage(language);
      setLanguageModalVisible(false);
      dispatch(changeLanguage(language));
      dispatch(forceUpdate());
      dispatch(changeDiaryTitle(t('diaryTitle')));
    } catch (e) {
      console.log(e);
    }
  };

  const onPressSaveInternet = () => {
    setSaveModalVisible(true);
  };

  const onPressExport = () => {
    setExportStarted(true);
  };

  const onPressImport = async () => {
    setImportStarted(true);
  };

  const onImportExportCloseRequest = () => {
    setImportStarted(false);
    setExportStarted(false);
  };

  const onModalCloseRequest = () => {
    setLanguageModalVisible(false);
    setSaveModalVisible(false);
  };

  const handlers = {
    onPressDisableAds,
    onPressSaveInternet,
    onPressExport,
    onPressImport,
    onPressChangeLanguage,
    onPressNotifications,
    onPressFeatureRequest,
    onPressRateApp,
    onPressWriteUs,
    onPressTermsUse,
    onPressPrivacyPolicy,
  };

  const sectionDataOpt = {
    language
  };
  const diaryId = diary?.length ? diary[0].id : '';
  return (
    <>
      <Menu
        renderData={getSectionsData(t, handlers, sectionDataOpt)}
        isAuth={userToken !== null}
        diaryId={diaryId}
        lastSyncedAt={lastSyncedAt}
        email={email}
        isAuthError={isAuthError}
      />
      <ModalSelectorList
        data={getLanguagesData(t, changeLanguage_, language)}
        onRequestClose={onModalCloseRequest}
        isVisible={languageModalVisible}
      />
      <ImportModal
        onRequestClose={onImportExportCloseRequest}
        isVisible={importStarted}
        database={database}
      />
      <ExportModal
        onRequestClose={onImportExportCloseRequest}
        isVisible={exportStarted}
        database={database}
      />
      <ModalSaveData
        isVisible={saveModalVisible}
        onModalCloseRequest={onModalCloseRequest}
        database={database}
      />
    </>
  );
});
//todo на ios нужно включить доступ в icloud для пикера файлов, это делает когда покупаешь аккаунт азработчика
export const MenuContainer = withDatabase(withObservables([], ({database}: TProps) => {
  return {
    diary: database?.collections.get(DiaryTableName).query(Q.where('is_current', true)).observe(),
  };
})(MenuContainer_));


const styles = StyleSheet.create({
  doneText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: 'green',
    alignSelf: 'center'
  },
  importSuccessContainer: {
    marginTop: 28
  },
  exportPathContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: '#f6eaea',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 5
  },
  imagePath: {
    marginRight: 8,
    width: 24,
    height: 24,
    tintColor: '#FFA100'
  },
  modalBlackText: {
    fontFamily: Fonts.regular,
    fontSize: 14
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: 'red',
    alignSelf: 'center'
  },
});
