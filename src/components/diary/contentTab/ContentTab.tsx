import React, {memo, useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {signOut} from '../../../redux/appSlice';
import {useDispatch} from 'react-redux';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {database} from '../../../AppContainer';
import {ChaptersTableName, DiaryTableName, NotesTableName, PagesTableName} from '../../../model/schema';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables, {ObservableifyProps} from '@nozbe/with-observables';
import {Database, Q} from '@nozbe/watermelondb';

type TProps = {
  database?: Database
  diaryId: string
  chapters?: any[]
  pages?: any[]
}
export const ContentTab_ = memo((props: TProps) => {
  const {diaryId, database, chapters, pages} = props;
  const dispatch = useDispatch();

  const [currentDiaryChapters, setCurrentDiaryChapters] = useState<any[]>([]);
  const [currentDiaryPages, setCurrentDiaryPages] = useState<any[]>([]);

  useEffect(() => {
    const chapters_ = chapters?.filter(chapter => chapter.diaryId === diaryId);
    chapters_ && setCurrentDiaryChapters(chapters_);

    const pages_ = pages?.filter(page => page.diaryId === diaryId);
    pages_ && setCurrentDiaryPages(pages_);
  }, [chapters, pages]);

  const logOut = () => {
    dispatch(signOut());
  };

  console.log('updated chapters', chapters);
  console.log('updated pages', pages);
  console.log('diaryId', diaryId);

  const resetDB = async () => {
    await database?.action(async () => {
      await database?.unsafeResetDatabase();
    });
  };

  const a = async () => {
    const diaryCollection = database?.get(PagesTableName);
    const allPosts = await diaryCollection?.query().fetch();
    console.log(allPosts);
  };
  const createDiary = async () => {
    const diaryCollection = database?.get(DiaryTableName);
    await database?.action(async () => {
      await diaryCollection?.create((diary: any) => {
        diary.userId = 27;
        diary.name = 'Test дневник 3';
        diary.isCurrent = true;
      });
    });
  };
  return (
    <View>
      <Text>text text</Text>
      <TouchableOpacity onPress={logOut} style={styles.sign}>
        <Text>LOGOUT</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={resetDB} style={styles.sign}>
        <Text>RESET DB</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={createDiary} style={styles.sign}>
        <Text>CREATE DIARY</Text>
      </TouchableOpacity>
    </View>
  );
});

//type InputProps = ObservableifyProps<TProps, 'diaryId'>
export const ContentTab = withDatabase(withObservables(['diaryId'], ({database, diaryId}: TProps) => {
  return {
    chapters: database?.collections?.get(ChaptersTableName).query().observe(),
    pages: database?.collections?.get(PagesTableName).query().observe()
    //pages: database?.collections?.get(PagesTableName)?.query(Q.where('id', diaryId))?.observe()
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
