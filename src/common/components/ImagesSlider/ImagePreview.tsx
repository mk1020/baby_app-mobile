import React, {memo} from 'react';
import {Image, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';

type TProps = {
   uri: string
   onPressImage?: ()=> void
}
export const ImagePreview = memo((props: TProps) => {
  const {uri, onPressImage} = props;

  return (
    <TouchableWithoutFeedback onPress={onPressImage} style={styles.container}>
      <Image source={{uri}} style={styles.image}/>
    </TouchableWithoutFeedback>
  );
});
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    flex: 1
  },
});
