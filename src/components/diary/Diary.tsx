import React, {memo, useMemo, useState} from 'react';
import {Dimensions, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {NavigationPages} from '../../navigation/pages';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {TAuthPagesList} from '../../navigation/types';
import withObservables from '@nozbe/with-observables';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import {RootStoreType} from '../../redux/rootReducer';
import {DiaryTableName, NotesTableName} from '../../model/schema';
import {Q} from '@nozbe/watermelondb';
import {Header} from './Header';
import {SceneMap, TabView} from 'react-native-tab-view';
import {ContentTab} from './contentTab/ContentTab';
import {Tabs} from './Tabs';

type TProps = {
  route: RouteProp<TAuthPagesList, NavigationPages.Diary>
  database: any
  diaryId: string
  notes: any
  diary: any
}


const Diary_ = memo((props:TProps) => {

  const {notes, diary, database} = props;
  const {params} = props.route;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const token = useSelector(((state: RootStoreType) => state.app.userToken));
  const theme = useSelector(((state: RootStoreType) => state.app.colorScheme));

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <Header title={diary.length ? diary[0].name : ''}/>
      <Tabs currentTabIndex={tabIndex} onIndexChange={setTabIndex} />
    </SafeAreaView>
  );
});

//type InputProps = ObservableifyProps<TProps, "notes", "diary">
export const Diary = withDatabase(withObservables<TProps, {}>([], ({database}) => ({
  notes: database.collections.get(NotesTableName).query().observe(),
  diary: database.collections.get(DiaryTableName).query(Q.where('is_current', true)).observe()
}))(Diary_));

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1
  }
});
