import React, {memo} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {NavigationPages} from '../../navigation/pages';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {TAuthPagesList} from '../../navigation/types';
import {signOut} from '../../redux/appSlice';

type TProps = {
  route: RouteProp<TAuthPagesList, NavigationPages.Diary>
}

export const Diary = memo((props:TProps) => {
  const {t, i18n} = useTranslation();

  const {params} = props.route;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const logOut = () => {
    dispatch(signOut());
  };

  return (
    <SafeAreaView>
      <Text>THIS IS DIARY!</Text>
      <TouchableOpacity onPress={logOut} style={styles.sign}>
        <Text>LOGOUT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  sign: {
    width: 150,
    height: 50,
    borderWidth: 1,
    backgroundColor: 'orange',
    marginTop: 10
  }
});
