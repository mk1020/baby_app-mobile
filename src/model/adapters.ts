import {IChapter, IDiary, INoteJS, IPage, IPhoto} from './types';
import {INoteJSEnhanced} from '../components/diary/assist';
import {ChaptersTableName, DiaryTableName, NotesTableName, PagesTableName, PhotosTableName} from './schema';

export const diaryAdapter = (diary: any) => ({
  id: diary.id,
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

export const noteAdapter = (note: any) => ({
  id: note?.id,
  diary_id: note?.diaryId,
  chapter_id: note?.chapterId,
  title: note?.title,
  bookmarked: note?.bookmarked,
  note: note?.note,
  photo: note?.photo,
  tags: note?.tags,
  page_id: note?.pageId,
  created_at: note?.createdAt,
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
}