import {IChapter, IDiary, INote, INoteJS, IPage, IPhoto, IPhotoDB} from './types';
import {INoteJSEnhanced} from '../components/diary/assist';
import {ChaptersTableName, DiaryTableName, NotesTableName, PagesTableName, PhotosTableName} from './schema';

export interface EnhancedToServerBD {
  user_id: number
}
export const diaryAdapter = (diary: any) => ({
  id: diary.id,
  is_current: diary.isCurrent,
  user_id: diary?.userId,
  name: diary?.name,
  created_at: diary?.createdAt,
  updated_at: diary?.updatedAt
});
export const chapterAdapter = (chapter: any) => ({
  id: chapter.id,
  diary_id: chapter?.diaryId,
  name: chapter?.name,
  number: chapter?.number,
  created_at: chapter?.createdAt,
  updated_at: chapter?.updatedAt
});
export const pageAdapter = (page: any) => ({
  id: page.id,
  diary_id: page?.diaryId,
  chapter_id: page?.chapterId,
  name: page?.name,
  created_at: page?.createdAt,
  updated_at: page?.updatedAt
});

export const noteAdapterJs = (note: any): INoteJSEnhanced => ({
  id: note?.id,
  diaryId: note?.diaryId,
  chapterId: note?.chapterId,
  title: note?.title,
  bookmarked: note?.bookmarked,
  note: note?.note,
  photo: note?.photo,
  imagesUri: note?.photo ? note?.photo?.split(';') : [],
  tags: note?.tags,
  pageId: note?.pageId,
  createdAt: note?.createdAt,
  updatedAt: note?.updatedAt,
});

export const noteAdapter = (note: INoteJS) => ({
  id: note?.id,
  diary_id: note?.diaryId,
  chapter_id: note?.chapterId,
  title: note?.title,
  bookmarked: note?.bookmarked,
  note: note?.note,
  photo: note?.photo,
  tags: note?.tags,
  page_id: note?.pageId,
  created_at: note.createdAt,
  updated_at: note?.updatedAt,
});

export const photoAdapterJs = (photo: any): IPhoto => ({
  diaryId: photo.diaryId,
  id: photo.id,
  photo: photo.photo,
  date: photo.date,
  createdAt: photo.createdAt,
  updatedAt: photo.updatedAt
});
export const photoAdapter = (photo: any) => ({
  diary_id: photo.diaryId,
  id: photo.id,
  photo: photo.photo,
  date: photo.date,
  created_at: photo.createdAt,
  updated_at: photo.updatedAt
});

export const adapterByTableName = {
  [DiaryTableName]: diaryAdapter,
  [ChaptersTableName]: chapterAdapter,
  [PagesTableName]: pageAdapter,
  [NotesTableName]: noteAdapter,
  [PhotosTableName]: photoAdapter
};


export const syncNoteAdapter = (note: INote & EnhancedToServerBD) => ({
  id: note?.id,
  diary_id: note?.diary_id,
  chapter_id: note?.chapter_id,
  title: note?.title,
  bookmarked: note?.bookmarked,
  note: note?.note,
  photo: note?.photo,
  tags: note?.tags,
  page_id: note?.page_id,
  created_at: new Date(note.created_at).getTime(),
  updated_at: new Date(note.updated_at).getTime(),
});

export const syncChapterAdapter = (chapter: IChapter & EnhancedToServerBD) => ({
  id: chapter.id,
  diary_id: chapter?.diary_id,
  name: chapter?.name,
  number: chapter?.number,
  created_at: new Date(chapter.created_at).getTime(),
  updated_at: new Date(chapter.updated_at).getTime(),
});

export const syncPageAdapter = (page: IPage & EnhancedToServerBD) => ({
  id: page.id,
  diary_id: page?.diary_id,
  chapter_id: page?.chapter_id,
  name: page?.name,
  created_at: new Date(page.created_at).getTime(),
  updated_at: new Date(page.updated_at).getTime(),
});

export const syncPhotoAdapter = (photo: IPhotoDB & EnhancedToServerBD) => ({
  id: photo.id,
  diary_id: photo?.diary_id,
  photo: photo?.photo,
  date: photo?.date,
  created_at: new Date(photo.created_at).getTime(),
  updated_at: new Date(photo.updated_at).getTime(),
});

export const adapterSyncByTableName = {
  [ChaptersTableName]: syncChapterAdapter,
  [PagesTableName]: syncPageAdapter,
  [NotesTableName]: syncNoteAdapter,
  [PhotosTableName]: syncPhotoAdapter,
};
