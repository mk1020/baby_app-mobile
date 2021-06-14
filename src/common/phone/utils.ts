import {Dimensions, Platform} from 'react-native';

export const isIos = Platform.OS === 'ios';
export const isIpad = Platform.OS === 'ios' && Platform.isPad;
export const isDroid = Platform.OS !== 'ios';
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;
