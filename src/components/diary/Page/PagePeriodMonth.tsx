import React, {memo, useEffect, useState} from 'react';
import {FlatList, Image, ListRenderItem, ListRenderItemInfo, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {Fonts} from '../../../common/phone/fonts';
import {Images} from '../../../common/imageResources';
import {ConditionView} from '../../../common/components/ConditionView';
import {NoteItem} from './NoteItem';
import {INoteJS} from '../../../model/types';
import {useTranslation} from 'react-i18next';
import {monthByNum} from '../assist';
import {useNavigation} from '@react-navigation/native';
import {NavigationPages} from '../../../navigation/pages';

export type Months = 0|1|2|3|4|5|6|7|8|9|10|11;
type TProps = {
  year: number
  month: Months
  notesInMonth:  INoteJS[]
  asItemPastYears?: boolean
  open: boolean
}
export const PagePeriodMonth = memo((props: TProps) => {
  const {year, notesInMonth, month, asItemPastYears = false, open} = props;

  const [isOpen, setIsOpen] = useState(open);
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();

  const onPress = () => {
    setIsOpen(!isOpen);
  };
  const onPressNote = () => {
    navigation.navigate(NavigationPages.CreateNote);
  };
  const renderItem = ({item, index}: ListRenderItemInfo<INoteJS>) => {
    return (
      <NoteItem
        date={item.createdAt}
        title={item.title}
        text={item.note}
        onPress={onPressNote}
      />
    );
  };

  return (
    <>
      <TouchableHighlight onPress={onPress} underlayColor={'#E5E5E5'}>
        <View style={[styles.containerParent, asItemPastYears && styles.marginLeft]}>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={styles.period}
          >
            {monthByNum(t)[month]} {year}
          </Text>
          <Image source={Images.arrowDown} style={[styles.arrow, isOpen ? styles.arrowDown : styles.arrowRight]}/>
        </View>
      </TouchableHighlight>
      <ConditionView showIf={isOpen}>
        <FlatList
          data={notesInMonth}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </ConditionView>
    </>
  );
});

const styles = StyleSheet.create({
  containerParent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 52,
    alignItems: 'center',
  },
  marginLeft: {
    marginLeft: 16
  },
  period: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 18,
    color: '#41C3CD',
    marginLeft: 8
  },
  arrow: {
    width: 24,
    height: 24,
  },
  arrowDown: {
    transform: [{rotateZ: '0deg'}],
  },
  arrowRight: {
    transform: [{rotateZ: '-90deg'}],
  },
});