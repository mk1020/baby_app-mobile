import React, {memo, useState} from 'react';
import {Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {Images} from '../../../common/imageResources';
import {Fonts} from '../../../common/phone/fonts';

type TProps = {
  title: string
  onPress: ()=> void
}
export const BookmarkItem = memo((props: TProps) => {
  const {title, onPress} = props;

  return (
    <TouchableHighlight onPress={onPress} underlayColor={'#E5E5E5'}>
      <View style={styles.containerParent}>
        <Text
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={styles.text}
        >
          {title}
        </Text>
        <Image source={Images.arrowDown} style={[styles.arrow]}/>
      </View>
    </TouchableHighlight>
  );
});
const styles = StyleSheet.create({
  containerParent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 52,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(186, 192, 207, 0.4)',
  },
  text: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 18,
    color: '#383838',
    marginLeft: 8,
    flex: 1
  },
  arrow: {
    width: 24,
    height: 24,
    transform: [{rotateZ: '-90deg'}],
    marginLeft: 5
  },
});
