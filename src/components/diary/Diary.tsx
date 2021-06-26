import React, {memo} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {NavigationPages} from '../../navigation/pages';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {TAuthPagesList} from '../../navigation/types';
import {signOut} from '../../redux/appSlice';
import withObservables from '@nozbe/with-observables';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import {checkUnsyncedChanges, syncDB} from '../../model/sync';
import {RootStoreType} from '../../redux/rootReducer';
import {NotesTableName} from '../../model/schema';

const _Diary = memo((props:TProps) => {
  const {t, i18n} = useTranslation();

  const {params} = props.route;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const token = useSelector(((state: RootStoreType) => state.app.userToken));

  const logOut = () => {
    dispatch(signOut());
  };

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
    const allPosts = await notesCollection.query().fetch();
    console.log('all posts', allPosts);
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
  const deleteNotes = async () => {
    const notesCollection = props.database.get('notes');
    const note = await notesCollection.find('1aikjbi74nn8dtas');
    await note.deleteNote();
  };
  console.log('rerender', props.notes);
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

      <TouchableOpacity onPress={logOut} style={styles.sign}>
        <Text>LOGOUT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
});

type TProps = {
  route: RouteProp<TAuthPagesList, NavigationPages.Diary>
  database: any
  notes: any
}
interface ObservableProps {
  notes: any
}
export const Diary = withDatabase(withObservables<TProps, ObservableProps>(['notes'], ({notes, database}) => ({
  notes: database.collections.get(NotesTableName).query().observe()
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
