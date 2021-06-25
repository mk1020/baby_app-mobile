import {appSchema, tableSchema} from '@nozbe/watermelondb';

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
      name: 'notes',
      columns: [
        {name: 'diary_id', type: 'number'},
        {name: 'note_type', type: 'number'},
        {name: 'photo', type: 'string'},
        {name: 'food', type: 'string'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ]
    }),
  ]
});
