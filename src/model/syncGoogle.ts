// @ts-ignore
import {hasUnsyncedChanges, synchronize} from '@nozbe/watermelondb/sync';
import {Database} from '@nozbe/watermelondb';
import {req} from '../common/assistant/api';
import {TToken} from '../redux/types';
import {SyncPullResult} from './types';
import {syncPullAdapter, syncPushAdapter} from './assist';
import {ChaptersTableName, DiaryTableName, NotesTableName, PagesTableName, PhotosTableName} from './schema';
import {DriveGoogle} from '../common/drive/google/DriveGoogle';

// просто загрузить все на гугл диск, кроме того, что там есть
export async function syncDB(database: Database, token: TToken | null, userId: number | null) {
  await synchronize({
    database,
    sendCreatedAsUpdated: true,
    pullChanges: async ({lastPulledAt}) => {
      try {
        if (!lastPulledAt) {
          DriveGoogle.
        }
        return syncPullAdapter({changes: syncChanges, timestamp: notes.data?.timestamp}, diaryIds, diaryId);

      } catch (err) {
        console.error(err.response?.data || err.response || err);
        throw new Error('error pull sync');
      }
    },
    pushChanges: async ({changes, lastPulledAt}) => {
      try {

      } catch (err) {
        console.error(err.response?.data || err.response || err);
        throw new Error('error push sync');
      }
    },
    migrationsEnabledAtVersion: 1,
  });
}

export async function checkUnsyncedChanges(database: Database) {
  return await hasUnsyncedChanges({
    database
  });
}
