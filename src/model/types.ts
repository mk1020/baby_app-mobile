export type TNoteType = 1|2|3|4|5|6|7|8|9|10|11|12;
/* eslint-disable camelcase */
export interface INote {
  id: string,
  page_id: string,
  diary_id: string,
  //page_type: number,
  title: string
  note: string,
  photo: string,
  //food: string,
  //volume: string,
  //temp: number,
  tags: string,
 // pressure: string,
  created_at: number,
  updated_at: number,
  //event_date_start: number,
  //event_date_end: number,
}

export interface INoteJS {
  id: string,
  pageId: string,
  diaryId: string,
  //pageType: number,
  title: string
  bookmarked: boolean
  note: string,
  photo: string,
  //food: string,
  //volume: string,
  //temp: number,
  tags: string,
  //pressure: string,
  createdAt: number,
  updatedAt: number,
  //eventDateStart: number,
  //eventDateEnd: number,
}

export interface IPhoto {
  id: string
  diaryId: string
  photo: string | null
  date: number
  createdAt: number
  updatedAt: number
}
