import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TAuthPagesList} from './types';
import {NavigationPages} from './pages';
import {Diary} from '../components/diary/Diary';
import {Main} from '../components/main/Main';
import {RouteProp} from '@react-navigation/native';
import {colorsByTheme} from '../common/consts/colorsByTheme';
import {useSelector} from 'react-redux';
import {RootStoreType} from '../redux/rootReducer';
import {createStackNavigator} from '@react-navigation/stack';

const DiaryStack = createStackNavigator();

const DiaryStackScreen = () => {
  return (
    <DiaryStack.Navigator>
      <DiaryStack.Screen
        name={NavigationPages.Diary}
        component={Diary}
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
