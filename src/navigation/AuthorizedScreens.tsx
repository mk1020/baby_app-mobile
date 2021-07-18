import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AuthDiaryStackScreenList, AuthTabList} from './types';
import {NavigationPages} from './pages';
import {Diary} from '../components/diary/Diary';
import {Main} from '../components/main/Main';
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import {Page} from '../components/diary/Page/Page';
import {HeaderButton} from '../common/components/HeaderButton';
import {Images} from '../common/imageResources';
import {stylesHeader} from '../components/diary/Header';
import {NotePage, NotePageMode} from '../components/diary/contentTab/NotePage/NotePage';
import {ImagesFullScreenEdit} from '../components/diary/contentTab/NotePage/ImagesFullScreenEdit';

const DiaryStack = createStackNavigator<AuthDiaryStackScreenList>();

const DiaryStackScreen = () => {
  return (
    <DiaryStack.Navigator>
      <DiaryStack.Screen
        name={NavigationPages.Diary}
        component={Diary}
        options={{headerShown: false}}
      />
      <DiaryStack.Screen
        name={NavigationPages.DiaryPage}
        component={Page}
        options={({route, navigation}) => ({
          title: route?.params?.pageData?.name,
          headerLeft: () => <HeaderButton icon={Images.arrowBack} onPress={() => navigation.goBack()}/>,
          headerTitleStyle: stylesHeader.title,
          headerRight: () =>  <HeaderButton icon={Images.add} onPress={() => navigation.navigate(NavigationPages.NotePage, {mode: NotePageMode.Create})}/>,
          headerLeftContainerStyle: {marginHorizontal: 16, marginTop: 16},
          headerRightContainerStyle: {marginHorizontal: 16, marginTop: 16},
          headerStyle: {elevation: 0, shadowOffset: {width: 0, height: 0}, shadowRadius: 0}
        })}
      />
      <DiaryStack.Screen
        name={NavigationPages.NotePage}
        component={NotePage}
        options={({route, navigation}) => ({
          headerShown: false
        })}
      />
      <DiaryStack.Screen
        name={NavigationPages.ImagesFullScreenEdit}
        component={ImagesFullScreenEdit}
        options={{headerShown: false}}
      />
    </DiaryStack.Navigator>
  );
};

const Tab = createBottomTabNavigator<AuthTabList>();
export const AuthorizedScreens = (): JSX.Element => {

  return (
    <Tab.Navigator >
      <Tab.Screen
        name={NavigationPages.Diary}
        component={DiaryStackScreen}
      />
      <Tab.Screen name={NavigationPages.Main} component={Main} />
    </Tab.Navigator>
  );
};

