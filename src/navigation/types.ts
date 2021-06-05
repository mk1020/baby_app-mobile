import {NavigationPages} from './pages';

export type TAuthPagesList = {
  [NavigationPages.Main]: undefined,
};
export type TUnAuthPagesList = {
  [NavigationPages.SignIn]: {signUpText: string},
  [NavigationPages.SignUp]: undefined,
};

export type Screens = keyof (TAuthPagesList & TUnAuthPagesList);

export type GetRouteParams<T extends Screens> = Pick<TAuthPagesList & TUnAuthPagesList, T>[T]
