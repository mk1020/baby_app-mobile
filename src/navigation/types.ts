import {NavigationPages, NavigationTabs, TabsName} from './pages';
import {NavigatorScreenParams} from '@react-navigation/native';
import {NotePageMode} from '../components/diary/contentTab/NotePage/NotePage';
import {INoteJS} from '../model/types';

export type PageType = {
  id: string
  name: string
  pageType: number
  chapterId: string
  diaryId: string
  createdAt: number
  updatedAt: number
}

//NavigatorScreenParams<AuthDiaryStackScreenList>

export type TUnAuthPagesList = {
  [NavigationPages.SignIn]: {title: string},
  [NavigationPages.SignUp]: undefined,
  [NavigationPages.PassRecovery]: undefined,
  [NavigationPages.NewPassword]: {title: string, email: string},
};

export type RootStackList = {
  [NavigationPages.DiaryPage]: {pageData: PageType},
  [NavigationPages.NotePage]: {
    imagesUri: string[],
    mode: NotePageMode,
    noteData?: INoteJS,
    pageId: string
  },
  [NavigationPages.ImagesFullScreenEdit]: {
    counter: {
      currentIndex: number,
      total: number
    },
    imagesUri: string[],
  },
  [NavigationPages.ImagesFullScreen]: {
    counter: {
      currentIndex: number,
      total: number
    },
    imagesUri: string[],
  },
  [TabsName]: NavigatorScreenParams<TabsList>,
};
export type TabsList = {
  [NavigationTabs.Diary]: {diaryName: string}
  [NavigationTabs.Settings]: undefined,
}

export type Screens = keyof (RootStackList & TUnAuthPagesList);

export type GetRouteParams<T extends Screens> = Pick<RootStackList & TUnAuthPagesList, T>[T]
