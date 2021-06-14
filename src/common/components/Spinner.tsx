import React, {memo} from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {windowHeight, windowWidth} from '../phone/utils';

export const Spinner = memo(() => {
  return (
    <ActivityIndicator size="large" style={styles.spinner} color={'#FFA500'}/>
  );
});

const styles = StyleSheet.create({
  spinner: {
    position: 'absolute',
    top: windowHeight / 2 - 100,
    left: windowWidth / 2 - 18,
    zIndex: 100
  },
});
