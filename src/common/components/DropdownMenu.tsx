import React, {memo} from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {stylesHeader} from '../../components/diary/contentTab/NotePage/NoteHeader';
import {Fonts} from '../phone/fonts';

type TProps = {
   renderData: {title: string, onPress: ()=>void}[]
}
export const DropdownMenu = memo((props: TProps) => {
  const {renderData} = props;

  const renderItems = () => {
    return renderData.map((item, index) => (
      <TouchableHighlight
        key={'dropdown menu' + index}
        style={styles.titleWrapper}
        underlayColor={'#E5E5E5'}
        onPress={item.onPress}
      >
        <Text style={styles.title}>{item.title}</Text>
      </TouchableHighlight>
    ));
  };
  return (
    <View style={styles.photoMenu}>
      {renderItems()}
    </View>
  );
});
const styles = StyleSheet.create({
  photoMenu: {
    position: 'absolute',
    top: 45,
    right: -10,
    zIndex: 999,
    elevation: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    paddingHorizontal: 16,
  },
  titleWrapper: {
    height: 40,
    //alignItems: 'center',
    justifyContent: 'center',
  }
});
