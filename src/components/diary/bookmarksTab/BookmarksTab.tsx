import React, {memo, useEffect, useState} from 'react';
import {FlatList, ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {signOut} from '../../../redux/appSlice';
import {useDispatch} from 'react-redux';
import {ChaptersTableName, DiaryTableName, NotesTableName, PagesTableName} from '../../../model/schema';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables, {ObservableifyProps} from '@nozbe/with-observables';
import {Database, Q} from '@nozbe/watermelondb';
import {INoteJSEnhanced, noteAdapter} from '../assist';
import {INoteJS} from '../../../model/types';
import {BookmarkItem} from './BookmarkItem';
import {NavigationPages} from '../../../navigation/pages';
import {NotePageMode} from '../contentTab/NotePage/NotePage';
import {useNavigation} from '@react-navigation/native';

type TProps = {
  database?: Database
  diaryId: string
  bookmarkedNotes?: any[]
}
export const BookmarksTab_ = memo((props: TProps) => {
  const {diaryId, database, bookmarkedNotes} = props;
  const navigation = useNavigation();
  const onPressBookmark = (note: INoteJS) => {
    const noteData = noteAdapter(note);
    navigation.navigate(NavigationPages.NotePage, {mode: NotePageMode.Edit, noteData});
  };

  const renderItem = ({item}: ListRenderItemInfo<INoteJS>) => {
    return (
      <BookmarkItem title={item.title} onPress={() => onPressBookmark(item)} />
    );
  };
  return (
    <FlatList
      data={bookmarkedNotes}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
});
export const BookmarksTab = withDatabase(withObservables(['diaryId'], ({database, diaryId}: TProps) => {
  return {
    bookmarkedNotes: database?.collections?.get(NotesTableName).query(Q.where('bookmarked', true), Q.where('diary_id', diaryId)).observe(),
  };
})(BookmarksTab_));
const styles = StyleSheet.create({
  sign: {
    width: 150,
    height: 50,
    borderWidth: 1,
    backgroundColor: 'orange',
    marginTop: 10,
    zIndex: 999,
  }
});
