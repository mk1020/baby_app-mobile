import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SignIn} from '../components/signIn/SignIn';
import {TAuthPagesList} from './types';
import {NavigationPages} from './pages';

const Tab = createBottomTabNavigator<TAuthPagesList>();
export const getAuthorizedScreens = (): JSX.Element => {
  return (
    <Tab.Navigator>
      <Tab.Screen name={NavigationPages.Main} component={SignIn} />
    </Tab.Navigator>
  );
};
