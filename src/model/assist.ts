import {ChangesByEvents, PullResponse} from './sync';
import {NotesTableName} from './schema';
import {INote} from './types';

enum ChangesEvents {
  created='created',
  updated = 'updated',
  deleted = 'deleted'
}
/* eslint-disable camelcase */
const noteAdapter = (note: INote) => {
  return {
    id: note.id,
    diary_id: Number(note.diary_id),
    created_at: new Date(note.created_at).getTime(),
    updated_at: new Date(note.updated_at).getTime(),
    note_type: note.note_type,
    date_event_start: note.date_event_start || null,
    date_event_end: note.date_event_end || null,
    photo: note.photo || null,
    food: note.food || null,
    volume: note.volume || null,
    note: note.note || null,
    duration: note.duration || null,
    milk_volume_left: note.milk_volume_left || null,
    milk_volume_right: note.milk_volume_right || null,
    type: note.type || null,
    achievement: note.achievement || null,
    weight: note.weight || null,
    growth: note.growth || null,
    head_circle: note.head_circle || null,
    temp: note.temp || null,
    tags: note.tags || null,
    pressure: note.pressure || null
  };
};
type AdapterRes = {
  changes: {
    [NotesTableName]: {
      created: [],
      updated: INote[],
      deleted: string[],
    }
  },
  timestamp: number
}
export const pulledNotesAdapter = (res: PullResponse): AdapterRes => {
  const created = res?.changes?.[NotesTableName]?.[ChangesEvents.created];
  const updated = res?.changes?.[NotesTableName]?.[ChangesEvents.updated];
  const deleted = res?.changes?.[NotesTableName]?.[ChangesEvents.deleted] || [];

  let updatedNew: any = [];
  if (created && updated) {
    updatedNew = [...created, ...updated].map(note => noteAdapter(note));
  }

  if (!res.timestamp) {
    throw new Error('TIMESTAMP WAS NOT PASSED');
  }
  return {
    changes: {
      [NotesTableName]: {
        created: [],
        updated: updatedNew,
        deleted
      }
    },
    timestamp: new Date(res.timestamp).getTime()
  };
};