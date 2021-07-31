import {parseHTMLRegex} from '../consts';

export const isEmptyObj = (obj: Record<string, unknown>) => (
  obj && Object.keys(obj).length === 0 && obj.constructor === Object
);

export const parseHTML = (html: string): string => {
  const preResult = html.replace(parseHTMLRegex, '');
  return preResult.replace(/&nbsp;/gm, ' ');
};

export function makeId(length: number) {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}
