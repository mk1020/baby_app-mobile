import React, {memo, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {NavigationPages, NavigationTabs} from '../../navigation/pages';
import {RouteProp} from '@react-navigation/native';
import {RootStackList, TabsList} from '../../navigation/types';
import withObservables from '@nozbe/with-observables';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import {ChaptersTableName, DiaryTableName, NotesTableName} from '../../model/schema';
import {Q} from '@nozbe/watermelondb';
import {Header} from './Header';
import {Tabs} from './Tabs';

type TProps = {
  route: RouteProp<TabsList, NavigationTabs.Diary>
  database: any
  diaryId: string
  notes: any
  diary: any
  chapters: any
}


const Diary_ = memo((props:TProps) => {

  const {notes, diary, database, chapters} = props;
  const {params} = props.route;

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
    backgroundColor: 'rgb(244, 244, 236)',
    flex: 1
  }
});

