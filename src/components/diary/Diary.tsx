import React, {memo, Props} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {NavigationPages} from '../../navigation/pages';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {TAuthPagesList} from '../../navigation/types';
import {signOut} from '../../redux/appSlice';
import withObservables, {ObservableifyProps} from '@nozbe/with-observables';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import {checkUnsyncedChanges, syncDB} from '../../model/sync';
import {RootStoreType} from '../../redux/rootReducer';
import {DiaryTableName, NotesTableName} from '../../model/schema';
import {Q} from '@nozbe/watermelondb';
import {colorsByTheme} from '../../common/consts/colorsByTheme';

const _Diary = memo((props:TProps) => {
  const {t, i18n} = useTranslation();

  const {notes, diary, database} = props;
  const {params} = props.route;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const token = useSelector(((state: RootStoreType) => state.app.userToken));
  const theme = useSelector(((state: RootStoreType) => state.app.colorScheme));

  React.useLayoutEffect(() => {
    if (diary.length) {
      navigation.setOptions({
        title: diary[0].name,
        headerStyle: {
          backgroundColor: colorsByTheme(theme).backgroundColor,
        },
        headerTitleStyle: {
          alignSelf: 'center',
          fontWeight: 600,
          letterSpacing: -0.26,
          lineHeight: 24,
          fontSize: 20,
          color: colorsByTheme(theme).headerTitle
        }
      });
    }
  }, [navigation, diary]);

  const logOut = () => {
    dispatch(signOut());
  };
  console.log('diary', diary);
  const newNote = async () => {
    const notesCollection = props.database.get('notes');
    await props.database.action(async () => {
      const newNote = await notesCollection.create((note: any) => {
        note.diaryId = 1;
        note.noteType = 4;
        note.note = 'Test запись';
        note.achievement = 'Test achievement';
        note.photo = 'Test photo';
      });
    });
  };

  const getAllNotes = async () => {
    const notesCollection = props.database.get('notes');
    const diaryCollection = props.database.get('diaries');
    const allPosts = await notesCollection.query().fetch();
    const allDiaries = await diaryCollection.query().fetch();
    console.log('all posts', allPosts);
    console.log('all diaries', allDiaries);
  };

  const checkChanges = async () => {
    await checkUnsyncedChanges(props.database);
    await props.database.action(async () => {
      await props.database.unsafeResetDatabase();
    });
  };
  const sync = async () => {
    if (token) {
      syncDB(props.database, token, 1).then().catch();
    }
  };
  const updateNote = async () => {
    const notesCollection = props.database.get('notes');
    const note = await notesCollection.find('iz4djgo0pnl8aeil');
    await note.updateNote('food', 'пицца тортом');
    await note.updateNote('note', 'тест 7');
  };

  const setCurrDiary = async () => {
    const notesCollection = props.database.get('diaries');
    const diary1 = await notesCollection.find('icmvg0pxfjsqqgeo');
    await diary1.changeIsCurrentDiary(false);

    const diary2 = await notesCollection.find('ll28tcvw1bqtblgk');
    await diary2.changeIsCurrentDiary(true);
  };
  const deleteNotes = async () => {
    const notesCollection = props.database.get('notes');
    const note = await notesCollection.find('1aikjbi74nn8dtas');
    await note.deleteNote();
  };

  return (
    <SafeAreaView>
      <Text>THIS IS DIARY!</Text>
      <TouchableOpacity onPress={newNote} style={styles.sign}>
        <Text>NEW NOTE</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={getAllNotes} style={styles.sign}>
        <Text>GET ALL NOTES</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={checkChanges} style={styles.sign}>
        <Text>CHECK CHANGES</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={sync} style={styles.sign}>
        <Text>SYNC</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={updateNote} style={styles.sign}>
        <Text>UPDATE</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={deleteNotes} style={styles.sign}>
        <Text>DELETE NOTES</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={setCurrDiary} style={styles.sign}>
        <Text>set curr diary</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={logOut} style={styles.sign}>
        <Text>LOGOUT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
});

type TProps = {
  route: RouteProp<TAuthPagesList, NavigationPages.Diary>
  database: any
  diaryId: string
  notes: any
  diary: any
}

//type InputProps = ObservableifyProps<TProps, "notes", "diary">
export const Diary = withDatabase(withObservables<TProps, {}>([], ({diaryId, database}) => ({
  notes: database.collections.get(NotesTableName).query().observe(),
  diary: database.collections.get(DiaryTableName).query(Q.where('is_current', true)).observe()
}))(_Diary));

const styles = StyleSheet.create({
  sign: {
    width: 150,
    height: 50,
    borderWidth: 1,
    backgroundColor: 'orange',
    marginTop: 10
  }
});
