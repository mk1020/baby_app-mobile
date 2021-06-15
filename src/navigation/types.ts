import {NavigationPages} from './pages';

export type TAuthPagesList = {
  [NavigationPages.Main]: undefined,
  [NavigationPages.Diary]: undefined,
};
export type TUnAuthPagesList = {
  [NavigationPages.SignIn]: {title: string},
  [NavigationPages.SignUp]: undefined,
  [NavigationPages.PassRecovery]: undefined,
  [NavigationPages.NewPassword]: {title: string, email: string},
};

export type Screens = keyof (TAuthPagesList & TUnAuthPagesList);

export type GetRouteParams<T extends Screens> = Pick<TAuthPagesList & TUnAuthPagesList, T>[T]
