import React, {memo, useEffect, useMemo, useState} from 'react';
import {Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {NavigationPages} from '../../navigation/pages';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {TAuthPagesList} from '../../navigation/types';
import withObservables from '@nozbe/with-observables';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import {RootStoreType} from '../../redux/rootReducer';
import {ChaptersTableName, DiaryTableName, NotesTableName, PagesTableName} from '../../model/schema';
import {Q} from '@nozbe/watermelondb';
import {Header} from './Header';
import {SceneMap, TabView} from 'react-native-tab-view';
import {ContentTab} from './contentTab/ContentTab';
import {Tabs} from './Tabs';
import {checkUnsyncedChanges} from '../../model/sync';

type TProps = {
  route: RouteProp<TAuthPagesList, NavigationPages.Diary>
  database: any
  diaryId: string
  notes: any
  diary: any
  chapters: any
}


const Diary_ = memo((props:TProps) => {

  const {notes, diary, database, chapters} = props;
  const {params} = props.route;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const token = useSelector(((state: RootStoreType) => state.app.userToken));
  const theme = useSelector(((state: RootStoreType) => state.app.colorScheme));

  const [tabIndex, setTabIndex] = useState(0);

  const diaryData = diary.length ? diary[0] : null;
  //todo возможно когда diaryId обновится, pages and chapters не обновятся..
  return (
    <SafeAreaView style={styles.container}>
      <Header title={diaryData?.name || ''} diaryId={diaryData?.id} chapters={chapters}/>
      <Tabs currentTabIndex={tabIndex} onIndexChange={setTabIndex} diaryId={diaryData?.id}/>
    </SafeAreaView>
  );
});

//type InputProps = ObservableifyProps<TProps, "notes", "diary">
export const Diary = withDatabase(withObservables<TProps, {}>([], ({database}) => {
  return {
    notes: database.collections.get(NotesTableName).query().observe(),
    diary: database.collections.get(DiaryTableName).query(Q.where('is_current', true)).observe(),
    chapters: database.collections.get(ChaptersTableName).query().observe()
  };
})(Diary_));

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1
  }
});
