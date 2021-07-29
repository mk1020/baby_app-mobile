import React, {memo} from 'react';
import {Image, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {SliderMode} from './ImagesSlider';

type TProps = {
   uri: string
   onPressImage?: ()=> void
   mode: SliderMode
}
export const SliderImage = memo((props: TProps) => {
  const {uri, onPressImage, mode} = props;

  return (
    <TouchableWithoutFeedback onPress={onPressImage} style={styles.container}>
      <Image source={{uri}} style={styles.image} resizeMode={mode === SliderMode.Preview ? 'cover' : 'contain'} />
    </TouchableWithoutFeedback>
  );
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
});
