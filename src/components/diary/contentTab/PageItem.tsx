import React, {memo, useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, Text, TextInput, TouchableHighlight, View} from 'react-native';
import {Images} from '../../../common/imageResources';
import {Fonts} from '../../../common/phone/fonts';
import {EditableTextField} from '../../../common/components/EditableTextField';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {PagesTableName} from '../../../model/schema';
import {ConditionView} from '../../../common/components/ConditionView';

type TProps = {
  name: string
  id: string
  onPress: ()=> void
  onLongPress?: ()=> void
  asItemChapter?: boolean
  withSeparator?: boolean
  onFinalEdit: ()=> void
  editable: boolean
}
export const PageItem = memo((props: TProps) => {
  const {
    onPress,
    asItemChapter,
    withSeparator = true,
    onLongPress,
    editable,
    onFinalEdit,
    id
  } = props;
  const [name, changeName] = useState(props.name);

  const db = useDatabase();

  useEffect(() => {
    changeName(props.name);
  }, [props.name]);

  const onPressDone = async () => {
    try {
      const page = await db.get(PagesTableName).find(id);
      // @ts-ignore
      await page.updateName(name);
      onFinalEdit();
    } catch (e) {
      console.log(e);
    }
  };

  const onPressCancel = () => {
    changeName(props.name);
    onFinalEdit();
  };
  return (
    <TouchableHighlight
      onPress={onPress}
      onLongPress={onLongPress}
      underlayColor={'#E5E5E5'}
      delayLongPress={150}
    >
      <View style={[withSeparator && styles.separator]}>
        <View style={[styles.container, asItemChapter && styles.marginLeft]}>
          <Image style={styles.pageIcon} source={Images.page} />
          <ConditionView showIf={editable}>
            <EditableTextField
              value={name}
              onChangeText={changeName}
              onPressCancel={onPressCancel}
              onPressDone={onPressDone}
            />
          </ConditionView>
          <ConditionView showIf={!editable}>
            <Text
              style={styles.name}
              numberOfLines={1}
              ellipsizeMode={'tail'}
            >
              {name}
            </Text>
          </ConditionView>
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
    alignItems: 'center',
  },
  marginLeft: {
    marginLeft: 42
  },
  name: {
    flex: 1,
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
