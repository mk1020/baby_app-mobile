import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { navigationRef } from '../../services/navigation/navigationService';
import { Home } from '../home/Home';
import { useSelector } from 'react-redux';
import { TAppReducer } from '../../storage/redux/appSlice';
import { Text } from 'react-native';
import { RootStoreType } from "../../storage/redux/rootReducer";

export type RootStackParamsList = {
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamsList>();

export function Navigator() {


  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
