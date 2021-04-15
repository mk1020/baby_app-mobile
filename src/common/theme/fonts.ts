import { isIos } from './utils';

export class Fonts {
  static regular = isIos ? 'SFProDisplay-Regular' : 'Roboto-Regular';
  static medium = isIos ? 'SFProDisplay-SemiBold' : 'Roboto-Medium';
  static bold = isIos ? 'SFProDisplay-Bold' : 'Roboto-Bold';
}
