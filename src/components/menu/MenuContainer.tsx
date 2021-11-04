import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Image, Linking, Share, StyleSheet, Text, View} from 'react-native';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import {Database, Q} from '@nozbe/watermelondb';
import {DiaryTableName} from '../../model/schema';
import {useTranslation} from 'react-i18next';
import {Menu} from './Menu';
import {getLanguagesData, getSectionsData, signInGoogle} from './assist';
import {ModalSelectorList} from '../../common/components/ModalSelectorList';
import {TLanguage} from '../../common/localization/localization';
import {useDispatch, useSelector} from 'react-redux';
import {changeDiaryTitle, changeLanguage, forceUpdate, oAuthGoogle, setLoadingAppStatus, signOut} from '../../redux/appSlice';
import {subscribe} from 'react-native-zip-archive';
import {Fonts} from '../../common/phone/fonts';
import {shortPath} from '../../common/assistant/files';
import {Images} from '../../common/imageResources';
import {exportDBToZip, importZip} from '../../model/backup';
import {ModalDownProgress, ProgressState} from '../../common/components/ModalDownProgress';
import DocumentPicker from 'react-native-document-picker';
import {RootStoreType} from '../../redux/rootReducer';
import {commonAlert} from '../../common/components/CommonAlert';
import {ConditionView} from '../../common/components/ConditionView';
import {isIos} from '../../common/phone/utils';
import {syncDB} from '../../model/remoteSave/sync';
import {downloadFromGoogle, saveInGoogleDrive} from '../../model/remoteSave/google';
import {ModalSaveData} from './ModalSaveData';
import {DownloadProgressCallbackResult} from 'react-native-fs';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {SaveDataToPhoneContainer} from './SaveDataToPhoneContainer';

type TProps = {
  database?: Database
  diary: any
}

export enum ProgressActions {
  Zip = 'Zip',
  Download = 'Download',
  Other = 'Other'
}
export enum ProcessType {
  Pull = 'Pull',
  Push = 'Push',
  Import = 'Import',
  Export = 'Export'
}

export type Progress = {
  progress: number
  state: ProgressState,
  action: ProgressActions,
  showModalAfterReload?: boolean
  processType?: ProcessType | null
}

export const MenuContainer_ = memo((props: TProps) => {
  const {database, diary} = props;
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();

  const language =  i18n.language as TLanguage;
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [importStarted, setImportStarted] = useState(false);
  const [exportStarted, setExportStarted] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);

  const [progress, setProgress] = useState<Progress>({
    progress: 0,
    state: ProgressState.None,
    action: ProgressActions.Other,
    processType: null,
    showModalAfterReload: false
  });

  useEffect(() => {
    const zipProgress = subscribe(res => {
      if (res.progress === 1) {
        setProgress({...progress, state: ProgressState.Success, progress: res.progress, action: ProgressActions.Zip});
      } else {
        setProgress({...progress, state: ProgressState.InProgress, progress: res.progress, action: ProgressActions.Zip});
      }
    });
    return () => zipProgress.remove();
  }, [progress]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onPressDisableAds = () => {};

  const onPressChangeLanguage = () => {
    setLanguageModalVisible(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onPressNotifications = () => {};

  const onPressFeatureRequest = async () => {
    const url = `mailto:app.mikhail.kovalchuk@gmail.com?subject=${t('newFeatureRequest')}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onPressRateApp = () => {};
  const onPressWriteUs = async () => {
    const url = `mailto:app.mikhail.kovalchuk@gmail.com?subject=${t('writeUs')}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onPressTermsUse =  () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onPressPrivacyPolicy = () => {};

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
  const onPressLogOut = () => {
    commonAlert(t, t('exitAlert'), t('exitMassage'), () => dispatch(signOut()));
  };

  const onPressSaveInternet = () => {
    setSaveModalVisible(true);
  };

  const onPressExport = () => {
    setExportStarted(true);
    setProgress({
      progress: 0,
      state: ProgressState.None,
      action: ProgressActions.Other,
      processType: ProcessType.Export
    });
  };
  const onPressImport = async () => {
    setImportStarted(true);
    setProgress({
      progress: 0,
      state: ProgressState.None,
      action: ProgressActions.Other,
      processType: ProcessType.Import
    });
  };

  const onImportExportCloseRequest = () => {
    setProgress({
      progress: 0,
      state: ProgressState.None,
      action: ProgressActions.Other,
      processType: null
    });
    setImportStarted(false);
    setExportStarted(false);
  };

  const onModalCloseRequest = useCallback(() => {
    setProgress({...progress, state: ProgressState.None});
    setLanguageModalVisible(false);
    setSaveModalVisible(false);
  }, [progress]);

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
        //isAuth={userToken !== null}
        onPressLogOut={onPressLogOut}
        //diaryId={diaryId}
      />
      <ModalSelectorList
        data={getLanguagesData(t, changeLanguage_, language)}
        onRequestClose={onModalCloseRequest}
        isVisible={languageModalVisible}
      />
      <SaveDataToPhoneContainer
        progress={progress}
        setProgress={setProgress}
        onModalCloseRequest={onImportExportCloseRequest}
        database={database}
        exportStarted={exportStarted}
        importStarted={importStarted}
      />

      <ModalSaveData
        isVisible={saveModalVisible}
        progress={progress}
        onModalCloseRequest={onModalCloseRequest}
        database={database}
        setProgress={setProgress}
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
