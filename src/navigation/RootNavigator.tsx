import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {RootStackParamsList} from './types';
import {NavigationPages} from './pages';
import {NoHeader} from './components/Headers';
import {SignIn} from '../components/signIn/SignIn';

const Stack = createStackNavigator<RootStackParamsList>();
type TProps = {
  isAuthorized: boolean;
};

export const RootNavigator = (props: TProps): JSX.Element => {
  return (
    <>
      <Stack.Navigator>
        {props.isAuthorized ? getAuthorizedScreens() : getUnauthorizedScreens()}
      </Stack.Navigator>
    </>
  );
};

const getAuthorizedScreens = (): JSX.Element => {
  return (
    <>
      <Stack.Screen
        name={NavigationPages.signIn}
        component={SignIn}
        options={NoHeader}
      />
    </>
  );
};

const getUnauthorizedScreens = (): JSX.Element => {
  return (
    <>
      <Stack.Screen name={NavigationPages.signIn} component={SignIn} options={NoHeader} />
    </>
  );
};
