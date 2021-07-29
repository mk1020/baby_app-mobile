import {IChapter, IDiary, INoteJS, IPage, IPhoto} from './types';
import {INoteJSEnhanced} from '../components/diary/assist';
import {ChaptersTableName, DiaryTableName, NotesTableName, PagesTableName, PhotosTableName} from './schema';


export const diaryAdapter = (diary: any): IDiary => ({
  id: diary.id,
  userId: diary?.userId,
  name: diary?.name,
  createdAt: diary?.createdAt,
  updatedAt: diary?.updatedAt
});
export const chapterAdapter = (chapter: any): IChapter => ({
  id: chapter.id,
  diaryId: chapter?.diaryId,
  number: chapter?.number,
  createdAt: chapter?.createdAt,
  updatedAt: chapter?.updatedAt
});
export const pageAdapter = (page: any): IPage => ({
  id: page.id,
  diaryId: page?.diaryId,
  chapterId: page?.chapterId,
  name: page?.name,
  createdAt: page?.createdAt,
  updatedAt: page?.updatedAt
});

export const noteAdapter = (note: any): INoteJSEnhanced => ({
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

export const photoAdapter = (photo: any): IPhoto => ({
  diaryId: photo.diaryId,
  id: photo.id,
  photo: photo.photo,
  date: photo.date,
  createdAt: photo.createdAt,
  updatedAt: photo.updatedAt
});

export const adapterByTableName = {
  [DiaryTableName]: diaryAdapter,
  [ChaptersTableName]: chapterAdapter,
  [PagesTableName]: pageAdapter,
  [NotesTableName]: noteAdapter,
  [PhotosTableName]: photoAdapter
}