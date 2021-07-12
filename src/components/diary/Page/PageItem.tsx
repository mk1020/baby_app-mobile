import React, {memo, useState} from 'react';
import {FlatList, Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {Fonts} from '../../../common/phone/fonts';
import {Images} from '../../../common/imageResources';
import {ConditionView} from '../../../common/components/ConditionView';
import {NoteItem} from './NoteItem';

type TProps = {
  period: string
  notes: any[]
}
export const PageItem = memo((props: TProps) => {
  const {period, notes} = props;
  const [isOpen, setIsOpen] = useState(false);

  const onPress = () => {
    setIsOpen(!isOpen);
  };

  const renderItem = ({item, index}: any) => {
    return (
      <NoteItem
        date={12312312}
        title={'Тест заголовок'}
        text={'И по этому поводу нас вчера было просто  И по этому поводу нас вчера было просто '}
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
            {period}
          </Text>
          <Image source={Images.arrowDown} style={[styles.arrow, isOpen ? styles.arrowUp : styles.arrowDown]}/>
        </View>
      </TouchableHighlight>
      <ConditionView showIf={isOpen}>
        <FlatList
          data={notes}
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
  arrowUp: {
    transform: [{rotateZ: '180deg'}],
  },
});
