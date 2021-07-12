import React, {memo} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {ChaptersTableName, NotesTableName, PagesTableName} from '../../../model/schema';
import {RouteProp} from '@react-navigation/native';
import {AuthDiaryStackScreenList} from '../../../navigation/types';
import {NavigationPages} from '../../../navigation/pages';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import {Q} from '@nozbe/watermelondb';
import {PageItem} from './PageItem';
import {notesAdapter} from '../assist';

type TProps = {
  route: RouteProp<AuthDiaryStackScreenList, NavigationPages.DiaryPage>
  database: any
  notes: any[]
}
export const Page_ = memo((props: TProps) => {
  const {route, notes} = props;

  const renderItem = ({item}: any) => {

    const notesAdapted = notesAdapter(notes);
    notesAdapted.sort((note1, note2) => {
      return note1.createdAt - note2.createdAt;
    });
    return (<PageItem notes={}/>);
  };
  console.log('notes', notes);
  return (
    <FlatList
      data={notes}
      renderItem={renderItem}
      style={styles.container}
      //keyExtractor={item => item.id}
      //extraData={pre}
    />
  );
});


const mock = [
  {
    pageId: '123',
    pageType: 1,
    photo: 'photo',
    title: 'Title Note #1',
    note: 'Текст записи тестирую'
  },
  {
    pageId: '123',
    pageType: 1,
    photo: 'photo',
    title: 'Title Note #2',
    note: 'Текст записи тестирую тестирую тестирую тестирую тестирую тестирую тестирую тестирую'
  },
  {
    pageId: '123',
    pageType: 1,
    photo: 'photo',
    title: 'Title Note #3',
    note: 'Текст записи тестирую'
  },
  {
    pageId: '123',
    pageType: 1,
    photo: 'photo',
    title: 'Title Note #1',
    note: 'Текст записи тестирую'
  },
];
export const Page = withDatabase(withObservables(['route'], ({database, route}: TProps) => {
  return {
    notess: database?.collections?.get(NotesTableName).query(
      Q.where('diary_id', route?.params?.pageData?.diaryId),
      Q.where('page_id', route?.params?.pageData?.id),
    ).observe(),
    notes: mock
  };
})(Page_));

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff'
  }
});
