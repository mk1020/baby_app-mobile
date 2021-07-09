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
import {ChaptersTableName, DiaryTableName, NotesTableName} from '../../model/schema';
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
  diaryChapters: any
}


const Diary_ = memo((props:TProps) => {

  const {notes, diary, database} = props;
  const {params} = props.route;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const token = useSelector(((state: RootStoreType) => state.app.userToken));
  const theme = useSelector(((state: RootStoreType) => state.app.colorScheme));

  const [tabIndex, setTabIndex] = useState(0);
  const [diaryChapters, setDiaryChapters] = useState([]);
  console.log('diaryChapters', diaryChapters);

  useEffect(() => {
    const setChapters = async (diaryId: string) => {
      const chapters = await database.get(ChaptersTableName).query(Q.where('id', diaryId)).fetch();
      setDiaryChapters(chapters);
    };

    if (diary.length) {
      const currentDiaryId = diary[0].id;
      setChapters(currentDiaryId).catch(err => console.log(err));
    }

  }, [diary]);
  return (
    <SafeAreaView style={styles.container}>
      <Header title={diary.length ? diary[0].name : ''}/>
      <Tabs currentTabIndex={tabIndex} onIndexChange={setTabIndex} />
    </SafeAreaView>
  );
});

//type InputProps = ObservableifyProps<TProps, "notes", "diary">
export const Diary = withDatabase(withObservables<TProps, {}>([], ({database}) => {
  return {
    notes: database.collections.get(NotesTableName).query().observe(),
    diary: database.collections.get(DiaryTableName).query(Q.where('is_current', true)).observe(),
    //diaryChapters: database.collections.get(ChaptersTableName).query(Q.where('id', currentDiaryId)).observe()
  };
})(Diary_));

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1
  }
});
