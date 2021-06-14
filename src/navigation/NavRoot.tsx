import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './assistant';
import {AuthorizedScreens} from './AuthorizedScreens';
import {UnauthorizedScreens} from './UnauthorizedScreens';
import React from 'react';
import {InitialState} from '@react-navigation/routers';


export const NavContainer = ({isAuth, initState, onChange}: {isAuth: boolean, initState?: InitialState, onChange: ()=>void}) => {
  return (
    <NavigationContainer
      ref={navigationRef}
      initialState={initState}
      onStateChange={onChange}
    >
      {isAuth ? <AuthorizedScreens/> : <UnauthorizedScreens/>}
    </NavigationContainer>
  );
};
