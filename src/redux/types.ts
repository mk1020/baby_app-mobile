import {TLanguage} from '../common/localization/localization';

export type TColorScheme = 'light' | 'dark';

export type TAppReducer = {
  colorScheme: TColorScheme;
  userToken: TToken | null;
  isLoading: boolean;
  language: TLanguage | null
  diaryTitle: string,
  forceUpdate: number
};

export type TSignIn = {
  login: string;
  password: string;
};

export type TSignInGoogle = {
  oAuthIdToken: string;
};

export enum ColorSchemes {
  light = 'light',
  dark = 'dark',
}

export type TSignInRes = {
  userId: number,
  token: TToken
}

export type TToken = {
  token: number,
  expires: any;
}

