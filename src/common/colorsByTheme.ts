import {ColorSchemes, TColorScheme} from '../redux/types';

export const ColorsByTheme = (theme: TColorScheme) => {
  const light = {
    backgroundColor: '#fff',
    headerTitle: '#383838'
  };
  const dark = {
    backgroundColor: '#fff',
    headerTitle: '#383838'
  };
  if (theme === ColorSchemes.dark) return dark;
  return light;
};
