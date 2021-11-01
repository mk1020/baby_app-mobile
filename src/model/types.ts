import {EnhancedToServerBD} from './adapters';

export type TNoteType = 1|2|3|4|5|6|7|8|9|10|11|12;
/* eslint-disable camelcase */
export interface INote {
  id: string,
  page_id: string,
  diary_id: string,
  chapter_id: string | null,
  bookmarked: boolean
  title: string
  note: string,
  photo: string | null,
  tags: string | null,
  created_at: number,
  updated_at: number,
}

export interface INoteJS {
  id: string,
  pageId: string,
  diaryId: string,
  chapterId: string | null,
  title: string
  bookmarked: boolean
  note: string,
  photo: string | null,
  tags: string | null,
  createdAt: number,
  updatedAt: number,
}


export interface IDiary {
  id: string
  userId: number
  name: string | null
  createdAt: number
  updatedAt: number
}
export interface IChapterJS {
  id: string
  userId: number
  diaryId: string
  name: string
  number: string
  createdAt: number
  updatedAt: number
}
export interface IChapter {
  id: string
  name: string
  diary_id: string
  number: string
  created_at: number
  updated_at: number
}
export interface IPage {
  id: string
  diary_id: string
  chapter_id: string | null
  name: string
  created_at: number
  updated_at: number
}
export interface IPageJS {
  id: string
  diaryId: string
  chapterId: string | null
  name: string
  createdAt: number
  updatedAt: number
}
export type TTables = 'diaries' | 'notes' | 'chapters' | 'pages' | 'photos_by_month'
export type SyncTables = 'notes' | 'chapters' | 'pages' | 'photos_by_month'

export type ChangesByEventsPull = {
  created: any[],
  updated: any[],
  deleted: string[],
}
type ChangesPull = {
  // eslint-disable-next-line camelcase
  [table_name: string]: ChangesByEventsPull
}
export type SyncPullResult = {
  changes: ChangesPull,
  timestamp: number
}

export type ChangesByEventsPush = {
  created: any[],
  updated: any[],
  deleted: string[],
}
type ChangesPush = {
  // eslint-disable-next-line camelcase
  [table_name: string]: ChangesByEventsPush
}
export type SyncPushResult = {
  changes: ChangesPush,
  lastPulledAt: number
}

export interface IPhoto {
  id: string
  diaryId: string
  photo: string | null
  date: number
  createdAt: number
  updatedAt: number
}
export interface IPhotoDB {
  id: string
  user_id: number
  diary_id: string
  photo: string | null
  date: number
  created_at: number
  updated_at: number
}