import React, {memo} from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';

export const Spinner = memo(() => {
  return (
    <ActivityIndicator size="large" style={styles.spinner} color={'#FFA500'}/>
  );
});

const styles = StyleSheet.create({
  spinner: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    zIndex: 100
  },
});
