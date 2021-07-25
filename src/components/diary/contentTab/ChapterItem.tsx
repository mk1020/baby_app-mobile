import React, {memo, useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {Fonts} from '../../../common/phone/fonts';
import {Images} from '../../../common/imageResources';
import {PageItem} from './PageItem';
import {ConditionView} from '../../../common/components/ConditionView';
import {EditableTextField} from '../../../common/components/EditableTextField';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {ChaptersTableName, PagesTableName} from '../../../model/schema';

type TProps = {
   id: string
   chapterNum: string
   name: string
   pages: any[]
   onPressPage: (pageItem: any)=> void
   onLongPress?: ()=> void
   onLongPressPage: (page: any)=> void
   onFinalEdit: ()=> void
   editable: boolean
  editablePageId: string | null
}
export const ChapterItem = memo((props: TProps) => {
  const {
    chapterNum,
    pages,
    onPressPage,
    onLongPress,
    onLongPressPage,
    editable,
    onFinalEdit,
    id,
    editablePageId
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [name, changeName] = useState(props.name);

  useEffect(() => {
    changeName(props.name);
  }, [props.name]);

  const onPress = () => {
    setIsOpen(!isOpen);
  };

  const db = useDatabase();

  const onPressDoneEdit = async () => {
    try {
      const chapter = await db.get(ChaptersTableName).find(id);
      // @ts-ignore
      await chapter.updateName(name);
      onFinalEdit();
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({item, index}: any) => {
    if (item?.chapterId === '') return null;
    return (
      <PageItem
        onLongPress={() => onLongPressPage(item)}
        name={item?.name}
        onPress={() => onPressPage(item)}
        asItemChapter={true}
        editable={item.id === editablePageId}
        onFinalEdit={onFinalEdit}
        id={item.id}
      />
    );
  };

  return (
    <>
      <TouchableHighlight onPress={onPress} onLongPress={onLongPress} delayLongPress={150} underlayColor={'#E5E5E5'}>
        <View style={styles.containerParent}>
          <ConditionView showIf={editable}>
            <EditableTextField
              value={name}
              onChangeText={changeName}
              onPressCancel={onFinalEdit}
              onPressDone={onPressDoneEdit}
            />
          </ConditionView>
          <ConditionView showIf={!editable}>
            <>
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={styles.name}
              >
                <Text style={{fontFamily: Fonts.bold}}>{chapterNum}. </Text>
                {name}
              </Text>
              <Image source={Images.arrowDown} style={[styles.arrow, isOpen ? styles.arrowDown : styles.arrowRight]}/>
            </>
          </ConditionView>
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
    paddingLeft: 16,
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
    marginRight: 16
  },
  arrowDown: {
    transform: [{rotateZ: '0deg'}],
  },
  arrowRight: {
    transform: [{rotateZ: '-90deg'}],
  },
});
