import React, {memo, useEffect, useState} from 'react';
import {Image, Linking, StyleSheet, Text, View} from 'react-native';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import {Database, Q} from '@nozbe/watermelondb';
import {DiaryTableName} from '../../model/schema';
import {useTranslation} from 'react-i18next';
import {Menu} from './Menu';
import {getLanguagesData, getSectionsData} from './assist';
import {ModalSelectorList} from '../../common/components/ModalSelectorList';
import {TLanguage} from '../../common/localization/localization';
import {useDispatch} from 'react-redux';
import {changeDiaryTitle, changeLanguage} from '../../redux/appSlice';
import {subscribe} from 'react-native-zip-archive';
import {backupFileName, exportDBToZip} from '../../model/assist';
import {CachesDirectoryPath, DownloadDirectoryPath} from 'react-native-fs';
import {ModalDown} from '../../common/components/ModalDown';
import ProgressBar from 'react-native-progress/Bar';
import {ConditionView} from '../../common/components/ConditionView';
import {Fonts} from '../../common/phone/fonts';
import {shortPath} from '../../common/assistant/files';
import {Images} from '../../common/imageResources';

type TProps = {
  database?: Database
  diaryId: string
}

enum ExportProgress {
  None='None',
  InProgress= 'InProgress',
  Success= 'Success',
  Error= 'Error',
}

export const MenuContainer_ = memo((props: TProps) => {
  const {diaryId, database} = props;
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();

  const language =  i18n.language as TLanguage;
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [exportProgress, setExportProgress] = useState(ExportProgress.None);

  useEffect(() => {
    const zipProgress = subscribe(({progress, filePath}) => {
      // the filePath is always empty on iOS for zipping.
      setZipProgress(progress);
    });
    return () => zipProgress.remove();
  }, []);

  const onPressDisableAds = () => {};

  const onPressSync = () => {
    console.log(CachesDirectoryPath);
  };

  const onPressExport = async () => {
    try {
      setExportModalVisible(true);
      setExportProgress(ExportProgress.InProgress);
      await exportDBToZip(database as Database);
      setExportProgress(ExportProgress.Success);

    } catch (e) {
      console.log(e);
      setExportProgress(ExportProgress.Error);
    }
  };

  const onPressImport = () => {};

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
  };
  const changeLanguage_ = async (language: TLanguage) => {
    try {
      await i18n.changeLanguage(language);
      setLanguageModalVisible(false);
      dispatch(changeLanguage(language));
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
      <ModalDown
        onBackdropPress={onModalCloseRequest}
        onBackButtonPress={onModalCloseRequest}
        isVisible={exportModalVisible}
      >
        <View style={styles.exportModalContainer}>
          <Text style={styles.exportTitle}>{t('exportData')}</Text>
          <ProgressBar
            progress={zipProgress}
            width={null}
            height={15}
            borderColor={'orange'}
            color={'rgb(236,157,36)'}
            useNativeDriver={true}
            indeterminate={zipProgress === 0 || zipProgress === 1 && exportProgress === ExportProgress.InProgress}
          />
          <ConditionView showIf={exportProgress === ExportProgress.Success}>
            <>
              <Text style={styles.exportDoneText}>{t('exportDone')}</Text>
              <View style={styles.exportPathContainer}>
                <Image source={Images.where} style={styles.imagePath}/>
                <Text style={styles.modalBlackText}>
                  {shortPath(DownloadDirectoryPath + '/' + backupFileName)}
                </Text>
              </View>
            </>
          </ConditionView>

          <ConditionView showIf={exportProgress === ExportProgress.Error}>
            <Text style={styles.errorText}>{t('oops')}</Text>
          </ConditionView>
        </View>
      </ModalDown>
    </>
  );
});
//todo на ios нужно использовать не DownloadDirectoryPath, а что-то другое...
export const MenuContainer = withDatabase(withObservables(['diaryId'], ({database, diaryId}: TProps) => {
  return {
    diary: database?.collections.get(DiaryTableName).query(Q.where('is_current', true)).observe(),
  };
})(MenuContainer_));

const styles = StyleSheet.create({
  exportModalContainer: {
    justifyContent: 'center',
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
  modalBlackMediumText: {
    fontFamily: Fonts.medium,
    fontSize: 14
  },
  exportTitle: {
    alignSelf: 'center',
    fontFamily: Fonts.medium,
    color: '#31A0B2',
    marginBottom: 2
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: 'red',
    alignSelf: 'center'
  },
  exportDoneText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: 'green',
    alignSelf: 'center'

  },
});
