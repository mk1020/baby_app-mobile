import React, {memo} from 'react';
import {Platform, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {Fonts} from '../phone/fonts';

export enum ButtonModes {
  Positive= 'Positive',
  Negative= 'Negative'
}
type TProps = {
  title: string
  mode: ButtonModes
  onPress: () => void
}

export const ButtonFilled = memo((props: TProps) => {
  const {onPress, mode, title} = props;

  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={underlayColorByMode[mode]}
      style={styles.buttonWrapper}
    >
      <View style={[styles.button, backgroundColorByMode[mode]]}>
        <Text style={[styles.buttonText, textColorByMode[mode]]}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
});
const underlayColorByMode = {
  [ButtonModes.Positive]: '#c67200',
  [ButtonModes.Negative]: '#c67200',
};
const backgroundColorByMode = {
  [ButtonModes.Positive]: {backgroundColor: '#FFA100'},
  [ButtonModes.Negative]: {backgroundColor: '#BAC0CF'},
};
const textColorByMode = {
  [ButtonModes.Positive]: {color: '#FFFFFF'},
  [ButtonModes.Negative]: {color: '#000000'},
};
const styles = StyleSheet.create({
  buttonWrapper: {
    marginHorizontal: 16,
    borderRadius: 28,
  },
  button: {
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    height: 49,
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowRadius: 5,
        shadowColor: 'rgba(0, 0, 0, 0.4)',
      },
      android: {
        elevation: 2,
      }
    }),
  },
  buttonText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    lineHeight: 19,
    textTransform: 'uppercase'
  }
});
