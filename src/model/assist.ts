import {PullResponse} from './sync';
import {ChaptersTableName, DiaryTableName, NotesTableName, PagesTableName} from './schema';
import {INote, INoteJS} from './types';
import {IFormCretePage} from '../components/diary/AddPageModal';
import {Database, Q} from '@nozbe/watermelondb';
import {romanize} from '../components/diary/assist';
import {NoteRelations} from '../navigation/types';

enum ChangesEvents {
  created='created',
  updated = 'updated',
  deleted = 'deleted'
}

//todo я изменил поля записи в базе и интерфейс INote... привести в порядок все тут и на беке, в связи с этим
/* eslint-disable camelcase */
const noteAdapter = (note: INote) => {
  return {
    id: note.id,
    diary_id: Number(note.diary_id),
    created_at: new Date(note.created_at).getTime(),
    updated_at: new Date(note.updated_at).getTime(),
    photo: note.photo || null,
    note: note.note || null,
    tags: note.tags || null,
  };
};
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

export const createPage = async  (database: Database, data: IFormCretePage, diaryId: string, chapterId?: string) => {
  await database.write(async () => {
    const pages = database?.get(PagesTableName);
    await pages.create((page: any) => {
      page.diaryId = diaryId;
      page.name = data.pageName;
      page.chapterId = chapterId || '';
    });
  });
};

export const createNoteDB = async (db: Database, data: Partial<INoteJS>, relations: NoteRelations) => {
  await db.write(async () => {
    const notes = db?.get(NotesTableName);
    await notes.create((note: any) => {
      note.diaryId = relations.diaryId;
      note.chapterId = relations.chapterId;
      note.pageId = relations.pageId;
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
  await db.write(async () => {
    const notes = db.get(NotesTableName);
    const targetNote = await notes.find(id || '');
    await targetNote.deleteNote();
  });
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

export const createDiaryIfNotExist = async (db: Database, title: string) => {
  await db.write(async () => {
    const diary = db?.get(DiaryTableName);
    const diaryCount = await diary.query().fetchCount();
    if (diaryCount === 0) {
      await diary?.create((diary: any) => {
        diary.userId = 27;
        diary.name = title;
        diary.isCurrent = true;
      });
    }
  });
};

export const deletePage = async (id: string, db: any) => {
  await db.get(PagesTableName).find(id || '').delete();
};

export const deleteChapter = async (chapterId: string, db: any) => {
  await db.get(ChaptersTableName).find(chapterId || '').delete();
};
