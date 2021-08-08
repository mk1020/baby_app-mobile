import {synchronize} from '@nozbe/watermelondb/sync';
import {Database} from '@nozbe/watermelondb';
import {req} from '../common/assistant/api';
import {TToken} from '../redux/types';
import {SyncPullResult} from './types';
import {syncPullAdapter, syncPushAdapter} from './assist';
import {ChaptersTableName, DiaryTableName, NotesTableName, PagesTableName} from './schema';


export async function recoverFromServer(database: Database, token: TToken | null, userId: number | null) {
  await synchronize({
    database,
    sendCreatedAsUpdated: true,
    pullChanges: async ({lastPulledAt, schemaVersion, migration}) => {
      try {
        const chapters = await req(token).get<SyncPullResult>('/chapters/sync', {params: {
          lastPulledAt: null,
          schemaVersion,
          migration: encodeURIComponent(JSON.stringify(migration)),
          userId
        }});
        const pages = await req(token).get<SyncPullResult>('/pages/sync', {params: {
          lastPulledAt: null,
          schemaVersion,
          migration: encodeURIComponent(JSON.stringify(migration)),
          userId
        }});
        const notes = await req(token).get<SyncPullResult & {diaryId: string}>('/notes/sync', {params: {
          lastPulledAt: null,
          schemaVersion,
          migration: encodeURIComponent(JSON.stringify(migration)),
          userId
        }});

        const syncChanges = {
          ...chapters.data?.changes,
          ...pages.data?.changes,
          ...notes.data?.changes,
        };
        const diaryId = notes.data?.diaryId;
        const diaryIds = await database.get(DiaryTableName).query().fetchIds();
        return syncPullAdapter({changes: syncChanges, timestamp: notes.data?.timestamp}, diaryIds, diaryId);

      } catch (err) {
        console.error(err.response?.data || err.response || err);
        throw new Error('error pull sync');
      }
    },
    pushChanges: async () => {
      return Promise.resolve();
    },
    migrationsEnabledAtVersion: 1,
  });
}
