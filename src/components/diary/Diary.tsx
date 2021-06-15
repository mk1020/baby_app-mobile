import React, {memo} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {NavigationPages} from '../../navigation/pages';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {TAuthPagesList} from '../../navigation/types';
import {NavigationState} from '@react-navigation/routers';
import {restoreNavState} from '../../navigation/utils';

type TProps = {
  route: RouteProp<TAuthPagesList, NavigationPages.Diary>
}

export const Diary = memo((props:TProps) => {
  const {t, i18n} = useTranslation();

  const {params} = props.route;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const test = async ()=> {
    const navState: NavigationState = await restoreNavState();

  }

  return (
    <SafeAreaView>
      <Text onPress={test}>THIS IS DIARY!</Text>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    height: 40,
    color: '#000',
  },
  sign: {
    width: 150,
    height: 50,
    borderWidth: 1,
    backgroundColor: 'orange',
    marginTop: 10
  }
});
