import {PullResponse} from './sync';
import {ChaptersTableName, DiaryTableName, NotesTableName, PagesTableName, PhotosTableName} from './schema';
import {IDiary, INote, INoteJS, IPhoto, TTables} from './types';
import {IFormCretePage} from '../components/diary/AddPageModal';
import {Database, Q, tableName} from '@nozbe/watermelondb';
import {romanize} from '../components/diary/assist';
import {NoteRelations} from '../navigation/types';
import {adapterByTableName, noteAdapter, photoAdapter} from './adapters';
import {zip} from 'react-native-zip-archive';
import {CachesDirectoryPath, DocumentDirectoryPath, DownloadDirectoryPath} from 'react-native-fs';
import * as RNFS from 'react-native-fs';
import {getClearPathFile} from '../common/assistant/files';

enum ChangesEvents {
  created='created',
  updated = 'updated',
  deleted = 'deleted'
}


//todo я изменил поля записи в базе и интерфейс INote... привести в порядок все тут и на беке, в связи с этим
/* eslint-disable camelcase */
/*const noteAdapter = (note: INote) => {
  return {
    id: note.id,
    diary_id: Number(note.diary_id),
    created_at: new Date(note.created_at).getTime(),
    updated_at: new Date(note.updated_at).getTime(),
    photo: note.photo || null,
    note: note.note || null,
    tags: note.tags || null,
  };
};*/
type AdapterRes = {
  changes: {
    [NotesTableName]: {
      created: [],
      updated: INote[],
      deleted: string[],
    }
  },
  timestamp: number
}
export const pulledNotesAdapter = (res: PullResponse): AdapterRes => {
  const created = res?.changes?.[NotesTableName]?.[ChangesEvents.created];
  const updated = res?.changes?.[NotesTableName]?.[ChangesEvents.updated];
  const deleted = res?.changes?.[NotesTableName]?.[ChangesEvents.deleted] || [];

  let updatedNew: any = [];
  if (created && updated) {
    updatedNew = [...created, ...updated].map(note => noteAdapter(note));
  }

  if (!res.timestamp) {
    throw new Error('TIMESTAMP WAS NOT PASSED');
  }
  return {
    changes: {
      [NotesTableName]: {
        created: [],
        updated: updatedNew,
        deleted
      }
    },
    timestamp: new Date(res.timestamp).getTime()
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
  console.log('log', id);
  console.log('id', id);
  console.log('targetNote', targetNote);
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
        diary.userId = 27;
        // diary.name = title;
        diary.isCurrent = true;
      });
      const photosCollection = db?.get(PhotosTableName);
      const prepareCreatePhotos = [];
      for (let i = 0; i < 12; i++) {
        const nowMonth = new Date().getMonth();
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
};

export const deleteImagesFromCache = async (imagesUri: string[]) => {
  if (imagesUri?.length) {
    for (const image of imagesUri) {
      if (image) {
        const path = getClearPathFile(image);
        await RNFS.unlink(path);
      }
    }
  }
};
export const deletePage = async (id: string, db: any) => {
  const page = await db.get(PagesTableName).find(id || '');
  const notes = await db.get(NotesTableName).query('page_id', page?.id).fetch();
  await deleteImagesFromCache(notes);
  await page.delete();
};

export const deleteChapter = async (chapterId: string, db: any) => {
  const chapter = await db.get(ChaptersTableName).find(chapterId || '');
  const notes = await db.get(NotesTableName).query('chapter_id', chapter?.id).fetch();
  await deleteImagesFromCache(notes);
  await chapter.delete();
};

export const addNPhotos = async (n: number, diaryId: string, db: any) => {
  await db.write(async () => {
    const prepareCreatePhotos = [];
    const photos = db.get(PhotosTableName);
    const allPhotos = await photos.query().fetch();
    const photosAdapted = allPhotos?.map((photo: IPhoto) => photoAdapter(photo));
    photosAdapted?.sort((a: IPhoto, b: IPhoto) => {
      return a.date - b.date;
    });

    if (photosAdapted?.length) {
      const lastDate = new Date(photosAdapted[photosAdapted.length - 1].date);
      const necessaryDate = new Date(lastDate).setMonth(lastDate.getMonth() + 1);

      for (let i = 0; i < n; i++) {
        const nowMonth = new Date(necessaryDate).getMonth();
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

interface DBExportJson {
  [tableName: string]: {
    [created: string]: any[]
  }
}

export const backupFileName = 'life-book-backup.zip'
export const exportDBToZip = async (db: Database) => {
  const backupFolderPath = DocumentDirectoryPath + '/backup';

  try {
    const schema = await db.schema;
    const tables = Object.keys(schema?.tables);
    const batchPromises = tables.map(table => db.get(table).query().fetch());
    const collections = await Promise.all(batchPromises);
    //crete db json
    const exportJson: DBExportJson = {};

    for (const collection of collections) {
      const tableName = collection.length && collection[0].table;
      if (tableName) {
        const adaptedRecords: any = collection.map(record => adapterByTableName[record.table as TTables](record));
        exportJson[tableName] = {
          created: adaptedRecords
        };

        for (const record of adaptedRecords) {
          if (record?.photo) {
            //create folder
            await RNFS.mkdir(backupFolderPath);
            //copy images to folder
            const imagesUri: string[] = record.photo.split(';');
            for (const image of imagesUri) {
              const imageSplit = image.split('/');
              const imageName = imageSplit[imageSplit.length - 1];
              await RNFS.copyFile(getClearPathFile(image), backupFolderPath + '/' + imageName);
            }
          }
        }
      }
    }

    //write db file
    await RNFS.writeFile(backupFolderPath + '/db.json', JSON.stringify(exportJson), 'utf8');

    //zip all
    await zip(backupFolderPath, DownloadDirectoryPath + '/' + backupFileName);
  } catch (e) {
    console.log(e);
  } finally {
    await RNFS.unlink(backupFolderPath).catch(e => console.log(e));
  }
};
