import React from 'react';
import {NavigationPages} from './pages';
import {SignIn} from '../components/signIn/SignIn';
import {NoHeader} from './components/Headers';
import {SignUp} from '../components/signUp/SignUp';
import {createStackNavigator} from '@react-navigation/stack';
import {TUnAuthPagesList} from './types';
import {useTranslation} from 'react-i18next';
import {PassRecovery} from '../components/passRecovery/PassRecovery';
import {NewPassword} from '../components/passRecovery/NewPassword';


const Stack = createStackNavigator<TUnAuthPagesList>();
export const UnauthorizedScreens = (): JSX.Element => {
  const {t, i18n} = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NavigationPages.SignIn}
        component={SignIn}
        initialParams={{title: ''}}
        listeners={({navigation, route}) => ({
          blur: () => {
            navigation.setParams({title: ''});
          }})
        }
        options={NoHeader}
      />
      <Stack.Screen name={NavigationPages.SignUp} component={SignUp} options={{title: t('signUp')}}/>
      <Stack.Screen name={NavigationPages.PassRecovery} component={PassRecovery} options={{title: t('passRecovery')}}/>
      <Stack.Screen name={NavigationPages.NewPassword} component={NewPassword} options={{title: t('newPassword')}}/>
    </Stack.Navigator>
  );
};
