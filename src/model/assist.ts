import {ChangesByEvents, PullResponse} from './sync';
import {ChaptersTableName, NotesTableName, PagesTableName} from './schema';
import {INote, INoteJS} from './types';
import {IFormCretePage} from '../components/diary/AddPageModal';
import {Database, Q} from '@nozbe/watermelondb';
import {romanize} from '../components/diary/assist';

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
    note_type: note.note_type,
    date_event_start: note.date_event_start || null,
    date_event_end: note.date_event_end || null,
    photo: note.photo || null,
    food: note.food || null,
    volume: note.volume || null,
    note: note.note || null,
    temp: note.temp || null,
    tags: note.tags || null,
    pressure: note.pressure || null
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
  const chapters = database?.get(ChaptersTableName);
  const pages = database?.get(PagesTableName);
  await database.action(async () => {

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
  const pages = database?.get(PagesTableName);
  await database.action(async () => {
    await pages.create((page: any) => {
      page.diaryId = diaryId;
      page.name = data.pageName;
      page.chapterId = chapterId || '';
    });
  });
};

export const createNoteDB = async (database: Database, data: Partial<INoteJS>, pageId: string) => {
  const notes = database?.get(NotesTableName);
  await database.action(async () => {
    await notes.create((note: any) => {
      note.pageId = pageId;
      note.title = data?.title;
      note.note = data?.note;
      note.photo = data?.photo;
    });
  });
};

export const updateNoteDB = async (database: Database, data?: Partial<INoteJS>) => {
  const notes = database?.get(NotesTableName);
  const targetNote = await notes.find(data?.id || '');

  await database.action(async () => {
    await targetNote.update((note: any) => {
      note.title = data?.title;
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