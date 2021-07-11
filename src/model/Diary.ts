import {Model} from '@nozbe/watermelondb';
import {Associations} from '@nozbe/watermelondb/Model';
import {action, children, field, relation} from '@nozbe/watermelondb/decorators';
import {ChaptersTableName, DiaryTableName, NotesTableName, PagesTableName} from './schema';
import {IFormCretePage} from '../components/diary/AddPageModal';

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

  @children('notes') notes: any

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
  @field('name') name: string | undefined
  @field('created_at') createdAt: number | undefined
  @field('updated_at') updatedAt: number | undefined

}

export class Note extends Model {
  static table = NotesTableName
  static associations: Associations = {
    [PagesTableName]: {type: 'belongs_to', key: 'page_id'},
  }

  @field('page_id') pageId: number | undefined
  @field('note_type') noteType: number | undefined
  @field('photo') photo: string | undefined
  @field('food') food: string | undefined
  @field('volume') volume: string | undefined
  @field('note') note: string | undefined
  @field('duration') duration: string | undefined
  @field('milk_volume_left') milkVolumeLeft: string | undefined
  @field('milk_volume_right') milkVolumeRight: string | undefined
  @field('type') type: string | undefined
  @field('achievement') achievement: string | undefined
  @field('weight') weight: string | undefined
  @field('growth') growth: string | undefined
  @field('head_circle') headCircle: string | undefined
  @field('temp') temp: string | undefined
  @field('tags') tags: string | undefined
  @field('pressure') pressure: string | undefined
  @field('created_at') createdAt: number | undefined
  @field('updated_at') updatedAt: number | undefined

  @relation('diaries', 'diary_id') diary: any

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
