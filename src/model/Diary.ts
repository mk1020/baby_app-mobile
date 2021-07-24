import {Model} from '@nozbe/watermelondb';
import {Associations} from '@nozbe/watermelondb/Model';
import {children, field, relation} from '@nozbe/watermelondb/decorators';
import {ChaptersTableName, DiaryTableName, NotesTableName, PagesTableName} from './schema';
import {writer} from '@nozbe/watermelondb/decorators';

export class Diary extends Model {
  static table = DiaryTableName
  static associations: Associations = {
    [ChaptersTableName]: {type: 'has_many', foreignKey: 'diary_id'},
    [NotesTableName]: {type: 'has_many', foreignKey: 'diary_id'},
  }

  @field('user_id') userId: number | undefined
  @field('name') name: string | undefined
  @field('is_current') isCurrent: boolean | undefined
  @field('created_at') createdAt: number | undefined
  @field('updated_at') updatedAt: number | undefined

  @children(ChaptersTableName) chapter: any
  @children(NotesTableName) notes: any

  @writer async changeIsCurrentDiary(isCurrent: boolean) {
    await this.update(diary => {
      diary['isCurrent'] = isCurrent;
    });
  }
}

export class Chapter extends Model {
  static table = ChaptersTableName
  static associations: Associations = {
    [PagesTableName]: {type: 'has_many', foreignKey: 'chapter_id'},
    [NotesTableName]: {type: 'has_many', foreignKey: 'chapter_id'},
    [DiaryTableName]: {type: 'belongs_to', key: 'diary_id'},
  }

  @field('diary_id') diaryId: string | undefined
  @field('name') name: string | undefined
  @field('number') number: number | undefined
  @field('created_at') createdAt: number | undefined
  @field('updated_at') updatedAt: number | undefined

  @children(PagesTableName) pages: any
  @children(NotesTableName) notes: any
  @relation(DiaryTableName, 'diary_id') diary: any

  async markAsDeleted() {
    await this.pages.destroyAllPermanently();
    await this.notes.destroyAllPermanently();
    await super.markAsDeleted();
  }

  @writer async delete() {
    await this.markAsDeleted();
  }
}

export class Page extends Model {
  static table = PagesTableName
  static associations: Associations = {
    [NotesTableName]: {type: 'has_many', foreignKey: 'page_id'},
    [ChaptersTableName]: {type: 'belongs_to', key: 'chapter_id'},
    [DiaryTableName]: {type: 'belongs_to', key: 'diary_id'},
  }

  @field('diary_id') diaryId: string | undefined
  @field('chapter_id') chapterId: string | undefined
  //@field('page_type') pageType: string | undefined
  @field('name') name: string | undefined
  @field('created_at') createdAt: number | undefined
  @field('updated_at') updatedAt: number | undefined

  @children(NotesTableName) notes: any
  @relation(ChaptersTableName, 'chapter_id') chapter: any
  @relation(DiaryTableName, 'diary_id') diary: any

  async markAsDeleted() {
    await this.notes.destroyAllPermanently();
    await super.markAsDeleted();
  }

  @writer async delete() {
    await this.markAsDeleted();
  }
}

export class Note extends Model {
  static table = NotesTableName
  static associations: Associations = {
    [PagesTableName]: {type: 'belongs_to', key: 'page_id'},
    [DiaryTableName]: {type: 'belongs_to', key: 'diary_id'},
    [ChaptersTableName]: {type: 'belongs_to', key: 'chapter_id'},
  }

  @field('page_id') pageId: string | undefined
  @field('diary_id') diaryId: string | undefined
  @field('chapter_id') chapterId: string | undefined
  @field('title') title: string | undefined
  @field('bookmarked') bookmarked: boolean | undefined
  @field('note') note: string | undefined
  @field('photo') photo: string | undefined
  @field('tags') tags: string | undefined
  @field('created_at') createdAt: number | undefined
  @field('updated_at') updatedAt: number | undefined

  @relation(PagesTableName, 'page_id') page: any
  @relation(DiaryTableName, 'diary_id') diary: any
  @relation(ChaptersTableName, 'chapter_id') chapter: any

  @writer async deleteNote() {
    await this.markAsDeleted();
  }
}
