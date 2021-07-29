import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Fonts} from '../../phone/fonts';
import {SliderMode} from './ImagesSlider';

type TProps = {
   slide: number
   totalCount: number
   mode: SliderMode
}
export const SlidesCounter = memo((props: TProps) => {
  const {slide, totalCount, mode} = props;

  return (
    <View style={[mode === SliderMode.Preview ? styles.counterPreview : styles.counterFull]}>
      <Text style={[mode === SliderMode.Preview ? styles.counterTextPreview : styles.counterTextFull]}>{slide}/{totalCount}</Text>
    </View>
  );
});
const styles = StyleSheet.create({
  counterFull: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterTextFull: {
    fontFamily: Fonts.regular,
    fontSize: 21,
    color: '#ffffff',
  },
  counterPreview: {
    width: 34,
    height: 21,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 8,
    top: 8
  },
  counterTextPreview: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 17,
    color: '#ffffff'
  },
});
