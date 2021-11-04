// @ts-ignore
import {hasUnsyncedChanges, synchronize} from '@nozbe/watermelondb/sync';
import {Database} from '@nozbe/watermelondb';
import {req} from '../../common/assistant/api';
import {TToken} from '../../redux/types';
import {SyncPullResult} from '../types';
import {ChangesEvents, syncPullAdapter, syncPushAdapter} from '../assist';
import {ChaptersTableName, DiaryTableName, NotesTableName, PagesTableName, PhotosTableName} from '../schema';
import {deletePhotosFromS3_URI, downloadNewPhotosS3, uploadNewPhotosOnS3} from './s3Bucket';
import {SyncActions} from '../../components/menu/ModalSaveData';


export async function syncDB(
  database: Database,
  token: TToken | null,
  userId: number | null,
  deletedPhotos: string[],
  onProgress: (total: number, processed: number, action: SyncActions)=> void
) {
  await synchronize({
    database,
    sendCreatedAsUpdated: true,
    pullChanges: async ({lastPulledAt, schemaVersion, migration}) => {
      try {
        console.log('pull');
        const chapters = await req(token).get<SyncPullResult>('/chapters/sync', {params: {
          lastPulledAt,
          schemaVersion,
          migration: encodeURIComponent(JSON.stringify(migration)),
          userId
        }});
        const pages = await req(token).get<SyncPullResult>('/pages/sync', {params: {
          lastPulledAt,
          schemaVersion,
          migration: encodeURIComponent(JSON.stringify(migration)),
          userId
        }});
        const notes = await req(token).get<SyncPullResult & {diaryId: string}>('/notes/sync', {params: {
          lastPulledAt,
          schemaVersion,
          migration: encodeURIComponent(JSON.stringify(migration)),
          userId
        }});

        const photosByMonth = await req(token).get<SyncPullResult & {diaryId: string}>('/photos-by-month/sync', {params: {
          lastPulledAt,
          schemaVersion,
          migration: encodeURIComponent(JSON.stringify(migration)),
          userId
        }});
        const syncChanges = {
          ...chapters.data?.changes,
          ...pages.data?.changes,
          ...notes.data?.changes,
          ...photosByMonth.data?.changes,
        };
        syncChanges[PhotosTableName].deleted = [];
        const diaryId = notes.data?.diaryId;
        const diaryIds = await database.get(DiaryTableName).query().fetchIds();
        const adaptedChanges =  syncPullAdapter({changes: syncChanges, timestamp: notes.data?.timestamp}, diaryIds, diaryId);

        if (photosByMonth.data?.changes?.[PhotosTableName]?.[ChangesEvents.created]?.length ||
          photosByMonth.data?.changes?.[PhotosTableName]?.[ChangesEvents.updated]?.length) {
          if (diaryId !== diaryIds[0])
            await database?.write(async () => {
              await database.get(PhotosTableName).query().destroyAllPermanently();
            });
        }
        const notesPhotoCreated = notes.data?.changes?.[NotesTableName]?.created || [];
        const notesPhotoUpdated = notes.data?.changes?.[NotesTableName]?.updated || [];
        //const notesPhotoDeleted = notes.data?.changes?.[NotesTableName]?.deleted || [];
        const photoByMonthCreated = photosByMonth.data?.changes?.[PhotosTableName]?.created || [];
        const photoByMonthUpdated = photosByMonth.data?.changes?.[PhotosTableName]?.updated || [];
        console.log('photoByMonthCreated', photoByMonthCreated);
        console.log('photoByMonthUpdated', photoByMonthUpdated);
        await deletePhotosFromS3_URI(deletedPhotos).catch(console.log);
        console.log('adaptedChanges', adaptedChanges);

        await downloadNewPhotosS3(
          [...notesPhotoCreated, ...notesPhotoUpdated, ...photoByMonthCreated, ...photoByMonthUpdated],
          onProgress
        ).catch(console.log);
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
        const chapterDTO = syncPushAdapter({changes, lastPulledAt}, userId, ChaptersTableName);
        await req(token).post('/chapters/sync', chapterDTO);

        const pageDTO = syncPushAdapter({changes, lastPulledAt}, userId, PagesTableName);
        await req(token).post('/pages/sync', pageDTO);

        const noteDTO = syncPushAdapter({changes, lastPulledAt}, userId, NotesTableName);
        await req(token).post('/notes/sync', noteDTO);

        const photoDTO = syncPushAdapter({changes, lastPulledAt}, userId, PhotosTableName);
        await req(token).post('/photos-by-month/sync', photoDTO);

        //await req(token).delete('/photos', {data: {deletedPhotos}});

        const notesPhotoCreated = changes?.[NotesTableName]?.created || [];
        const notesPhotoUpdated = changes?.[NotesTableName]?.updated || [];
        const photoByMonthCreated = changes?.[PhotosTableName]?.created || [];
        const photoByMonthUpdated = changes?.[PhotosTableName]?.updated || [];
        await uploadNewPhotosOnS3(
          [...notesPhotoCreated, ...notesPhotoUpdated, ...photoByMonthCreated, ...photoByMonthUpdated],
          onProgress)
          .catch(console.log);

      } catch (err) {
        console.error(err.response?.data || err.response || err);
        throw new Error('error push sync');
      }
    },
    migrationsEnabledAtVersion: 1,
  });

  /* await synchronize({
    database,
    sendCreatedAsUpdated: true,
    pullChanges: async () => {
      return
    },
    pushChanges: async () => {
    }
  });*/
}

//todo сделать метод который будет раз в месяц получать все фотки из таблиц и сверять с кешэм, чтобы удалить ненужные из кэша
export async function checkUnsyncedChanges(database: Database) {
  return await hasUnsyncedChanges({
    database
  });
}
