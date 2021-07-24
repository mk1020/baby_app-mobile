import React, {memo} from 'react';
import {Image, ImageURISource, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Fonts} from '../phone/fonts';

type TProps = {
  image: ImageURISource
  title: string
  onPress: ()=> void
}
export const ButtonIconVert = memo((props: TProps) => {
  const {image, title, onPress} = props;

  return (
    <TouchableOpacity style={styles.buttonWrapper} onPress={onPress} >
      <Image source={image} style={styles.image}/>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
});
const styles = StyleSheet.create({
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 48,
    height: 48,
    tintColor: '#FFA100'
  },
  title: {
    fontFamily: Fonts.regular,
    fontSize: 16,
  }
});
