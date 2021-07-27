import {NavigationPages, NavigationTabs, TabsName} from './pages';
import {NavigatorScreenParams} from '@react-navigation/native';
import {NotePageMode} from '../components/diary/contentTab/NotePage/NotePage';
import {INoteJS} from '../model/types';

export type PageType = {
  id: string
  name: string
  chapterId: string
  diaryId: string
  createdAt: number
  updatedAt: number
}
export type NoteRelations = {
  diaryId: string,
  chapterId: string,
  pageId: string,
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
    relations: NoteRelations
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
  [NavigationPages.PhotosByMonth]: {diaryId: string, deletedPhotoId?: string},
  [NavigationPages.ImageFullScreen]: {imageUri: string, imageId: string},
};
export type TabsList = {
  [NavigationTabs.Diary]: {diaryName: string}
  [NavigationTabs.Settings]: undefined,
}

export type Screens = keyof (RootStackList & TUnAuthPagesList);

export type GetRouteParams<T extends Screens> = Pick<RootStackList & TUnAuthPagesList, T>[T]
