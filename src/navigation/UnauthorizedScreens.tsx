import React from 'react';
import {NavigationPages} from './pages';
import {SignIn} from '../components/signIn/SignIn';
import {NoHeader} from './components/Headers';
import {SignUp} from '../components/signUp/SignUp';
import {createStackNavigator} from '@react-navigation/stack';
import {TUnAuthPagesList} from './types';


const Stack = createStackNavigator<TUnAuthPagesList>();
export const getUnauthorizedScreens = (): JSX.Element => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NavigationPages.SignIn}
        component={SignIn} options={NoHeader}
        initialParams={{signUpText: ''}}
        listeners={({navigation, route}) => ({
          blur: () => {
            navigation.setParams({signUpText: ''});
          }})
        }
      />
      <Stack.Screen name={NavigationPages.SignUp} component={SignUp} options={NoHeader} />
    </Stack.Navigator>
  );
};
