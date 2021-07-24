import React, {memo, useState} from 'react';
import {FlatList, Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {Fonts} from '../../../common/phone/fonts';
import {Images} from '../../../common/imageResources';
import {PageItem} from './PageItem';
import {ConditionView} from '../../../common/components/ConditionView';

type TProps = {
   chapterNum: string
   name: string
   pages: any[]
   onPressPage: ()=> void
}
export const ChapterItem = memo((props: TProps) => {
  const {chapterNum, name, pages, onPressPage} = props;
  const [isOpen, setIsOpen] = useState(false);

  const onPress = () => {
    setIsOpen(!isOpen);
  };

  const renderItem = ({item, index}: any) => {
    if (item?.chapterId === '') return null;
    return (
      <PageItem name={item?.name} onPress={onPressPage} asItemChapter={true} />
    );
  };

  return (
    <>
      <TouchableHighlight onPress={onPress} underlayColor={'#E5E5E5'}>
        <View style={styles.containerParent}>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={styles.name}
          >
            <Text style={{fontFamily: Fonts.bold}}>{chapterNum}. </Text>
            {name}
          </Text>
          <Image source={Images.arrowDown} style={[styles.arrow, isOpen ? styles.arrowDown : styles.arrowRight]}/>
        </View>
      </TouchableHighlight>
      <ConditionView showIf={isOpen}>
        <FlatList
          data={pages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          //extraData={pre}
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(186, 192, 207, 0.4)',
  },
  name: {
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
  },
  arrowDown: {
    transform: [{rotateZ: '0deg'}],
  },
  arrowRight: {
    transform: [{rotateZ: '-90deg'}],
  },
});
