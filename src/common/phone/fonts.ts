import {isIos} from './utils';

export class Fonts {
  static regular = isIos ? 'SFUIText-Regular' : 'Roboto-Regular';
  static medium = isIos ? 'SFUIText-Medium' : 'Roboto-Medium';
  static bold = isIos ? 'SFUIText-Bold' : 'Roboto-Bold';
}
