import React, {memo} from 'react';
import {Image, ImageURISource, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Images} from '../../common/imageResources';
import {ColorsByTheme} from '../colorsByTheme';
import {isIos} from '../phone/utils';

type TProps = {
  icon: ImageURISource
}


export const HeaderButton = memo((props: TProps) => {
  const {icon} = props;

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Image source={icon} style={styles.icon}/>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 4
        },
        shadowRadius: 10,
        shadowColor: 'rgba(65, 195, 205, 0.25)',
      },
      android: {
        elevation: 3,
      }
    }),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24
  }
});
