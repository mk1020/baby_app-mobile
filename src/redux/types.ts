export type TColorScheme = 'light' | 'dark';

export type TAppReducer = {
  colorScheme: TColorScheme;
  userToken: string | null;
  isLoading: boolean;
};

export type TSignIn = {
  login: string;
  password: string;
};

export enum ColorSchemes {
  light = 'light',
  dark = 'dark',
}