import {isIos} from '../phone/utils';
import {DownloadDirectoryPath} from 'react-native-fs';

export const getClearPathFile = (path: string) => path.replace('file://', '');
export const shortPath = (path: string) => {
  const pathSplit = path.split('/');
  return `/${pathSplit[pathSplit.length - 2]}/${pathSplit[pathSplit.length - 1]}`;
};
export const getImagePath = (path: string) => (isIos ? '~' + path?.substring(path?.indexOf('/tmp')) : path);
//todo на андройд работает RNFS с обрезкой file://, а на ios возможно не будет, надо проверить
export const getFileName = (path: string) => path?.split('/')?.pop() || '';

export const blobFromUri = async (uri: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};
