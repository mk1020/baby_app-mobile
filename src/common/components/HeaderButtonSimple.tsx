import React, {memo} from 'react';
import {Image, ImageStyle, ImageURISource, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';

type TProps = {
  icon: ImageURISource
  onPress?: ()=> void
  imageStyle?: ImageStyle
}

export const HeaderButtonSimple = memo((props: TProps) => {
  const {icon, onPress, imageStyle} = props;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress} >
        <Image source={icon} style={[styles.icon, imageStyle]}/>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: '#fff'
  }
});
