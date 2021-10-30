import React, {memo, useEffect, useState} from 'react';
import {Image, Linking, Share, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
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
import {changeDiaryTitle, changeLanguage, forceUpdate, signOut} from '../../redux/appSlice';
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
import {ModalDown} from '../../common/components/ModalDown';
import {saveInGoogleDrive} from '../../model/remoteSave/google';
import {ModalSaveData} from './ModalSaveData';

type TProps = {
  database?: Database
  diary: any
}
//todo если я буду использовать CodePush, то нужно удалить react-native-restart и использовать reload из codePush

export type Progress = {
  progress: number
  state: ProgressState,
  showModalAfterReload?: boolean
}

export const MenuContainer_ = memo((props: TProps) => {
  const {database, diary} = props;
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const userToken = useSelector((state: RootStoreType) => state.app.userToken);
  const googleAccessToken = useSelector((state: RootStoreType) => state.app.googleAccessToken);
  const userId = useSelector((state: RootStoreType) => state.app.userId);

  const language =  i18n.language as TLanguage;
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [uploadingMode, setUploadingMode] = useState(false);
  const [progress, setProgress] = useState<Progress>({
    progress: 0,
    state: ProgressState.None,
    showModalAfterReload: false
  });
  const [backupFilePath, setBackupFilePath] = useState('');


  useEffect(() => {
    const zipProgress = subscribe(({progress, filePath}) => {
      // the filePath is always empty on iOS for zipping.
      if (progress === 1) {
        setProgress({state: ProgressState.Success, progress});
      } else {
        setProgress({state: ProgressState.InProgress, progress});
      }
    });
    return () => zipProgress.remove();
  }, [progress]);

  useEffect(() => {
    try {
      if (backupFilePath && isIos) {
        (async () => {
          const result = await Share.share({
            url: backupFilePath
          });
          if (result.action === 'dismissedAction') {
            onModalCloseRequest();
          }
        })();
      }
    } catch (e) {
      console.log(e);
    }
  }, [backupFilePath]);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onPressDisableAds = () => {};

  const onPressSync = () => {
    syncDB(database as Database, userToken, userId).catch(console.log);
  };

  const onPressExport = async () => {
    try {
      setProgress({...progress, state: ProgressState.InProgress});
      setExportModalVisible(true);
      const backupFilePath = await exportDBToZip(database as Database);
      backupFilePath && setBackupFilePath(backupFilePath);
    } catch (e) {
      setProgress({
        state: ProgressState.Error,
        progress: 0,
      });
      setExportModalVisible(false);
    }
  };

  const onPressImport = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.zip],
        copyTo: 'cachesDirectory',
      });
      setImportModalVisible(true);
      setProgress({...progress, state: ProgressState.InProgress});
      await importZip(database as Database, res?.fileCopyUri);
    } catch (e) {
      if (DocumentPicker.isCancel(e)) {
        setImportModalVisible(false);
        setProgress({
          state: ProgressState.None,
          progress: 0,
        });
      } else {
        console.log(e);
        setProgress({
          state: ProgressState.Error,
          progress: 0,
        });
      }

    }
  };

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

  const onModalCloseRequest = () => {
    setLanguageModalVisible(false);
    setExportModalVisible(false);
    setImportModalVisible(false);
    setSaveModalVisible(false);
    setUploadingMode(false);
    setProgress({
      progress: 0,
      state: ProgressState.None
    });
    //storeData('modalVisible', false).catch(console.log);
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
  const onPressLogOut = () => {
    commonAlert(t, t('exitAlert'), t('exitMassage'), () => dispatch(signOut()));
  };
  const onPressUploadGoogle = async () => {
    try {
      const accessToken = await signInGoogle();
      setUploadingMode(true);
      await saveInGoogleDrive(database as Database, accessToken, (loadedMB, totalMB) => {
        setProgress({
          state: loadedMB !== totalMB ? ProgressState.InProgress : ProgressState.Success,
          progress: loadedMB / totalMB
        });
      });
    } catch (e) {
      setProgress({
        state: ProgressState.Error,
        progress: 0,
      });
    }

  };

  const onPressSaveInternet = () => {
    setSaveModalVisible(true);
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
        onPressLogOut={onPressLogOut}
        diaryId={diaryId}
      />
      <ModalSelectorList
        data={getLanguagesData(t, changeLanguage_, language)}
        onRequestClose={onModalCloseRequest}
        isVisible={languageModalVisible}
      />
      <ModalDownProgress
        isVisible={exportModalVisible}
        state={progress.state}
        onRequestClose={onModalCloseRequest}
        progress={progress.progress}
        title={t('exportData')}
        SuccessComponent={
          <ExportSuccess
            backupFilePath={shortPath(backupFilePath)}
            doneText={t('exportDone')}
          />
        }
        ErrorComponent={
          <Text style={styles.errorText}>{t('oops')}</Text>
        }
      />
      <ModalDownProgress
        isVisible={importModalVisible}
        state={progress.state}
        showAfterReload={progress?.showModalAfterReload}
        onRequestClose={onModalCloseRequest}
        progress={progress.progress}
        title={t('waitPlease')}
        SuccessComponent={
          <ImportSuccess
            successText={t('allReady')}
            successSecondText={t('haveNiceDay')}
          />
        }
        ErrorComponent={
          <Text style={styles.errorText}>{t('oops')}</Text>
        }
      />

      <ModalSaveData
        isVisible={saveModalVisible}
        progress={progress}
        onModalCloseRequest={onModalCloseRequest}
        onPressSync={onPressSync}
        onPressUploadGoogle={onPressUploadGoogle}
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

type ExportSuccessProps = {
  backupFilePath: string
  doneText: string
}
const ExportSuccess = (props: ExportSuccessProps) => {
  return (
    <>
      <Text style={styles.doneText}>{props.doneText}</Text>
      <ConditionView showIf={!isIos}>
        <View style={styles.exportPathContainer}>
          <Image source={Images.where} style={styles.imagePath}/>
          <Text style={styles.modalBlackText}>
            {props.backupFilePath}
          </Text>
        </View>
      </ConditionView>
    </>
  );
};

type ImportSuccessProps = {
  successText: string
  successSecondText: string
}
const ImportSuccess = (props: ImportSuccessProps) => {
  return (
    <View style={styles.importSuccessContainer}>
      <Text style={styles.doneText}>{props.successText}</Text>
      <Text style={styles.doneText}>{props.successSecondText}</Text>
    </View>
  );
};

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
