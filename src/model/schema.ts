import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const NotesTableName = 'notes';
export const DiaryTableName = 'diaries';
export const ChaptersTableName = 'chapters';
export const PagesTableName = 'pages';

export const babyAppSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: DiaryTableName,
      columns: [
        {name: 'user_id', type: 'number'},
        {name: 'name', type: 'string'},
        {name: 'is_current', type: 'boolean'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ]
    }),
    tableSchema({
      name: ChaptersTableName,
      columns: [
        {name: 'diary_id', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'number', type: 'string'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ]
    }),
    tableSchema({
      name: PagesTableName,
      columns: [
        {name: 'diary_id', type: 'string'},
        {name: 'chapter_id', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'page_type', type: 'number'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ]
    }),
    tableSchema({
      name: NotesTableName,
      columns: [
        {name: 'page_id', type: 'string'},
        //{name: 'page_type', type: 'number'},
        {name: 'title', type: 'string'},
        {name: 'bookmarked', type: 'boolean'},
        {name: 'note', type: 'string'},
        {name: 'photo', type: 'string'},
        // {name: 'event_date_start', type: 'number'},
        // {name: 'event_date_end', type: 'number'},
        // {name: 'food', type: 'string'},
        // {name: 'volume', type: 'string'},
        // {name: 'temp', type: 'string'},
        {name: 'tags', type: 'string'},
        // {name: 'pressure', type: 'string'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ]
    }),
  ]
});
