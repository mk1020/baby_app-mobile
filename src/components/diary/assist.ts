import {TFunction} from 'i18next';

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
