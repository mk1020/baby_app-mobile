import React, {memo, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import {Database, Q} from '@nozbe/watermelondb';
import {ChaptersTableName, DiaryTableName, PagesTableName} from '../../model/schema';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {useTranslation} from 'react-i18next';
import {Menu} from './Menu';
import {getSectionsData} from './assist';

type TProps = {
  database?: Database
  diaryId: string
}



export const MenuContainer_ = memo((props: TProps) => {
  const {diaryId, database} = props;
  const db = useDatabase();
  const {t} = useTranslation();

  const onPressDisableAds = () => {};
  const onPressSync = () => {};
  const onPressExport = () => {};
  const onPressImport = () => {};
  const onPressChangeLanguage = () => {};
  const onPressNotifications = () => {};
  const onPressFeatureRequest = () => {};
  const onPressRateApp = () => {};
  const onPressWriteUs = () => {};
  const onPressTermsUse =  () => {};
  const onPressPrivacyPolicy = () => {};

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

  return (
    <Menu
      renderData={getSectionsData(t, handlers)}
    />
  );
});

export const MenuContainer = withDatabase(withObservables(['diaryId'], ({database, diaryId}: TProps) => {
  return {
    diary: database?.collections.get(DiaryTableName).query(Q.where('is_current', true)).observe(),
  };
})(MenuContainer_));

const styles = StyleSheet.create({});
