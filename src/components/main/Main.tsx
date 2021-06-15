import React, {memo} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {NavigationPages} from '../../navigation/pages';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {TAuthPagesList} from '../../navigation/types';

type TProps = {
  route: RouteProp<TAuthPagesList, NavigationPages.Diary>
}

export const Main = memo((props:TProps) => {
  const {t, i18n} = useTranslation();

  const {params} = props.route;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <Text>THIS IS MAIN!</Text>
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
