import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TAuthPagesList} from './types';
import {NavigationPages} from './pages';
import {Diary} from '../components/diary/Diary';
import {Main} from '../components/main/Main';

const Tab = createBottomTabNavigator<TAuthPagesList>();
export const AuthorizedScreens = (): JSX.Element => {
  return (
    <Tab.Navigator >
      <Tab.Screen name={NavigationPages.Diary} component={Diary} />
      <Tab.Screen name={NavigationPages.Main} component={Main} />
    </Tab.Navigator>
  );
};
