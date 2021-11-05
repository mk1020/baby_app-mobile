import {TLanguage} from '../common/localization/localization';

export type TColorScheme = 'light' | 'dark';

export type TAppReducer = {
  colorScheme: TColorScheme;
  googleAccessToken: string | null,
  userToken: TToken | null;
  userId: number | null;
  diaryId: string | null
  isLoading: boolean;
  language: TLanguage | null
  diaryTitle: string,
  forceUpdate: number,
  deletedPhotos: string[] //uri's photos
  lastSyncAt: number,
  userEmail: string,
  isAuthError: boolean
};

export type TSignIn = {
  login: string;
  password: string;
};

export type TSignInGoogle = {
  oAuthIdToken: string;
  diaryId: string
};

export enum ColorSchemes {
  light = 'light',
  dark = 'dark',
}

export type TSignInRes = {
  userId: number,
  token: TToken,
  email: string
}

export type TToken = {
  token: string,
  expires: any;
}

