export const getClearPathFile = (path: string) => path.replace('file://', '');
export const shortPath = (path: string) => {
  const pathSplit = path.split('/');
  return `/${pathSplit[pathSplit.length - 2]}/${pathSplit[pathSplit.length - 1]}`;
};
//todo на андройд работает RNFS с обрезкой file://, а на ios возможно не будет, надо проверить
