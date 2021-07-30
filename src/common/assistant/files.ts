export const getClearPathFile = (path: string) => path.replace('file://', '');
export const shortPath = (path: string) => {
  const pathSplit = path.split('/');
  return `/${pathSplit[pathSplit.length - 2]}/${pathSplit[pathSplit.length - 1]}`;
};
