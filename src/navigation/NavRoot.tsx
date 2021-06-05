import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './assistant';
import {getAuthorizedScreens} from './AuthorizedScreens';
import {getUnauthorizedScreens} from './UnauthorizedScreens';
import React from 'react';
import {InitialState} from '@react-navigation/routers';


export const NavContainer = ({isAuth, initState, onChange}: {isAuth: boolean, initState?: InitialState, onChange: ()=>void}) => {
  return (
    <NavigationContainer
      ref={navigationRef}
      initialState={initState}
      onStateChange={onChange}
    >
      {isAuth ? getAuthorizedScreens() : getUnauthorizedScreens()}
    </NavigationContainer>
  );
};
