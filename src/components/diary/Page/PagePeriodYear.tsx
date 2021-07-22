import React, {memo, useEffect, useState} from 'react';
import {FlatList, Image, ListRenderItemInfo, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {Fonts} from '../../../common/phone/fonts';
import {Images} from '../../../common/imageResources';
import {ConditionView} from '../../../common/components/ConditionView';
import {Months, PagePeriodMonth} from './PagePeriodMonth';
import {INoteJSEnhanced} from '../assist';

type TProps = {
  year: number
  notesByMonths: {[month: string]: INoteJSEnhanced[]}
}
export const PagePeriodYear = memo((props: TProps) => {
  const {year, notesByMonths} = props;
  const [isOpen, setIsOpen] = useState(false);

  const [months, setMonth] = useState<Months[]>([]);

  useEffect(() => {
    const preparingMonths: Months[] = [];
    Object.keys(notesByMonths).forEach(month => preparingMonths.push(Number(month) as Months));
    setMonth(preparingMonths);
  }, [notesByMonths]);

  const onPress = () => {
    setIsOpen(!isOpen);
  };

  const renderItem = ({item, index}: ListRenderItemInfo<Months>) => {
    return (
      <PagePeriodMonth
        year={year}
        month={item}
        notesInMonth={notesByMonths[item]}
        asItemPastYears={true}
      />
    );
  };

  return (
    <>
      <TouchableHighlight onPress={onPress} underlayColor={'#E5E5E5'}>
        <View style={styles.containerParent}>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={styles.period}
          >
            {year}
          </Text>
          <Image source={Images.arrowDown} style={[styles.arrow, isOpen ? styles.arrowDown : styles.arrowRight]}/>
        </View>
      </TouchableHighlight>
      <ConditionView showIf={isOpen}>
        <FlatList
          data={months}
          renderItem={renderItem}
          keyExtractor={item => item.toString()}
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
