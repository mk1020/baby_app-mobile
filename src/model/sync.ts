import {synchronize} from '@nozbe/watermelondb/sync';
import {Database, DirtyRaw, RecordId} from '@nozbe/watermelondb';
import {hasUnsyncedChanges} from '@nozbe/watermelondb/sync';
import {req} from '../common/assistant/api';
import {TToken} from '../redux/types';
import {INote} from './types';

type ChangesByEvents = {
  created: INote[],
  updated: INote[],
  deleted: string[],
}
type Changes = {
  // eslint-disable-next-line camelcase
  [table_name: string]: ChangesByEvents
}
type PullResponse = {
  changes: Changes,
  timestamp: number
}
export async function syncDB(database: Database, token: TToken, diaryId: number) {
  await synchronize({
    database,
    pullChanges: async ({lastPulledAt, schemaVersion, migration}) => {
      const res = await req(token).get<PullResponse>('/note/sync', {params: {
        lastPulledAt,
        schemaVersion,
        migration: encodeURIComponent(JSON.stringify(migration)),
        diaryId
      }})
        .catch(err => {
          console.error(err.response?.data || err.response || err);
          throw new Error('error pull sync');
        });
      console.log('resPull', res);
      console.log('lastPulledAt', lastPulledAt);
      const {changes, timestamp} = res.data;
      return {changes, timestamp};
    },
    pushChanges: async ({changes, lastPulledAt}) => {
      console.log('changes', changes);
      const res = await req(token).post('/note/sync', {changes, lastPulledAt})
        .catch(err => {
          console.error(err.response?.data || err.response || err);
          throw new Error('error push sync');
        });

      console.log('changes', changes);
      console.log('res', res);
    },
    //migrationsEnabledAtVersion: 1,
  });
}

export async function checkUnsyncedChanges(database: Database) {
  return await hasUnsyncedChanges({
    database
  });
}
