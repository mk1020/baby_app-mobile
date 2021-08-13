import React, {memo, useEffect, useRef, useState} from 'react';
import {PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables, {ObservableifyProps} from '@nozbe/with-observables';
import {Database, Q} from '@nozbe/watermelondb';
import {signOut} from '../../redux/appSlice';
import {ChaptersTableName, DiaryTableName, NotesTableName, PagesTableName, PhotosTableName} from '../../model/schema';
import {getNotesByPageDB} from '../../model/assist';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {PhotosByMonth} from '../diary/contentTab/photosByMonth/PhotosByMonth';
import {MediaUploader} from '../../common/drive/uploadGoogle';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {googleOAuthClientId} from '../../common/consts';
import * as RNFS from 'react-native-fs';
import {req} from '../../common/assistant/api';
import axios from 'axios';
import {CachesDirectoryPath, DocumentDirectoryPath, DownloadDirectoryPath, readdir, readFile} from 'react-native-fs';
import {LoadType, uploadGoogle} from '../../common/drive/uploadGoogle2';

type TProps = {
  database?: Database
  diaryId: string
  chapters?: any[]
  pages?: any[]
}
export const Service_ = memo((props: TProps) => {
  const {diaryId, database, chapters, pages} = props;
  const dispatch = useDispatch();
  const db = useDatabase();

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

  const resetDB = async () => {
    await database?.write(async () => {
      await database?.unsafeResetDatabase();
    });
  };

  const a = async () => {
    const diaryCollection = database?.get(PagesTableName);
    const allPosts = await diaryCollection?.query().fetch();
    console.log(allPosts);
  };


  const upload = async () => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive'],
      webClientId: googleOAuthClientId,
      // iosClientId
    });
    await GoogleSignin.signIn();
    const userInfo = await GoogleSignin.getTokens();
    // console.log(userInfo);
    //readdir(DownloadDirectoryPath).then(console.log);
    uploadGoogle(
      'file:///data/user/0/com.rntempl/cache/rn_image_picker_lib_temp_2dde22f5-5e42-4ae0-8034-0fe1b715c4c7.jpg',
      userInfo.accessToken,
      LoadType.Create,
      (loadedMB, totalMB) => console.log(`loaded - ${loadedMB}, total - ${totalMB}`)
    ).then(e => {
      console.log(e);
    }).catch(e => {
      console.log('catch', e);
    });


    // const response = await fetch('file:///data/user/0/com.rntempl/cache/rn_image_picker_lib_temp_2dde22f5-5e42-4ae0-8034-0fe1b715c4c7.jpg');
    // const blob = await response.blob();
    // // @ts-ignore
    // const up = new MediaUploader({
    //   token: userInfo.accessToken,
    //   //contentType: 'application/vnd.google-apps.image',
    //   file: blob,
    //   chunkSize: 262144,
    //   metadata: {
    //     name: 'rn_image_picker_lib_temp_2dde22f5-5e42-4ae0-8034-0fe1b715c4c7.jpg'
    //   },
    //   //title: 'recovery',
    //   onComplete(data) { console.log('compl', data); },
    //   onError(data) { console.log('err', data); },
    //   onProgress(progress: ProgressEvent) { console.log(progress.loaded); }
    // });
    // up.upload();


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

      <TouchableOpacity onPress={async () => console.log(await db.get(NotesTableName).query().fetch())} style={styles.sign}>
        <Text>GET notes </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={async () => console.log(await db.get(PagesTableName).query().fetch())} style={styles.sign}>
        <Text>GET pages</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={async () => console.log(await db.get(ChaptersTableName).query().fetch())} style={styles.sign}>
        <Text>GET chapters</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={async () => console.log(await db.get(PhotosTableName).query().fetch())} style={styles.sign}>
        <Text>GET photos</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={async () => console.log(await db.get(DiaryTableName).query().fetch())} style={styles.sign}>
        <Text>GET diaries</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={upload} style={styles.sign}>
        <Text>upload</Text>
      </TouchableOpacity>
    </View>
  );
});

//type InputProps = ObservableifyProps<TProps, 'diaryId'>
export const Service = withDatabase(withObservables(['diaryId'], ({database, diaryId}: TProps) => {
  return {
    chapters: database?.collections?.get(ChaptersTableName).query().observe(),
    pages: database?.collections?.get(PagesTableName).query().observe()
    //pages: database?.collections?.get(PagesTableName)?.query(Q.where('id', diaryId))?.observe()
  };
})(Service_));
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
