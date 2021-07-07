import React, {memo} from 'react';
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
import {ColorsByTheme} from '../../common/colorsByTheme';
import {Header} from './Header';

type TProps = {
  route: RouteProp<TAuthPagesList, NavigationPages.Diary>
  database: any
  diaryId: string
  notes: any
  diary: any
}

const Diary_ = memo((props:TProps) => {
  const {t, i18n} = useTranslation();

  const {notes, diary, database} = props;
  const {params} = props.route;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const token = useSelector(((state: RootStoreType) => state.app.userToken));
  const theme = useSelector(((state: RootStoreType) => state.app.colorScheme));

  return (
    <SafeAreaView>
      <Header title={diary.length ? diary[0].name : ''}/>
    </SafeAreaView>
  );
});

//type InputProps = ObservableifyProps<TProps, "notes", "diary">
export const Diary = withDatabase(withObservables<TProps, {}>([], ({diaryId, database}) => ({
  notes: database.collections.get(NotesTableName).query().observe(),
  diary: database.collections.get(DiaryTableName).query(Q.where('is_current', true)).observe()
}))(Diary_));

const styles = StyleSheet.create({
  sign: {
    width: 150,
    height: 50,
    borderWidth: 1,
    backgroundColor: 'orange',
    marginTop: 10
  }
});
