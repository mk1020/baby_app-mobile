import {TFunction} from 'i18next';
import {INote, INoteJS} from '../../model/types';

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

export const monthByNum = (t: TFunction, num: number) => ({
  0: t('december'),
  1: t('january'),
  2: t('february'),
  3: t('march'),
  4: t('april'),
  5: t('may'),
  6: t('june'),
  7: t('july'),
  8: t('august'),
  9: t('september'),
  10: t('october'),
  11: t('november'),
});

export const notesAdapter = (notes: any[]): INoteJS[] => {
  return notes.map(note => ({
    id: note.id,
    title: note.title,
    note: note.note,
    photo: note.photo,
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
  }
  ));
};
