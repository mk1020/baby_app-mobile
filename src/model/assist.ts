import {ChaptersTableName, DiaryTableName, NotesTableName, PagesTableName, PhotosTableName} from './schema';
import {INoteJS, IPhoto, SyncPullResult, SyncPushResult, SyncTables} from './types';
import {IFormCretePage} from '../components/diary/AddPageModal';
import {Database, Q} from '@nozbe/watermelondb';
import {romanize} from '../components/diary/assist';
import {NoteRelations} from '../navigation/types';
import {adapterSyncByTableName, EnhancedToServerBD, photoAdapterJs} from './adapters';
import * as RNFS from 'react-native-fs';
import {TemporaryDirectoryPath} from 'react-native-fs';
import {getFileName} from '../common/assistant/files';

export enum ChangesEvents {
  created = 'created',
  updated = 'updated',
  deleted = 'deleted'
}

type SyncPullAdapterRes = {
  changes: {
    [name: string]: {
      created: [],
      updated: any[],
      deleted: string[],
    }
  },
  timestamp: number
}
const syncTables = [ChaptersTableName, PagesTableName, NotesTableName, PhotosTableName];
export const syncPullAdapter = (res: SyncPullResult, deleteDiaryIds: string[], diaryIdServer: string): SyncPullAdapterRes => {
  let changes: SyncPullAdapterRes | Record<string, any> = {};

  syncTables.forEach(table => {
    let updatedNew: any[] = [];

    const created = res?.changes?.[table]?.[ChangesEvents.created];
    const updated = res?.changes?.[table]?.[ChangesEvents.updated];
    const deleted = res?.changes?.[table]?.[ChangesEvents.deleted] || [];

    if (created && updated) {
      updatedNew = [...updatedNew, ...created, ...updated].map(item => adapterSyncByTableName[table as SyncTables](item));
    }
    console.log('updatedNew', updatedNew);
    changes = {
      ...changes,
      [table]: {
        created: [],
        updated: updatedNew,
        deleted
      }
    };
  });
  if (deleteDiaryIds?.length && diaryIdServer && deleteDiaryIds[0] !== diaryIdServer) {
    changes = {
      [DiaryTableName]: {
        created: [],
        updated: [{
          id: diaryIdServer,
          name: null,
          user_id: null,
          is_current: true,
          created_at: new Date().getTime(),
          updated_at: new Date().getTime(),
        }],
        deleted: deleteDiaryIds
      },
      ...changes,
    };
  }
  if (!res.timestamp) {
    throw new Error('TIMESTAMP WAS NOT PASSED');
  }
  return {
    changes,
    timestamp: new Date(res.timestamp).getTime()
  };
};

type SyncPushAdapterRes = {
  changes: {
    [name: string]: {
      created: (Required<EnhancedToServerBD> & Record<string, unknown>)[],
      updated: (Required<EnhancedToServerBD> & Record<string, unknown>)[],
      deleted: string[],
    }
  },
  lastPulledAt: number
}
export const syncPushAdapter = (res: SyncPushResult, userId: number | null, table: SyncTables): SyncPushAdapterRes => {
  const created = res?.changes?.[table]?.[ChangesEvents.created];
  const updated = res?.changes?.[table]?.[ChangesEvents.updated];
  const deleted = res?.changes?.[table]?.[ChangesEvents.deleted] || [];

  const createdNew = created?.map(item => ({...item, user_id: userId}));
  const updatedNew = updated?.map(item => ({...item, user_id: userId}));

  return {
    changes: {
      [table]: {
        created: createdNew,
        updated: updatedNew,
        deleted
      }
    },
    lastPulledAt: res.lastPulledAt
  };
};

export const createPageAndChapter = async  (database: Database, data: IFormCretePage, diaryId: string, chapterNumber: number) => {
  await database.write(async () => {
    const chapters = database?.get(ChaptersTableName);
    const pages = database?.get(PagesTableName);

    const prepareCreateChapter = chapters.prepareCreate((page: any) => {
      page.diaryId = diaryId;
      page.name = data.newChapter;
      page.number = romanize(chapterNumber);
    });

    const prepareCreatePage = pages.prepareCreate((page: any) => {
      page.diaryId = diaryId;
      page.name = data.pageName;
      page.chapterId = prepareCreateChapter.id;
    });
    await database.batch(
      prepareCreateChapter,
      prepareCreatePage
    );
  });
};

export const createPage = async  (database: Database, data: IFormCretePage, diaryId: string, chapterId?: string | null) => {
  await database.write(async () => {
    const pages = database?.get(PagesTableName);
    await pages.create((page: any) => {
      page.diaryId = diaryId;
      page.name = data.pageName;
      page.chapterId = chapterId || null;
    });
  });
};

export const createNoteDB = async (db: Database, data: Partial<INoteJS>, relations: NoteRelations) => {
  await db.write(async () => {
    const notes = db?.get(NotesTableName);
    await notes.create((note: any) => {
      note.diaryId = relations?.diaryId;
      note.chapterId = relations?.chapterId || null;
      note.pageId = relations?.pageId;
      note.title = data?.title;
      note.bookmarked = data?.bookmarked;
      note.note = data?.note;
      note.photo = data?.photo;
    });
  });
};

export const updateNoteDB = async (db: Database, data?: Partial<INoteJS>) => {
  await db.write(async () => {
    const notes = db?.get(NotesTableName);
    const targetNote = await notes.find(data?.id || '');

    await targetNote.update((note: any) => {
      note.title = data?.title;
      note.bookmarked = data?.bookmarked;
      note.note = data?.note;
      note.photo = data?.photo;
    });
  });
};

export const getNotesByPageDB = async (pageId: string, db: Database) => {
  const notes = await db.collections.get(NotesTableName).query(
    Q.where('page_id', pageId),
  );
  return notes;
};

export const deleteNote = async (id: string, db: any) => {
  const notes = db.get(NotesTableName);
  const targetNote = await notes.find(id || '');
  await targetNote.deleteNote();
};
export const deletePhoto = async (id: string, db: any) => {
  const notes = db.get(NotesTableName);
  const targetNote = await notes.find(id || '');
  await targetNote.deleteNote();
};

export const setBookmarkToNote = async (id: string, bookmarked: boolean, db: any) => {
  await db.write(async () => {
    const notes = db.get(NotesTableName);
    const targetNote = await notes.find(id || '');
    await targetNote.update((note: any) => {
      note.bookmarked = bookmarked;
    });
  });
};

export const createDiaryIfNotExist = async (db: Database, title?: string) => {
  await db.write(async () => {
    const diaryCollection = db?.get(DiaryTableName);
    const diaryCount = await diaryCollection.query().fetchCount();
    if (diaryCount === 0) {
      const diary = diaryCollection?.prepareCreate((diary: any) => {
        diary.userId = null;
        // diary.name = title;
        diary.isCurrent = true;
      });
      const photosCollection = db?.get(PhotosTableName);
      const prepareCreatePhotos = [];
      const nowMonth = new Date().getMonth();
      for (let i = 0; i < 12; i++) {
        const nextDate = new Date().setMonth(nowMonth + i);
        prepareCreatePhotos.push(
          photosCollection.prepareCreate(photo => {
            // @ts-ignore
            photo.date = nextDate;
            // @ts-ignore
            photo.diaryId = diary.id;
          })
        );
      }
      await db.batch(
        diary,
        ...prepareCreatePhotos
      );
    }
  });
  const diary = await db.get(DiaryTableName).query().fetchIds();
  return diary[0];
};

export const deleteImagesFromCache = async (imagesUri: string[]) => {
  if (imagesUri?.length) {
    for (const image of imagesUri) {
      if (image) {
        await RNFS.unlink(TemporaryDirectoryPath + '/' + getFileName(image));
      }
    }
  }
};
export const deletePage = async (id: string, db: any) => {
  try {
    const page = await db.get(PagesTableName).find(id || '');
    const notes = await db.get(NotesTableName).query(Q.where('page_id', id)).fetch();
    await page.delete();
    await deleteImagesFromCache(notes.map((note: any) => note.photo));
  } catch (e) {
    console.log(e);
  }
};

export const deleteChapter = async (chapterId: string, db: any) => {
  try {
    const chapter = await db.get(ChaptersTableName).find(chapterId || '');
    const notes = await db.get(NotesTableName).query(Q.where('chapter_id', chapterId)).fetch();
    await chapter.delete();
    const photosUri: string[] = [];
    notes.forEach((note: any) => {
      if (note.photo) {
        const photos = note.photo.split(';');
        photosUri.push(...photos);
      }
    });
    await deleteImagesFromCache(photosUri);
  } catch (e) {
    console.log(e);
  }
};

export const addNPhotos = async (n: number, diaryId: string, db: any) => {
  await db.write(async () => {
    const prepareCreatePhotos = [];
    const photos = db.get(PhotosTableName);
    const allPhotos = await photos.query().fetch();
    const photosAdapted = allPhotos?.map((photo: IPhoto) => photoAdapterJs(photo));
    photosAdapted?.sort((a: IPhoto, b: IPhoto) => {
      return a.date - b.date;
    });

    if (photosAdapted?.length) {
      const lastDate = new Date(photosAdapted[photosAdapted.length - 1].date);
      const necessaryDate = new Date(lastDate).setMonth(lastDate.getMonth() + 1);
      const nowMonth = new Date(necessaryDate).getMonth();
      for (let i = 0; i < n; i++) {
        const nextDate = new Date(necessaryDate).setMonth(nowMonth + i);
        prepareCreatePhotos.push(
          photos.prepareCreate((photo: any) => {
            photo.date = nextDate;
            photo.diaryId = diaryId;
          })
        );
      }
      await db.batch(...prepareCreatePhotos);
    }
  });
};



