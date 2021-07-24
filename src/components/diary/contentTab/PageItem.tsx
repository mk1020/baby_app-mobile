import React, {memo} from 'react';
import {Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {Images} from '../../../common/imageResources';
import {Fonts} from '../../../common/phone/fonts';

type TProps = {
  name: string
  onPress: ()=> void
  asItemChapter?: boolean
  withSeparator?: boolean
}
export const PageItem = memo((props: TProps) => {
  const {name, onPress, asItemChapter, withSeparator = true} = props;

  return (
    <TouchableHighlight onPress={onPress} underlayColor={'#E5E5E5'}>
      <View style={[withSeparator && styles.separator]}>
        <View style={[styles.container, asItemChapter && styles.marginLeft]}>
          <Image style={styles.pageIcon} source={Images.page} />
          <Text
            style={styles.name}
            numberOfLines={1}
            ellipsizeMode={'tail'}
          >
            {name}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
});
const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(186, 192, 207, 0.4)',
  },
  container: {
    height: 46,
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center'
  },
  marginLeft: {
    marginLeft: 42
  },
  name: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 18,
    color: '#383838',
    marginLeft: 8
  },
  pageIcon: {
    width: 16,
    height: 16
  }
});
