import {isIos} from '../phone/utils';

export const getClearPathFile = (path: string) => path.replace('file://', '');
export const shortPath = (path: string) => {
  const pathSplit = path.split('/');
  return `/${pathSplit[pathSplit.length - 2]}/${pathSplit[pathSplit.length - 1]}`;
};
export const getImagePath = (path: string) => (isIos ? '~' + path?.substring(path?.indexOf('/tmp')) : path);
//todo на андройд работает RNFS с обрезкой file://, а на ios возможно не будет, надо проверить
export const getFileName = (path: string) => path?.split('/')?.pop() || '';
