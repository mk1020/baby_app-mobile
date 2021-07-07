import React, {memo} from 'react';
import {Image, ImageURISource, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Images} from '../../common/imageResources';
import {ColorsByTheme} from '../colorsByTheme';

type TProps = {
  icon: ImageURISource
}


export const HeaderButton = memo((props: TProps) => {
  const {icon} = props;

  return (
    <TouchableOpacity style={styles.container}>
      <Image source={icon} style={styles.icon}/>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowOffset: {
      width: 2,
      height: 4
    },
    shadowRadius: 10,
    shadowColor: 'rgba(65, 195, 205, 0.25)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 24,
    height: 24
  }
});
