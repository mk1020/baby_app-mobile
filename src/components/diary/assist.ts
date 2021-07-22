import {TFunction} from 'i18next';
import {INote, INoteJS} from '../../model/types';
import {PermissionsAndroid, Platform} from 'react-native';
import {Database, Q} from '@nozbe/watermelondb';
import {NotesTableName} from '../../model/schema';

export const getItemsPageType = (t: TFunction) => ([
  {label: t('common'), value: 1},
  {label: t('photosByMonth'), value: 2},
  {label: t('food'), value: 3},
  {label: t('health'), value: 4},
]);

export function romanize(num: number) {
  if (isNaN(num)) return NaN;
  const digits = String(+num).split('');
  const  key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
    '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
    '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
  let  roman = '';
  let  i = 3;
  while (i--)
    roman = (key[+digits.pop()! + (i * 10)] || '') + roman;
  return Array(+digits.join('') + 1).join('M') + roman;
}

export const monthByNum = (t: TFunction) => ({
  0: t('january'),
  1: t('february'),
  2: t('march'),
  3: t('april'),
  4: t('may'),
  5: t('june'),
  6: t('july'),
  7: t('august'),
  8: t('september'),
  9: t('october'),
  10: t('november'),
  11: t('december'),
});
export interface INoteJSEnhanced extends INoteJS{
  imagesUri: string[]
}
export const notesAdapter = (notes: any): INoteJSEnhanced[] => {
  return notes?.map((note: INoteJS) => ({
    id: note.id,
    title: note.title,
    note: note.note,
    photo: note.photo,
    imagesUri: note.photo ? note.photo?.split(';') : [],
    tags: note.tags,
    food: note.food,
    temp: note.temp,
    volume: note.volume,
    pressure: note.pressure,
    pageId: note.pageId,
    pageType: note.pageType,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    eventDateStart: note.eventDateStart,
    eventDateEnd: note.eventDateEnd,
  }));
};

interface IRecord {
  createdAt: number
}
export interface IResult {
  [year: number]: {
    [month: number]: INoteJSEnhanced[]
  }
}
export const getRecordsByYearsAndMonth = (records: (Required<IRecord> & INoteJSEnhanced)[]): IResult => {
  let year: number;
  let month: number;

  const result: IResult = {};
  records.forEach(record => {
    year = new Date(record?.createdAt).getFullYear();
    month = new Date(record?.createdAt).getMonth();
    const recordsInMonth = result[year]?.[month];

    result[year] = {
      ...result[year],
      [month]: Array.isArray(recordsInMonth) ? [...recordsInMonth, record] : [record]
    };
  });
  return result;
};

export const dateFormat = (timestamp: number) => {
  const date = new Date(timestamp);
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
  return `${day}.${month}.${date.getFullYear()}`;
};

export const requestSavePhotoPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.warn(err);
  }
};


