import React, {memo, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {NavigationPages} from '../../navigation/pages';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {TAuthPagesList} from '../../navigation/types';
import {req} from '../../common/assistant/api';
import {RootStoreType} from '../../redux/rootReducer';
import {AxiosError} from 'axios';
import {isEmptyObj} from '../../common/assistant/others';

type TProps = {
  route: RouteProp<TAuthPagesList, NavigationPages.Diary>
}

export const Main = memo((props:TProps) => {
  const {t, i18n} = useTranslation();
  const [mainInfo, setMainInfo] = useState<any>();

  const {params} = props.route;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const token = useSelector(((state: RootStoreType) => state.app.userToken));

  const getMainInfo = () => {
    req(token, dispatch).get('/mainScreen')
      .then(res => {
        setMainInfo(res.data);
      })
      .catch((err: AxiosError) => {
        console.log(err.response || err);
      });
  };

  return (
    <SafeAreaView>
      <Text>THIS IS MAIN!</Text>
      <TouchableOpacity onPress={getMainInfo} style={styles.sign}>
        <Text>GET USER ID</Text>
      </TouchableOpacity>
      <Text>USER ID: {mainInfo?.user?.id}</Text>
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
