import React, {memo} from 'react';
import {Image, ImageURISource, StyleSheet, Text, TouchableHighlight, TouchableWithoutFeedback, View} from 'react-native';
import {Images} from '../../common/imageResources';
import {Fonts} from '../../common/phone/fonts';
import {useTranslation} from 'react-i18next';
import {ConditionView} from '../../common/components/ConditionView';

type TProps = {
  title: string
  subTitle?: string
  onPress: ()=> void
  icon: ImageURISource
  iconTintColor?: string
}
export const MenuItem = memo((props: TProps) => {
  const {title, onPress, icon, subTitle, iconTintColor} = props;
  const {t} = useTranslation();

  return (
    <TouchableHighlight onPress={onPress} underlayColor={'gray'}>
      <View style={styles.container}>
        <Image source={icon} style={[styles.image, iconTintColor ? {tintColor: iconTintColor} : null]}/>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode={'tail'}>{title}</Text>
          <ConditionView showIf={!!subTitle}>
            <Text style={styles.subTitle} numberOfLines={1} ellipsizeMode={'tail'}>{subTitle}</Text>
          </ConditionView>
        </View>
      </View>
    </TouchableHighlight>
  );
});
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  textContainer: {
    justifyContent: 'center',
  },
  image: {
    height: 36,
    width: 36,
    marginRight: 8
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
  subTitle: {
    fontFamily: Fonts.regular,
    flexShrink: 12,
    color: 'gray'
  },
});
