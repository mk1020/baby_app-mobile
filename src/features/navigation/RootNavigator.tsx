import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { navigationRef } from '../../services/navigation/navigationService';
import { Home } from '../home/Home';
import { RootStackParamsList } from './types';
import { NavigationPages } from './pages';

const Stack = createStackNavigator<RootStackParamsList>();
type TProps = {
  isAuthorized: boolean;
};

export const RootNavigator = (props: TProps): JSX.Element => {
  return (
    <>
      <Stack.Navigator initialRouteName={NavigationPages.signIn}>
        {props.isAuthorized ? getAuthorizedScreens() : getUnauthorizedScreens()}
      </Stack.Navigator>
    </>
  );
};

const getAuthorizedScreens = (): JSX.Element => {
  return (
    <>
      <Stack.Screen name={NavigationPages.notifications} component={Home} />
    </>
  );
};

const getUnauthorizedScreens = (): JSX.Element => {
  return (
    <>
      <Stack.Screen
        name={NavigationPages.signIn}
        component={Home}
        options={{
          title: 'Sign in',
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          animationTypeForReplace: state.isSignout ? 'pop' : 'push',
        }}
      />
    </>
  );
};
