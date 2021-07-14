import {Image, StyleSheet, Text, View} from 'react-native';
import React, {memo, useState} from 'react';
import {Images} from '../../../common/imageResources';
import {Fonts} from '../../../common/phone/fonts';
import {HeaderButton} from '../../../common/components/HeaderButton';
import {ConditionView} from '../../../common/components/ConditionView';
import {AddPageModal} from '../AddPageModal';
import {useNavigation} from '@react-navigation/native';

type TProps = {
   title: string
}
export const CreateNoteHeader = memo((props: TProps) => {
  const {title} = props;
  const navigation = useNavigation();

  const onPressBack = () => {
    navigation.goBack();
  };

  return (
    <View style={stylesHeader.container}>
      <HeaderButton icon={Images.arrowBack} onPress={onPressBack}/>
      <View style={stylesHeader.titleWrapper}>
        <Text style={stylesHeader.title} numberOfLines={3} ellipsizeMode={'tail'}>{title}</Text>
      </View>
      <View style={stylesHeader.rightButtons}>
        <View style={stylesHeader.addIconWrapper}>
          <HeaderButton icon={Images.photo} onPress={() => {}}/>
        </View>
        <HeaderButton icon={Images.delete}/>
      </View>
    </View>
  );
});

export const stylesHeader = StyleSheet.create({
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
