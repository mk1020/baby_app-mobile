import {Model} from '@nozbe/watermelondb';
import {Associations} from '@nozbe/watermelondb/Model';
import {action, children, field, relation} from '@nozbe/watermelondb/decorators';

export class Diary extends Model {
  static table = 'diaries'
  static associations: Associations = {
    notes: {type: 'has_many', foreignKey: 'diary_id'},
  }

  @field('owner') owner: string | undefined
  @field('user_id') userId: number | undefined
  @field('name') name: string | undefined
  @field('created_at') createdAt: number | undefined
  @field('updated_at') updatedAt: number | undefined

  @children('notes') notes: any
}

export class Note extends Model {
  static table = 'notes'
  static associations: Associations = {
    diaries: {type: 'belongs_to', key: 'diary_id'},
  }

  @field('diary_id') diaryId: number | undefined
  @field('note_type') noteType: number | undefined
  @field('photo') photo: string | undefined
  @field('food') food: string | undefined
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
