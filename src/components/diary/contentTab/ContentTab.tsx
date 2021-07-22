import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {signOut} from '../../../redux/appSlice';
import {useDispatch} from 'react-redux';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {database} from '../../../AppContainer';
import {ChaptersTableName, DiaryTableName, NotesTableName, PagesTableName} from '../../../model/schema';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables, {ObservableifyProps} from '@nozbe/with-observables';
import {Database, Q} from '@nozbe/watermelondb';
import {PageItem} from './PageItem';
import {ChapterItem} from './ChapterItem';
import {PageType} from '../../../navigation/types';
import {useNavigation} from '@react-navigation/native';
import {NavigationPages} from '../../../navigation/pages';

type TProps = {
  database?: Database
  diaryId: string
  chapters?: any[]
  pages?: any[]
}
export const ContentTab_ = memo((props: TProps) => {
  const {diaryId, database, chapters, pages} = props;
  const navigation = useNavigation();

  const [currentDiaryChapters, setCurrentDiaryChapters] = useState<any[]>([]);
  const [currentDiaryPages, setCurrentDiaryPages] = useState<any[]>([]);
  const [pressedChapter, setPressedChapter] = useState();

  useEffect(() => {
    const chapters_ = chapters?.filter(chapter => chapter.diaryId === diaryId);
    chapters_ && setCurrentDiaryChapters(chapters_);

    const pages_ = pages?.filter(page => page.diaryId === diaryId);

    pages_ && setCurrentDiaryPages(pages_);
  }, [chapters, pages]);

  const onPressPage = (item: any) => {
    const pageDataAdapted: PageType = {
      id: item?.id,
      name: item?.name,
      diaryId: item?.diaryId,
      pageType: item?.pageType,
      chapterId: item?.chapterId,
      createdAt: item?.createdAt,
      updatedAt: item?.updatedAt
    };

    navigation.navigate(NavigationPages.DiaryPage, {pageData: pageDataAdapted});
  };

  const renderItem = ({item}: any) => {
    if (item?.table === PagesTableName && item?.chapterId !== '') return null;
    const currentChapterId = item?.id;

    return (
      item?.table === PagesTableName ? (
        <PageItem name={item?.name} onPress={() => onPressPage(item)}/>
      ) : (
        <ChapterItem
          chapterNum={item?.number}
          name={item?.name}
          pages={currentDiaryPages.filter(page => page.chapterId === currentChapterId)}
          onPressPage={() => onPressPage(item)}
        />
      ));
  };

  const flatListData = useMemo(() => [...currentDiaryPages, ...currentDiaryChapters], [currentDiaryChapters, currentDiaryPages]);
  return (
    <FlatList
      data={flatListData}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      //extraData={pre}
    />
  );
});

//type InputProps = ObservableifyProps<TProps, 'diaryId'>
export const ContentTab = withDatabase(withObservables(['diaryId'], ({database, diaryId}: TProps) => {
  return {
    chapters: database?.collections?.get(ChaptersTableName).query().observe(),
    pages: database?.collections?.get(PagesTableName).query().observe()
  };
})(ContentTab_));
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
