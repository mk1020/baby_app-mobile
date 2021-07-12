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
          headerRight: () =>  <HeaderButton icon={Images.add} onPress={() => navigation.navigate(NavigationPages.CreateNote)}/>,
          headerLeftContainerStyle: {marginHorizontal: 16, marginTop: 16},
          headerRightContainerStyle: {marginHorizontal: 16, marginTop: 16}
        })}
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

