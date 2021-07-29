export type TNoteType = 1|2|3|4|5|6|7|8|9|10|11|12;
/* eslint-disable camelcase */
export interface INote {
  id: string,
  page_id: string,
  diary_id: string,
  chapter_id: string,
  bookmarked: boolean
  title: string
  note: string,
  photo: string,
  tags: string,
  created_at: number,
  updated_at: number,
}

export interface INoteJS {
  id: string,
  pageId: string,
  diaryId: string,
  chapterId: string,
  title: string
  bookmarked: boolean
  note: string,
  photo: string,
  tags: string,
  createdAt: number,
  updatedAt: number,
}

export interface IPhoto {
  id: string
  diaryId: string
  photo: string | null
  date: number
  createdAt: number
  updatedAt: number
}
export interface IDiary {
  id: string
  userId: number
  name: string | null
  createdAt: number
  updatedAt: number
}

export interface IChapter {
  id: string
  diaryId: string
  number: string
  createdAt: number
  updatedAt: number
}
export interface IPage {
  id: string
  diaryId: string
  chapterId: string
  name: string
  createdAt: number
  updatedAt: number
}

export type TTables = 'diaries' | 'notes' | 'chapters' | 'pages' | 'photos_by_month'
