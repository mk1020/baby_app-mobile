import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './assistant';
import {AuthorizedScreens} from './AuthorizedScreens';
import {UnauthorizedScreens} from './UnauthorizedScreens';
import React, {memo, useEffect, useState} from 'react';
import {InitialState, NavigationState} from '@react-navigation/routers';
import {storeData} from '../common/assistant/asyncStorage';
import {PERSISTENCE_NAV_KEY} from '../common/consts';
import {useSelector} from 'react-redux';
import {RootStoreType} from '../redux/rootReducer';

type TProps = {
  initState?: InitialState,
}
export const NavContainer = memo((props: TProps) => {
  const {initState} = props;
  const userToken = useSelector((state: RootStoreType) => state.app.userToken);
  const language = useSelector((state: RootStoreType) => state.app.language);

  const onChangeNav = (state?: NavigationState) => {
    storeData(PERSISTENCE_NAV_KEY, state).then();
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      initialState={initState}
      onStateChange={onChangeNav}
    >
      {userToken !== null ? <AuthorizedScreens key={language + 'salt nav container'}/> : <UnauthorizedScreens key={language + 'salt nav container'}/>}
    </NavigationContainer>
  );
});
