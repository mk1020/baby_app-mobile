import React, {memo, useEffect, useMemo, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ChaptersTableName, PagesTableName} from '../../../model/schema';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import {Database} from '@nozbe/watermelondb';
import {PageItem} from './PageItem';
import {ChapterItem} from './ChapterItem';
import {PageType} from '../../../navigation/types';
import {useNavigation} from '@react-navigation/native';
import {NavigationPages} from '../../../navigation/pages';
import {ModalDown} from '../../../common/components/ModalDown';
import {ButtonIconVert} from '../../../common/components/ButtonIconVert';
import {useTranslation} from 'react-i18next';
import {Space} from '../../../common/components/Space';
import {Images} from '../../../common/imageResources';
import {deleteChapter, deleteNotesByPage, deletePage} from '../../../model/assist';
import {database} from '../../../AppContainer';

type TProps = {
  database?: Database
  diaryId: string
  chapters?: any[]
  pages?: any[]
}
export const ContentTab_ = memo((props: TProps) => {
  const {diaryId, chapters, pages} = props;
  const navigation = useNavigation();
  const {t} = useTranslation();

  const [currentDiaryChapters, setCurrentDiaryChapters] = useState<any[]>([]);
  const [currentDiaryPages, setCurrentDiaryPages] = useState<any[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [longPressItem, setLongPressItem] = useState<any>();

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

  const onLongPressItem = (item: any) => {
    setShowMenu(true);
    setLongPressItem(item);
  };
  const onRequestClose = () => {
    setShowMenu(false);
  };
  const onPressDelete = () => {
    try {
      if (longPressItem?.table === PagesTableName) {
        deletePage(longPressItem?.id, database);
      }
      if (longPressItem?.table === ChaptersTableName) {
        deleteChapter(longPressItem?.id, database);
      }
      setShowMenu(false);
      console.log(longPressItem);
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({item}: any) => {
    if (item?.table === PagesTableName && item?.chapterId !== '') return null;
    const currentChapterId = item?.id;

    return (
      item?.table === PagesTableName ? (
        <PageItem
          name={item?.name}
          onPress={() => onPressPage(item)}
          onLongPress={() => onLongPressItem(item)}
        />
      ) : (
        <ChapterItem
          chapterNum={item?.number}
          name={item?.name}
          pages={currentDiaryPages.filter(page => page.chapterId === currentChapterId)}
          onPressPage={() => onPressPage(item)}
          onLongPress={() => onLongPressItem(item)}
        />
      )
    );
  };

  const flatListData = useMemo(() => [...currentDiaryPages, ...currentDiaryChapters], [currentDiaryChapters, currentDiaryPages]);
  return (
    <>
      <FlatList
        data={flatListData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <ModalDown
        onBackdropPress={onRequestClose}
        onBackButtonPress={onRequestClose}
        isVisible={showMenu}
        flexHeight={0.15}
      >
        <View style={styles.modalContent}>
          <ButtonIconVert
            title={t('edit')}
            image={Images.edit}
            onPress={onPressDelete}
          />
          <ButtonIconVert
            title={t('delete')}
            image={Images.delete}
            onPress={onPressDelete}
          />
        </View>
      </ModalDown>
    </>
  );
});

export const ContentTab = withDatabase(withObservables(['diaryId'], ({database, diaryId}: TProps) => {
  return {
    chapters: database?.collections?.get(ChaptersTableName).query().observe(),
    pages: database?.collections?.get(PagesTableName).query().observe()
  };
})(ContentTab_));
const styles = StyleSheet.create({
  modalContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },
  sign: {
    width: 150,
    height: 50,
    borderWidth: 1,
    backgroundColor: 'orange',
    marginTop: 10,
    zIndex: 999,
  }
});
