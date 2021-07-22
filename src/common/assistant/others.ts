import {parseHTMLRegex} from '../consts';

export const isEmptyObj = (obj: Record<string, unknown>) => (
  obj && Object.keys(obj).length === 0 && obj.constructor === Object
);

export const parseHTML = (html: string): string => {
  const preResult = html.replace(parseHTMLRegex, '');
  return preResult.replace(/&nbsp;/gm, ' ');
};


