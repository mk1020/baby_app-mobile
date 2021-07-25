import React, {memo} from 'react';
import {Image, StyleSheet, TextInput, TextInputProps, TouchableOpacity, View} from 'react-native';
import {Fonts} from '../phone/fonts';
import {Images} from '../imageResources';
import {Space} from './Space';

interface TProps extends TextInputProps {
  onPressCancel: ()=> void
  onPressDone: ()=> void
}
export const EditableTextField = memo((props: TProps) => {
  const {onPressCancel, onPressDone, ...other} = props;
  return (
    <View style={styles.container}>
      <TextInput
        autoFocus={true}
        style={styles.text}
        {...other}
      />
      <TouchableOpacity onPress={onPressCancel}>
        <View style={styles.buttonContainer}>
          <Image source={Images.cancel} style={styles.image}/>
        </View>
      </TouchableOpacity>
      <Space.H px={7}/>
      <TouchableOpacity onPress={onPressDone}>
        <View style={styles.buttonContainer}>
          <Image source={Images.done} style={styles.image} />
        </View>
      </TouchableOpacity>
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 13
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 3
  },
  image: {
    width: 30,
    height: 30,
    tintColor: '#FFA100'
  },
  text: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 18,
    color: '#383838',
    marginHorizontal: 8,
    paddingRight: 5
  },
});
