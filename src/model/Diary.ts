import {Model} from '@nozbe/watermelondb';
import {Associations} from '@nozbe/watermelondb/Model';
import {action, children, field, relation} from '@nozbe/watermelondb/decorators';
import {ChaptersTableName, DiaryTableName, NotesTableName, PagesTableName} from './schema';

export class Diary extends Model {
  static table = DiaryTableName
  static associations: Associations = {
    [ChaptersTableName]: {type: 'has_many', foreignKey: 'diary_id'},
  }

  @field('user_id') userId: number | undefined
  @field('name') name: string | undefined
  @field('is_current') isCurrent: boolean | undefined
  @field('created_at') createdAt: number | undefined
  @field('updated_at') updatedAt: number | undefined

  @children(ChaptersTableName) chapter: any

  @action async changeIsCurrentDiary(isCurrent: boolean) {
    await this.update(diary => {
      diary['isCurrent'] = isCurrent;
    });
  }
}

export class Chapter extends Model {
  static table = ChaptersTableName
  static associations: Associations = {
    [PagesTableName]: {type: 'has_many', foreignKey: 'chapter_id'},
    [DiaryTableName]: {type: 'belongs_to', key: 'diary_id'},
  }

  @field('diary_id') diaryId: string | undefined
  @field('name') name: string | undefined
  @field('number') number: number | undefined
  @field('created_at') createdAt: number | undefined
  @field('updated_at') updatedAt: number | undefined

  @children(PagesTableName) pages: any
  @relation(DiaryTableName, 'diary_id') diary: any
}

export class Page extends Model {
  static table = PagesTableName
  static associations: Associations = {
    [NotesTableName]: {type: 'has_many', foreignKey: 'page_id'},
    [NotesTableName]: {type: 'has_many', foreignKey: 'page_type'},
    [ChaptersTableName]: {type: 'belongs_to', key: 'chapter_id'},
    [DiaryTableName]: {type: 'belongs_to', key: 'diary_id'},
  }

  @field('diary_id') diaryId: string | undefined
  @field('chapter_id') chapterId: string | undefined
  @field('page_type') pageType: string | undefined
  @field('name') name: string | undefined
  @field('created_at') createdAt: number | undefined
  @field('updated_at') updatedAt: number | undefined

  @children(NotesTableName) notes: any
  @relation(ChaptersTableName, 'chapter_id') chapter: any
  @relation(DiaryTableName, 'diary_id') diary: any
}

export class Note extends Model {
  static table = NotesTableName
  static associations: Associations = {
    [PagesTableName]: {type: 'belongs_to', key: 'page_id'},
    [PagesTableName]: {type: 'belongs_to', key: 'page_type'},
  }

  @field('page_id') pageId: number | undefined
  @field('page_type') noteType: number | undefined
  @field('title') title: string | undefined
  @field('note') note: string | undefined
  @field('photo') photo: string | undefined
  @field('food') food: string | undefined
  @field('event_date_start') eventDateStart: string | undefined
  @field('event_date_end') eventDateEnd: string | undefined
  @field('volume') volume: string | undefined
  @field('temp') temp: string | undefined
  @field('tags') tags: string | undefined
  @field('pressure') pressure: string | undefined
  @field('created_at') createdAt: number | undefined
  @field('updated_at') updatedAt: number | undefined

  @relation(PagesTableName, 'page_id') page: any

  @action async updateNote(key: keyof Note, value: string) {
    await this.update(note => {
      note[key] = value;
    });
  }
  @action async deleteNote() {
    await this.markAsDeleted();
  }
  @action async resetDB() {
    //await this.unsafeResetDatabase();
  }
}
