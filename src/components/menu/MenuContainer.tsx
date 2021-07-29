import React, {memo, useEffect, useMemo, useState} from 'react';
import {Linking, StyleSheet} from 'react-native';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import {Database, Q} from '@nozbe/watermelondb';
import {ChaptersTableName, DiaryTableName, PagesTableName} from '../../model/schema';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {useTranslation} from 'react-i18next';
import {Menu} from './Menu';
import {getLanguagesData, getSectionsData} from './assist';
import {ModalSelectorList} from '../../common/components/ModalSelectorList';
import {TLanguage} from '../../common/localization/localization';
import {useNavigation, useNavigationState} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {changeDiaryTitle, changeLanguage} from '../../redux/appSlice';
import {zip, unzip, unzipAssets, subscribe} from 'react-native-zip-archive';
import {exportDBToZip} from '../../model/assist';
import {CachesDirectoryPath, DocumentDirectoryPath, DownloadDirectoryPath} from 'react-native-fs';

type TProps = {
  database?: Database
  diaryId: string
}



export const MenuContainer_ = memo((props: TProps) => {
  const {diaryId, database} = props;
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();

  const language =  i18n.language as TLanguage;
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  useEffect(() => {
    const zipProgress = subscribe(({progress, filePath}) => {
      // the filePath is always empty on iOS for zipping.
      console.log(`progress: ${progress}\nprocessed at: ${filePath}`);
    });
    return () => zipProgress.remove();
  }, []);
  const onPressDisableAds = () => {};
  const onPressSync = () => {
    console.log(CachesDirectoryPath);
  };
  const onPressExport = async () => {
    await exportDBToZip(database as Database);
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
    </>
  );
});

export const MenuContainer = withDatabase(withObservables(['diaryId'], ({database, diaryId}: TProps) => {
  return {
    diary: database?.collections.get(DiaryTableName).query(Q.where('is_current', true)).observe(),
  };
})(MenuContainer_));

const styles = StyleSheet.create({});
