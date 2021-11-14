// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {hasUnsyncedChanges, synchronize} from '@nozbe/watermelondb/sync';
import {Database} from '@nozbe/watermelondb';
import {req} from '../../common/assistant/api';
import {TToken} from '../../redux/types';
import {SyncPullResult} from '../types';
import {_changes, syncPullAdapter, syncPushAdapter} from '../assist';
import {ChaptersTableName, DiaryTableName, NotesTableName, PagesTableName, PhotosTableName} from '../schema';
import {deletePhotosFromS3_URI, downloadNewPhotosS3, uploadNewPhotosOnS3} from './s3Bucket';
import {Dispatch} from 'redux';
import {setLastSyncAt} from '../../redux/appSlice';
import {SyncActions} from "../../components/menu/IntegrationWithInternet/SyncWithServer";


export async function syncDB(
  database: Database,
  token: TToken | null,
  userId: number | null,
  deletedPhotos: string[],
  dispatch: Dispatch,
  isNewAccount: boolean,
  onProgress: (total: number, processed: number, action: SyncActions)=> void,
) {
  await synchronize({
    database,
    sendCreatedAsUpdated: true,
    pullChanges: async ({lastPulledAt, schemaVersion, migration}) => {
      try {
        console.log('pull');
        const syncRes = await req(token, dispatch).get<SyncPullResult & {diaryId: string}>('/sync', {params: {
          lastPulledAt: isNewAccount ? null : lastPulledAt,
          schemaVersion,
          migration: encodeURIComponent(JSON.stringify(migration)),
          userId
        }});

        const diaryId = syncRes.data?.diaryId;
        const diaryIds = await database.get(DiaryTableName).query().fetchIds();
        const adaptedChanges =  syncPullAdapter({changes: syncRes.data?.changes, timestamp: syncRes.data?.timestamp}, diaryIds, diaryId);

        if (_changes(syncRes, PhotosTableName)?.created?.length ||
          _changes(syncRes, PhotosTableName)?.updated?.length) {
          if (diaryId !== diaryIds[0])
            await database?.write(async () => {
              await database.get(PhotosTableName).query().destroyAllPermanently();
            });
        }
        const notesPhotoCreated = _changes(syncRes, NotesTableName)?.created || [];
        const notesPhotoUpdated = _changes(syncRes, NotesTableName)?.updated || [];
        //const notesPhotoDeleted = notes.data?.changes?.[NotesTableName]?.deleted || [];
        const photoByMonthCreated = _changes(syncRes, PhotosTableName)?.created || [];
        const photoByMonthUpdated = _changes(syncRes, PhotosTableName)?.updated || [];
        await deletePhotosFromS3_URI(deletedPhotos).catch(console.log);
        console.log('adaptedChanges', adaptedChanges);

        await downloadNewPhotosS3(
          [...notesPhotoCreated, ...notesPhotoUpdated, ...photoByMonthCreated, ...photoByMonthUpdated],
          onProgress
        );
        onProgress(1, 0, SyncActions.Other);
        //await deletePhotosFromS3([...notesPhotoDeleted], database).catch(console.log);
        return adaptedChanges;
      } catch (err) {
        console.error(err.response?.data || err.response || err);
        throw new Error('error pull sync');
      }
    },
    pushChanges: async ({changes, lastPulledAt}) => {
      try {
        console.log('push');
        const chapterChanges = syncPushAdapter({changes}, userId, ChaptersTableName);
        const pageChanges = syncPushAdapter({changes}, userId, PagesTableName);
        const noteChanges = syncPushAdapter({changes}, userId, NotesTableName);
        const photoChanges = syncPushAdapter({changes}, userId, PhotosTableName);

        const syncDTO = {
          changes: {
            ...chapterChanges,
            ...pageChanges,
            ...noteChanges,
            ...photoChanges,
          },
          lastPulledAt
        };

        const notesPhotoCreated = changes?.[NotesTableName]?.created || [];
        const notesPhotoUpdated = changes?.[NotesTableName]?.updated || [];
        const photoByMonthCreated = changes?.[PhotosTableName]?.created || [];
        const photoByMonthUpdated = changes?.[PhotosTableName]?.updated || [];
        await uploadNewPhotosOnS3(
          [...notesPhotoCreated, ...notesPhotoUpdated, ...photoByMonthCreated, ...photoByMonthUpdated],
          onProgress
        );

        await req(token, dispatch).post('/sync', syncDTO);
      } catch (err) {
        console.error(err.response?.data || err.response || err);
        throw new Error('error push sync');
      }
    },
    migrationsEnabledAtVersion: 1,
  });
  dispatch(setLastSyncAt(new Date().getTime()));
}

//todo сделать метод который будет раз в месяц получать все фотки из таблиц и сверять с кешэм, чтобы удалить ненужные из кэша
export async function checkUnsyncedChanges(database: Database) {
  return await hasUnsyncedChanges({
    database
  });
}
