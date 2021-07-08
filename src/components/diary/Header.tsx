import {Image, StyleSheet, Text, View} from 'react-native';
import {Images} from '../../common/imageResources';
import {HeaderButton} from '../../common/components/HeaderButton';
import {Fonts} from '../../common/phone/fonts';
import React, {memo} from 'react';

type TProps = {
   title: string
}
export const Header = memo((props: TProps) => {
  const {title} = props;

  return (
    <View style={styles.container}>
      <HeaderButton icon={Images.bell}/>
      <View style={styles.titleWrapper}>
        <Text style={styles.title} numberOfLines={3} ellipsizeMode={'tail'}>{title}</Text>
      </View>
      <View style={styles.rightButtons}>
        <View style={styles.addIconWrapper}>
          <HeaderButton icon={Images.add}/>
        </View>
        <HeaderButton icon={Images.diary}/>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
  },
  titleWrapper: {
    flex: 1,
    marginHorizontal: 8,
  },
  title: {
    color: '#383838',
    fontFamily: Fonts.regular,
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.26,
    alignSelf: 'center'
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  addIconWrapper: {
    marginRight: 16
  }
});
