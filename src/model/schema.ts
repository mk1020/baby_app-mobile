import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const NotesTableName = 'notes';
export const babyAppSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'diaries',
      columns: [
        {name: 'owner', type: 'number'},
        {name: 'user_id', type: 'number'},
        {name: 'name', type: 'string'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ]
    }),
    tableSchema({
      name: NotesTableName,
      columns: [
        {name: 'diary_id', type: 'number'},
        {name: 'note_type', type: 'number'},
        {name: 'photo', type: 'string', isOptional: true},
        {name: 'food', type: 'string', isOptional: true},
        {name: 'volume', type: 'string', isOptional: true},
        {name: 'note', type: 'string', isOptional: true},
        {name: 'duration', type: 'string', isOptional: true},
        {name: 'milk_volume_left', type: 'string', isOptional: true},
        {name: 'milk_volume_right', type: 'string', isOptional: true},
        {name: 'type', type: 'string', isOptional: true},
        {name: 'achievement', type: 'string', isOptional: true},
        {name: 'weight', type: 'string', isOptional: true},
        {name: 'growth', type: 'string', isOptional: true},
        {name: 'head_circle', type: 'string', isOptional: true},
        {name: 'temp', type: 'string', isOptional: true},
        {name: 'tags', type: 'string', isOptional: true},
        {name: 'pressure', type: 'string', isOptional: true},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ]
    }),
  ]
});
