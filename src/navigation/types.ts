import {NavigationPages} from './pages';
import {NavigatorScreenParams} from '@react-navigation/native';

export type PageType = {
  id: string
  name: string
  pageType: number
  chapterId: string
  diaryId: string
  createdAt: number
  updatedAt: number
}
export type AuthDiaryStackScreenList = {
  [NavigationPages.DiaryPage]: {pageData: PageType},
  [NavigationPages.Diary]: {diaryName: string},
}

export type AuthTabList = {
  [NavigationPages.Main]: undefined,
  [NavigationPages.Diary]: NavigatorScreenParams<AuthDiaryStackScreenList>,
};

export type TUnAuthPagesList = {
  [NavigationPages.SignIn]: {title: string},
  [NavigationPages.SignUp]: undefined,
  [NavigationPages.PassRecovery]: undefined,
  [NavigationPages.NewPassword]: {title: string, email: string},
};

export type Screens = keyof (AuthTabList & TUnAuthPagesList);

export type GetRouteParams<T extends Screens> = Pick<AuthTabList & TUnAuthPagesList, T>[T]
