import React, {memo, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {signOut} from '../../../redux/appSlice';
import {useDispatch} from 'react-redux';

type TProps = {

}
export const ContentTab = memo((props: TProps) => {
  const {} = props;
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(signOut());
  };
  return (
    <View>
      <Text>text text</Text>
      <TouchableOpacity onPress={logOut} style={styles.sign}>
        <Text>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
});
const styles = StyleSheet.create({
  sign: {
    width: 150,
    height: 50,
    borderWidth: 1,
    backgroundColor: 'orange',
    marginTop: 10,
    zIndex: 999,
  }
});