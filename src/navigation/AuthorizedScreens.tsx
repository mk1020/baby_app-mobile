import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TAuthPagesList} from './types';
import {NavigationPages} from './pages';
import {Diary} from '../components/diary/Diary';
import {Main} from '../components/main/Main';
import {createStackNavigator} from '@react-navigation/stack';

const DiaryStack = createStackNavigator();

const DiaryStackScreen = () => {
  return (
    <DiaryStack.Navigator>
      <DiaryStack.Screen
        name={NavigationPages.Diary}
        component={Diary}
        options={{headerShown: false}}
      />
    </DiaryStack.Navigator>
  );
};

const Tab = createBottomTabNavigator<TAuthPagesList>();
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
