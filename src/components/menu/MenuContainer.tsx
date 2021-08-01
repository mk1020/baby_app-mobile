import React, {memo, useEffect, useState} from 'react';
import {Image, Linking, StyleSheet, Text, View} from 'react-native';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import {Database} from '@nozbe/watermelondb';
import {DiaryTableName} from '../../model/schema';
import {useTranslation} from 'react-i18next';
import {Menu} from './Menu';
import {getLanguagesData, getSectionsData} from './assist';
import {ModalSelectorList} from '../../common/components/ModalSelectorList';
import {TLanguage} from '../../common/localization/localization';
import {useDispatch} from 'react-redux';
import {changeDiaryTitle, changeLanguage, forceUpdate} from '../../redux/appSlice';
import {subscribe} from 'react-native-zip-archive';
import {CachesDirectoryPath} from 'react-native-fs';
import {Fonts} from '../../common/phone/fonts';
import {shortPath} from '../../common/assistant/files';
import {Images} from '../../common/imageResources';
import {exportDBToZip, importZip} from '../../model/backup';
import {ModalDownProgress, ProgressState} from '../../common/components/ModalDownProgress';
import DocumentPicker from 'react-native-document-picker';
import {getStorageData, storeData} from '../../common/assistant/asyncStorage';

type TProps = {
  database?: Database
  diaryId: string
}
//todo если я буду использовать CodePush, то нужно удалить react-native-restart и использовать reload из codePush

type BackupProgress = {
  progress: number
  state: ProgressState,
  showModalAfterReload?: boolean
}

export const MenuContainer_ = memo((props: TProps) => {
  const {diaryId, database} = props;
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();

  const language =  i18n.language as TLanguage;
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [backupProgress, setBackupProgress] = useState<BackupProgress>({
    progress: 0,
    state: ProgressState.None,
    showModalAfterReload: false
  });
  const [backupFilePath, setBackupFilePath] = useState('');

  useEffect(() => {
    (async () => {
      const res = await getStorageData('modalVisible');
      if (res) {
        const modalVisible = JSON.parse(res);
        setImportModalVisible(modalVisible);
        if (modalVisible) {
          setBackupProgress({
            progress: 1,
            state: ProgressState.Success,
            showModalAfterReload: true
          });
        }
      }
    })();
  }, []);

  useEffect(() => {
    const zipProgress = subscribe(({progress, filePath}) => {
      // the filePath is always empty on iOS for zipping.
      if (progress === 1) {
        setBackupProgress({state: ProgressState.Success, progress});
      } else {
        setBackupProgress({state: ProgressState.InProgress, progress});
      }
    });
    return () => zipProgress.remove();
  }, [backupProgress]);

  const onPressDisableAds = () => {};

  const onPressSync = () => {
    console.log(CachesDirectoryPath);
  };

  const onPressExport = async () => {
    try {
      setBackupProgress({...backupProgress, state: ProgressState.InProgress});
      setExportModalVisible(true);
      const backupFilePath = await exportDBToZip(database as Database);
      backupFilePath && setBackupFilePath(backupFilePath);
    } catch (e) {
      console.log(e);
      setBackupProgress({
        state: ProgressState.Error,
        progress: 0,
      });
      setExportModalVisible(false);
    }
  };

  const onPressImport = async () => {
    try {
      setImportModalVisible(true);
      setBackupProgress({...backupProgress, state: ProgressState.InProgress});
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.zip],
        copyTo: 'cachesDirectory',
      });
      await importZip(database as Database, res?.fileCopyUri);
    } catch (e) {
      if (DocumentPicker.isCancel(e)) {
        setImportModalVisible(false);
        setBackupProgress({
          state: ProgressState.None,
          progress: 0,
        });
      } else {
        console.log(e);
        setBackupProgress({
          state: ProgressState.Error,
          progress: 0,
        });
      }

    }
  };

  const onPressChangeLanguage = () => {
    setLanguageModalVisible(true);
  };

  const onPressNotifications = () => {};

  const onPressFeatureRequest = async () => {
    const url = `mailto:app.mikhail.kovalchuk@gmail.com?subject=${t('newFeatureRequest')}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };
  const onPressRateApp = () => {
  };
  const onPressWriteUs = async () => {
    const url = `mailto:app.mikhail.kovalchuk@gmail.com?subject=${t('writeUs')}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };
  const onPressTermsUse =  () => {};
  const onPressPrivacyPolicy = () => {};

  const onModalCloseRequest = () => {
    setLanguageModalVisible(false);
    setExportModalVisible(false);
    setImportModalVisible(false);
    setBackupProgress({
      progress: 0,
      state: ProgressState.None
    });
    storeData('modalVisible', false);

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
  const handlers = {
    onPressDisableAds,
    onPressSync,
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

  return (
    <>
      <Menu renderData={getSectionsData(t, handlers, sectionDataOpt)} />
      <ModalSelectorList
        data={getLanguagesData(t, changeLanguage_, language)}
        onRequestClose={onModalCloseRequest}
        isVisible={languageModalVisible}
      />
      <ModalDownProgress
        isVisible={exportModalVisible}
        state={backupProgress.state}
        onRequestClose={onModalCloseRequest}
        progress={backupProgress.progress}
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
        state={backupProgress.state}
        showAfterReload={backupProgress?.showModalAfterReload}
        onRequestClose={onModalCloseRequest}
        progress={backupProgress.progress}
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
    </>
  );
});
//todo на ios нужно использовать не DownloadDirectoryPath, а что-то другое...
//todo на ios нужно включить доступ в icloud для пикера файлов, это делает когда покупаешь аккаунт азработчика
export const MenuContainer = withDatabase(withObservables(['diaryId'], ({database, diaryId}: TProps) => {
  return {
    diary: database?.collections.get(DiaryTableName).query().observe(),
  };
})(MenuContainer_));

type ExportSuccessProps = {
  backupFilePath: string
  doneText: string
}
const ExportSuccess = (props: ExportSuccessProps) => {
  return (
    <>
      <Text style={styles.exportDoneText}>{props.doneText}</Text>
      <View style={styles.exportPathContainer}>
        <Image source={Images.where} style={styles.imagePath}/>
        <Text style={styles.modalBlackText}>
          {props.backupFilePath}
        </Text>
      </View>
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
      <Text style={styles.exportDoneText}>{props.successText}</Text>
      <Text style={styles.exportDoneText}>{props.successSecondText}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  exportDoneText: {
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
