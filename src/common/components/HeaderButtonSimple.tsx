import React, {memo} from 'react';
import {Image, ImageStyle, ImageURISource, Platform, StyleSheet, TouchableHighlight, TouchableOpacity, View} from 'react-native';

type TProps = {
  icon: ImageURISource
  onPress?: ()=> void
  imageStyle?: ImageStyle
}

export const HeaderButtonSimple = memo((props: TProps) => {
  const {icon, onPress, imageStyle} = props;

  return (
    <View style={styles.container}>
      <TouchableHighlight style={styles.button} onPress={onPress} underlayColor={'rgb(172, 124, 52)'} >
        <Image source={icon} style={[styles.icon, imageStyle]}/>
      </TouchableHighlight>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: '#fff'
  }
});
