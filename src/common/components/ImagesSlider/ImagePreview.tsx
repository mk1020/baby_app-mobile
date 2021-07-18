import React, {memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';

type TProps = {
   uri: string
}
export const ImagePreview = memo((props: TProps) => {
  const {uri} = props;

  return (
    <View style={styles.container}>
      <Image source={{uri}} style={styles.image}/>
    </View>
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
