import {synchronize} from '@nozbe/watermelondb/sync';
import {Database, DirtyRaw, RecordId} from '@nozbe/watermelondb';
// @ts-ignore
import {hasUnsyncedChanges} from '@nozbe/watermelondb/sync';
import {req} from '../common/assistant/api';
import {TToken} from '../redux/types';
import {INote} from './types';
import {pulledNotesAdapter} from './assist';

export type ChangesByEvents = {
  created: INote[],
  updated: INote[],
  deleted: string[],
}
type Changes = {
  // eslint-disable-next-line camelcase
  [table_name: string]: ChangesByEvents
}
export type PullResponse = {
  changes: Changes,
  timestamp: number
}
export async function syncDB(database: Database, token: TToken, diaryId: number) {
  await synchronize({
    database,
    sendCreatedAsUpdated: true,
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
      return pulledNotesAdapter(res.data);
    },
    pushChanges: async ({changes, lastPulledAt}) => {
      const res = await req(token).post('/note/sync', {changes, lastPulledAt})
        .catch(err => {
          console.error(err.response?.data || err.response || err);
          throw new Error('error push sync');
        });
    },
    migrationsEnabledAtVersion: 1,
  });
}

export async function checkUnsyncedChanges(database: Database) {
  return await hasUnsyncedChanges({
    database
  });
}
