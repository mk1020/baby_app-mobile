import { Dimensions, Platform, PlatformIOSStatic } from 'react-native';

let isIphone5Value: boolean | null;

const WIDTH = 320;
const HEIGHT = 568;

export function isIphone5Func(): boolean {
  if (isIphone5Value == null) {
    const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');

    isIphone5Value =
      Platform.OS == 'ios' &&
      !(Platform as PlatformIOSStatic).isPad &&
      ((D_HEIGHT === HEIGHT && D_WIDTH === WIDTH) || (D_HEIGHT === WIDTH && D_WIDTH === HEIGHT));
  }

  return isIphone5Value;
}
