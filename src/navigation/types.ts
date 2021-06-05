import {NavigationPages} from './pages';

export type TAuthPagesList = {
  [NavigationPages.Main]: undefined,
};
export type TUnAuthPagesList = {
  [NavigationPages.SignIn]: {signUpText: string},
  [NavigationPages.SignUp]: undefined,
};
