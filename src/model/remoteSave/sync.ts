// @ts-ignore
import {hasUnsyncedChanges, synchronize} from '@nozbe/watermelondb/sync';
import {Database} from '@nozbe/watermelondb';
import {req} from '../../common/assistant/api';
import {TToken} from '../../redux/types';
import {SyncPullResult} from '../types';
import {ChangesEvents, deleteImagesFromCache, syncPullAdapter, syncPushAdapter} from '../assist';
import {ChaptersTableName, DiaryTableName, NotesTableName, PagesTableName, PhotosTableName} from '../schema';
import {database} from '../../AppContainer';


export async function syncDB(database: Database, token: TToken | null, userId: number | null, deletedPhotos: string[]) {
  await synchronize({
    database,
    sendCreatedAsUpdated: true,
    pullChanges: async ({lastPulledAt, schemaVersion, migration}) => {
      try {
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
        const diaryId = notes.data?.diaryId;
        const diaryIds = await database.get(DiaryTableName).query().fetchIds();
        const adaptedChanges =  syncPullAdapter({changes: syncChanges, timestamp: notes.data?.timestamp}, diaryIds, diaryId);

        if (photosByMonth.data?.changes?.[PhotosTableName]?.[ChangesEvents.created]?.length ||
          photosByMonth.data?.changes?.[PhotosTableName]?.[ChangesEvents.updated]?.length) {
          await database?.write(async () => {
            await database.get(PhotosTableName).query().destroyAllPermanently();
          });
        }
        //deleteImagesFromCache();
        console.log(syncChanges);
        return adaptedChanges;
      } catch (err) {
        console.error(err.response?.data || err.response || err);
        throw new Error('error pull sync');
      }
    },
    pushChanges: async ({changes, lastPulledAt}) => {
      try {
        const chapterDTO = syncPushAdapter({changes, lastPulledAt}, userId, ChaptersTableName);
        await req(token).post('/chapters/sync', chapterDTO);

        const pageDTO = syncPushAdapter({changes, lastPulledAt}, userId, PagesTableName);
        await req(token).post('/pages/sync', pageDTO);

        const noteDTO = syncPushAdapter({changes, lastPulledAt}, userId, NotesTableName);
        await req(token).post('/notes/sync', noteDTO);

        const photoDTO = syncPushAdapter({changes, lastPulledAt}, userId, PhotosTableName);
        await req(token).post('/photos-by-month/sync', photoDTO);

        console.log('photoDTO', photoDTO);
        await req(token).delete('/photos', {data: {deletedPhotos}});
      } catch (err) {
        console.error(err.response?.data || err.response || err);
        throw new Error('error push sync');
      }
    },
    migrationsEnabledAtVersion: 1,
  });
}

//todo сделать метод который будет раз в месяц получать все фотки из таблиц и сверять с кешэм, чтобы удалить ненужные из кэша
export async function checkUnsyncedChanges(database: Database) {
  return await hasUnsyncedChanges({
    database
  });
}
